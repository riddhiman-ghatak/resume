/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const _ = require('lodash'),
	ServiceApiError = require('../../error/service-api-error'),
	Httprequest = require('../http/http-request'),
	DefaultHeaders = require('../http/default-dc-request-options'),
	DefaultConfig = require('./../config/dc-services-default-config');

class ServicePrincipalAuthenticator {
	constructor(servicePrincipalCredentials, clientConfig) {

		Object.defineProperty(this, '_config', {
			value: servicePrincipalCredentials,
			writable: false
		});
		this._token = null;

		Object.defineProperty(this, '_endpoint', {
			value: `${( clientConfig && clientConfig.getPDFServicesUri() ) || DefaultConfig.pdfServicesUri}/${DefaultConfig.servicePrincipal.uriSuffix}`,
			writable: false,
			enumerable: true
		});

	}

	refreshSessionToken() {
		const options = {headers: {}}
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		options.requestConfig = {
			method: 'POST',
			uri: this._endpoint
		};

		const content = [
			`client_id=${this._config.clientId}`,
			`client_secret=${this._config.clientSecret}`
		].join('&');

		const request = new Httprequest(options).withBodyContent(content);

		return request.call()
			.then(result => {

				if (result.status === 200) {
					result.expiresAt = (new Date().getTime() + (result.content.expires_in * 1000)) - (60 * 1000);
					const token = {
						access_token: result.content.access_token,
						expiresAt: result.expiresAt
					};

					return Promise.resolve(token);
				}
				return Promise.reject(new ServiceApiError(
					result.content.error,
					result.headers[DefaultHeaders.SESSION_TOKEN_REQUEST_ID_HEADER_KEY],
					result.status
				));
			})
			.catch(err => Promise.reject(err));
	}

	set token(token) {
		this._token = token;
	}

	getSessionToken(forced) {
		if (this._token && !forced) {
			if (this._token.expiresAt &&
				new Date().getTime() <= this._token.expiresAt) {
				return Promise.resolve(this._token);
			}
		}
		return this.refreshSessionToken()
			.then(token => {
				this.token = token;
				return Promise.resolve(token);
			})
			.catch(err => Promise.reject(err));
	}
}


module.exports = ServicePrincipalAuthenticator;
