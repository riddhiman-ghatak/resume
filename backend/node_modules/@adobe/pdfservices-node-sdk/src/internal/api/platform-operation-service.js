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

const PlatformApi = require('../api/platform-api'),
	{writeFile} = require("../util/file-util"),
	logger = require('./../logger');

/**
 * Operation Service is an abstract class. All the document operation services need to inherit this class and have to
 * override getPlatformMessage. PlatformApi class is used for making the Upload, Create Job, Status and Download API calls.
 */
class PlatformOperationService {

	constructor() {
		if (this.constructor === PlatformOperationService) {
			throw new TypeError("Can not construct PlatformOperationService class.");
		}
	}

	getPlatformMessage(operationMessage) {
		throw new Error("Method 'getPlatformMessage()' must be implemented.");
	}

	getUploadAssetList(responses) {
		let uploadAssetList;
		uploadAssetList = responses.map((response) => {
			return response.content.assetID;
		});
		return uploadAssetList;
	}

	getAssetListOrMetadata(response) {
		return [response.content.asset.downloadUri];
	}

	writeFileToLocal(responses, platformMessage) {
		let fileRef = writeFile(responses[0].content, platformMessage.targetFileName);
		fileRef.input.isOperationResult = true;
		return Promise.resolve(fileRef);
	}

	createRequestBodyContentForCreateJob(platformMessage, assetIDs = null) {
		let content = {};
		content = Object.assign(content, platformMessage.options);
		content = Object.assign(content, {assetID: assetIDs[0]});
		return content;
	}

	perform(context, operationMessage) {
		let platformMessage = this.getPlatformMessage(operationMessage);
		if (platformMessage.isUploadNeeded === false) {
			const content = this.createRequestBodyContentForCreateJob(platformMessage);
			return this.createJobAndFetchStatus(context, platformMessage, null, content);
		} else {
			return PlatformApi.uploadFile(context, platformMessage)
				.then(response => {
					const locations = this.getUploadAssetList(response);
					const content = this.createRequestBodyContentForCreateJob(platformMessage, locations);
					return this.createJobAndFetchStatus(context, platformMessage, locations, content);
				})
				.catch(err => Promise.reject(err));
		}
	}

	createJobAndFetchStatus(context, platformMessage, locations, content) {
		return PlatformApi.createAndFetchStatus(context, platformMessage, locations, content)
			.then(response => {
				logger.info(platformMessage.operationNameHeader + " successfully completed");
				return this.getOperationResult(context, response, platformMessage);
			})
			.catch(err => Promise.reject(err));
	}

	// This method handles the generic response of downloading files for all the operations.
	// In case some specific handling is required please override this method in the operation specific service class.
	getOperationResult(context, response, platformMessage) {
		let assetListOrMetadata = this.getAssetListOrMetadata(response, platformMessage);
		return PlatformApi.downloadFile(context, platformMessage, assetListOrMetadata)
			.then(response => {
				let fileRef = this.writeFileToLocal(response, platformMessage);
				return Promise.resolve(fileRef);
			})
			.catch(err => Promise.reject(err));
	}
}

module.exports = PlatformOperationService;
