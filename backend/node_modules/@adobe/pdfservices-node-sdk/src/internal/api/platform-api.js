/*
 * Copyright 2019 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const RequestKeys = require('../platform/request/platform-service-request-keys');
const ServicePrincipalCredentials = require('../../auth/service-principal-credentials');
const API_KEY_HEADER_NAME = "x-api-key";
const X_REQUEST_ID_HEADER_NAME = "x-request-id";
const CONTENT_TYPE_HEADER_NAME = "Content-Type";
const CONTENT_LENGTH_HEADER_NAME = "Content-Length";
const APPLICATION_JSON_CONTENT = "application/json";
const X_OPERATION_HEADER_NAME = "x-dcsdk-ops-info";
const DONE_JOB_STATUS = "done";
const FAILED_JOB_STATUS = "failed";
const IN_PROGRESS_JOB_STATUS = "in progress";
const logger = require('./../logger');
const ServiceApiError = require("../../error/service-api-error");
const StringUtil = require("../util/string-util");
const ServiceUsageError = require("../../error/service-usage-error");
const POLLING_INTERVAL = 1000;

const PlatformApi = {
	uploadFile(context, platformMessage) {
		logger.debug("Started file upload");
		return new Promise((resolve, reject) => {
			let getAssetsPreSignedUriPromises;
			let fileDataBuffer = [];
			getAssetsPreSignedUriPromises = platformMessage.files.map((file, index) => {
				return getFileData(file).then(fileData => {
					fileDataBuffer[index] = {
						data: fileData.data,
						mediaType: file.input.mediaType
					};
					return callApiUtil(context, RequestKeys.POST_PRESIGNED_ASSETS_UPLOAD_URI, file, platformMessage);
				}).catch(err => reject(err));
			});
			return Promise.all(getAssetsPreSignedUriPromises)
				.then(preSignedUrisResponses => {
					checkForErrorsInPromises(preSignedUrisResponses);
					let putAssetToS3Promises;
					putAssetToS3Promises = preSignedUrisResponses.map((preSignedUriResponse, index) => {
						return callUnauthenticatedApiUtil(context, RequestKeys.PUT_ASSET_TO_S3, fileDataBuffer[index], preSignedUriResponse.content.uploadUri);
					});
					return Promise.all(putAssetToS3Promises)
						.then(putAssetResponses => {
							checkForErrorsInPromises(putAssetResponses);
							resolve(preSignedUrisResponses);
						})
						.catch(err => reject(err));
				})
				.catch(err => reject(err));
		});
	},

	createAndFetchStatus(context, platformMessage, location, content) {
		logger.debug("Creating Job for operation");
		return new Promise((resolve, reject) => {
			let createJobApiPromise = callApiUtil(context, RequestKeys.CREATE_JOB, location, platformMessage, content);
			createJobApiPromise
				.then(result => {
					if (result.status === 201) {
						logger.debug("Started poll job");
						let pollJobLocation = result.headers.location;
						const startTime = new Date();
						return jobPolling(context, RequestKeys.POLL_JOB, pollJobLocation, platformMessage, startTime)
							.then(result => {
								resolve(result);
							})
							.catch(err => reject(err));
					} else {
						checkForErrorInPromiseAndThrowException(result);
					}
				})
				.catch(err => reject(err));
		});
	},

	downloadFile(context, platformMessage, assetList) {
		logger.debug("Started download file");
		return new Promise((resolve, reject) => {
			let getAssetsFromS3Promises;
			getAssetsFromS3Promises = assetList.map((asset) => {
				return callUnauthenticatedApiUtil(context, RequestKeys.GET_ASSETS_FROM_S3, platformMessage, asset);
			});
			return Promise.all(getAssetsFromS3Promises)
				.then(responses => {
					checkForErrorsInPromises(responses);
					logger.debug("File download complete");
					resolve(responses);
				})
				.catch(err => reject(err));
		});
	}
};

const getFileData = (file) => {
	return new Promise((resolve, reject) => {
		let fileStream = file.input.asStream;
		let bufferChunks = [];

		fileStream.on('data', chunk => {
			bufferChunks.push(chunk);
		});

		fileStream.on('end', () => {
			const fileData = {
				data: Buffer.concat(bufferChunks)
			};
			resolve(fileData);
		});

		fileStream.on('error', error => reject(error));
	});
};


const callApiUtil = (context, requestKey, location, platformMessage, content) => context.getBaseRequestFromRequestContext(requestKey, true)
	.then(httpRequest => {
		const apiKey = context.credentials instanceof ServicePrincipalCredentials ?
			context.credentials.clientId :
			context.credentials.getClientId();

		httpRequest = httpRequest
			.withHeader(API_KEY_HEADER_NAME, apiKey)
			.withHeader(X_REQUEST_ID_HEADER_NAME, platformMessage.requestId)
			.withHeader(X_OPERATION_HEADER_NAME, platformMessage.operationNameHeader);
		switch (requestKey) {
			case RequestKeys.CREATE_JOB :
				httpRequest = httpRequest
					.withHeader(CONTENT_TYPE_HEADER_NAME, APPLICATION_JSON_CONTENT)
					.withUriParams({operationName: platformMessage.operationName})
					.withBodyContent(content);
				break;
			case RequestKeys.POLL_JOB :
			case RequestKeys.GET_PRE_SIGNED_ASSETS_DOWNLOAD_URI :
				httpRequest = httpRequest
					.withUri(location);
				break;
			case RequestKeys.POST_PRESIGNED_ASSETS_UPLOAD_URI :
				let sourceFileRef;
				sourceFileRef = location;
				httpRequest = httpRequest
					.withHeader(CONTENT_TYPE_HEADER_NAME, APPLICATION_JSON_CONTENT)
					.withBodyContent({"mediaType": sourceFileRef.input._mediaType});
		}
		return httpRequest.call();
	}).catch(err => Promise.reject(err));


const callUnauthenticatedApiUtil = (context, requestKey, fileData, uri) => {
	return new Promise((resolve, reject) => {
		let getBaseRequestPromise = context.getBaseRequestFromRequestContext(requestKey, false);
		getBaseRequestPromise.then(httpRequest => {
			if (requestKey === RequestKeys.GET_ASSETS_FROM_S3) {
				httpRequest = httpRequest
					.withUri(uri);
				resolve(httpRequest.call());
			} else if (requestKey === RequestKeys.PUT_ASSET_TO_S3) {
				httpRequest = httpRequest
					.withHeader(CONTENT_TYPE_HEADER_NAME, fileData.mediaType)
					.withHeader(CONTENT_LENGTH_HEADER_NAME, fileData.data.byteLength)
					.withBodyContent(fileData.data)
					.withUri(uri);
				resolve(httpRequest.call());
			}
		}).catch(err => reject(err));
	});
};

const jobPolling = (context, requestKey, pollJobLocation, platformMessage, startTime) => {
	return new Promise((resolve, reject) => {
		const currentTime = new Date();
		if (currentTime - startTime > context.clientConfig.getProcessingTimeout()) {
			logger.debug('Aborting conversion that is taking too long.');
			reject(new ServiceApiError(
				'Operation execution has timed out!',
				StringUtil.getRequestIdFromLocation(location)
			));
		}
		let pollJobPromise = callApiUtil(context, requestKey, pollJobLocation, platformMessage);
		pollJobPromise.then(result => {
			if (result.status === 200) {
				if (result.content.status === DONE_JOB_STATUS) {
					logger.debug("Poll job completed");
					resolve(result);
				} else if (result.content.status === IN_PROGRESS_JOB_STATUS) {
					logger.debug("Poll job in progress");
					setTimeout(() => {
						resolve(jobPolling(context, requestKey, pollJobLocation, platformMessage, startTime));
					}, POLLING_INTERVAL)
				} else if (result.content.status === FAILED_JOB_STATUS) {
					let error = result.content.error;
					throw new ServiceApiError(error.message, result.headers[X_REQUEST_ID_HEADER_NAME], error.status, error.code);
				}
			} else {
				checkForErrorInPromiseAndThrowException(result);
			}
		}).catch(err => reject(err));
	});
};

const checkForErrorsInPromises = (promisesResult) => {
	promisesResult.forEach((promiseResultResponse) => {
		if (promiseResultResponse.status !== 200) {
			checkForErrorInPromiseAndThrowException(promiseResultResponse);
		}
	});
};

const checkForErrorInPromiseAndThrowException = (promiseResultResponse) => {
	let error = promiseResultResponse.content.error;
	if (promiseResultResponse.status === 429) {
		throw new ServiceUsageError(error.message, promiseResultResponse.headers[X_REQUEST_ID_HEADER_NAME], promiseResultResponse.status, error.code);
	} else {
		throw new ServiceApiError(error.message, promiseResultResponse.headers[X_REQUEST_ID_HEADER_NAME], promiseResultResponse.status, error.code);
	}
};


module.exports = PlatformApi;
