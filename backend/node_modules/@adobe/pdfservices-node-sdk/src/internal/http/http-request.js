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

const httpUtil = require('./http-client').http,
	httpHandler = require('./http-handler').handleJsonHttp,
	DCDefaultConfig = require('./../config/dc-services-default-config'),
	UrlTemplate = require('url-template'),
	logger = require('./../logger'),
	querystring = require('querystring'),
	FormData = require('form-data');

/* eslint class-methods-use-this:0 */

const multipart_content_size_limit = 104857600; // 100 MBs in bytes

/**
 * Utility method to convert the dc request options like headers, timeouts, etc. to a format understood by the
 * http client which is used.
 * @param dcRequestOptions
 */
const convertToHttpRequestOptions = dcRequestOptions => {
	const httpRequestOptions = Object.assign({}, dcRequestOptions, {requestConfig: undefined}),
		requestConfig = dcRequestOptions.requestConfig;
	// Uri template will be set by all the operation API calls
	if (requestConfig.uriTemplate) {
		const template = UrlTemplate.parse(requestConfig.uriTemplate);
		requestConfig.uri = template.expand(requestConfig.uriParams);
	}
	if (requestConfig.queryParams) {
		requestConfig.uri += `?${querystring.stringify(requestConfig.queryParams)}`;
	}
	httpRequestOptions.uri = requestConfig.uri;
	httpRequestOptions.method = requestConfig.method;

	// timeout is considered as connect timeout
	httpRequestOptions.timeout = requestConfig.connectTimeout || DCDefaultConfig.http.connectTimeout;
	httpRequestOptions.readTimeout = requestConfig.readTimeout || DCDefaultConfig.http.readTimeout;
	logger.debug(`Resolved request uri : ${requestConfig.uri}`);
	return httpRequestOptions;
};

const isEmpty = obj => {
	return !Object.keys(obj).length;
};

const createFormData = multipartData => {
	let formData = new FormData();
	for (let [key, value] of Object.entries(multipartData)) {
		formData.append(key, value);
	}
	return formData;
};

class HttpRequest {
	constructor(options) {
		this.options = options;
		this.multipartData = {};
	}

	withAuthenticator(identityAccess) {
		this.identityAccess = identityAccess;
		return this;
	}

	withBodyContent(content) {
		this.content = content;
		return this;
	}

	withHeader(key, value) {
		this.options.headers[key] = value;
		return this;
	}

	withUri(uri) {
		this.options.requestConfig.uriTemplate = uri;
		return this;
	}

	withUriParams(uriParams) {
		this.options.requestConfig.uriParams = uriParams;
		return this;
	}

	set uriParams(uriParams) {
		this.options.requestConfig.uriParams = uriParams;
	}

	call() {
		return this.execute()
			.then(result => {

				if ((result.status === 401 || result.statusCode === 401) && this.isAuthRequired()) {
					return this.execute(true)
						.then(res => Promise.resolve(res))
						.catch(err => Promise.reject(err));
				}
				return Promise.resolve(result);
			})
			.catch(err => Promise.reject(err));
	}

	execute(forced = false) {
		return this.authenticate(forced)
			.then(authContent => {

				if (authContent) {
					this.options.headers['Authorization'] = authContent.authToken;
				}
				const ahttp = httpHandler(httpUtil),
					options = convertToHttpRequestOptions(this.options);

				return ahttp.call(options, this.content)
					.then(res => Promise.resolve(res))
					.catch(err => Promise.reject(err));
			})
			.catch(err => Promise.reject(err));
	}

	authenticate(forced) {
		if (this.isAuthRequired()) {

			return this.identityAccess.getSessionToken(forced)
				.then(res => Promise.resolve({
					authToken: `Bearer ${res.access_token}`
				}))
				.catch(err => Promise.reject(err));
		}
		return Promise.resolve(null);
	}

	isAuthRequired() {
		return this.options.authenticate === true;
	}
}

module.exports = HttpRequest;
