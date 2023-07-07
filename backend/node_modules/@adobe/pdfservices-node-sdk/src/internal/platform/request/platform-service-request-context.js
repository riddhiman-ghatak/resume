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

const _ = require('lodash-core'),
	DCDefaultConfig = require('../../config/dc-services-default-config'),
	HttpRequest = require('../../http/http-request'),
	RequestKeys = require('./platform-service-request-keys');

class PlatformServiceRequestContext {
	constructor(clientConfig) {
		Object.defineProperty(this, 'clientConfig', {
			value: clientConfig,
			writable: false
		});

		this.baseOptions = null;

	}

	setOptionsMaps() {

		const baseOptions = new Map();

		// Common request options
		let requestOptions = {
			headers: {
				'x-api-app-info': DCDefaultConfig.appInfo
			},
			authenticate: true
		};
		let	unauthenticatedRequestOptions = {
			headers: {},
		};

		//Initialize post asset upload uri template
		const postAssetPreSignedUploadUri = {};
		postAssetPreSignedUploadUri.requestConfig = {
			method: 'POST',
			uriTemplate: this.clientConfig.pdfServicesUri + "/assets",
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		// Add default headers and any custom options.
		_.extend(postAssetPreSignedUploadUri, requestOptions);
		baseOptions.set(RequestKeys.POST_PRESIGNED_ASSETS_UPLOAD_URI, postAssetPreSignedUploadUri);

		const createJobOptions = {};
		createJobOptions.requestConfig = {
			method: 'POST',
			uriTemplate: this.clientConfig.pdfServicesUri +"/operation/{operationName}",
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		_.extend(createJobOptions, requestOptions);
		baseOptions.set(RequestKeys.CREATE_JOB, createJobOptions);

		const pollJobOptions = {};
		pollJobOptions.requestConfig = {
			method: 'GET',
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		_.extend(pollJobOptions, requestOptions);
		baseOptions.set(RequestKeys.POLL_JOB, pollJobOptions);

		const getPreSignedUriOptions = {};
		getPreSignedUriOptions.requestConfig = {
			method: 'GET',
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		_.extend(getPreSignedUriOptions, requestOptions);
		baseOptions.set(RequestKeys.GET_PRE_SIGNED_ASSETS_DOWNLOAD_URI, getPreSignedUriOptions);

		const putAssetToS3Options = {};
		putAssetToS3Options.requestConfig = {
			method: 'PUT',
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		// Add default headers and any custom options.
		_.extend(putAssetToS3Options, unauthenticatedRequestOptions);
		baseOptions.set(RequestKeys.PUT_ASSET_TO_S3, putAssetToS3Options);

		const getAssetFromS3Options = {};
		getAssetFromS3Options.requestConfig = {
			method: 'GET',
			connectTimeout: this.clientConfig.connectTimeout,
			readTimeout: this.clientConfig.readTimeout
		};

		// Add default headers and any custom options.
		_.extend(getAssetFromS3Options, unauthenticatedRequestOptions);
		baseOptions.set(RequestKeys.GET_ASSETS_FROM_S3, getAssetFromS3Options);

		this.setBaseOptions(baseOptions);
	}

	setBaseOptions(baseOptions) {
		this.baseOptions = baseOptions;
	}

	getBaseHttpRequest(key) {
		if (this.baseOptions === null) {
			this.setOptionsMaps();
		}
		const baseOptions = this.baseOptions.get(key);
		return new HttpRequest(_.cloneDeep(baseOptions));
	}
}

module.exports = PlatformServiceRequestContext;
