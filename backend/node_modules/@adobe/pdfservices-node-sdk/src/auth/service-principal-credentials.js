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

const
	Schema = require('validate');

/**
 * OAuth Server-to-Server based Service Principal credentials allows your application to call PDF Services API.
 * For getting the credentials,
 * <a href="https://www.adobe.com/go/dcsdks_credentials?ref=getStartedWithServicesSdk">Click Here</a>
 */
class ServicePrincipalCredentials {
	/**
	 * @hideconstructor
	 */
	constructor(client_id, client_secret) {
		this._clientId = client_id;
		this._clientSecret = client_secret;
		this.validate();
	}

	/**
	 * Client Id (API Key)
	 * @readonly
	 * @type {String}
	 */
	get clientId() {
		return this._clientId;
	}

	/**
	 * Client secret
	 * @readonly
	 * @type {String}
	 */
	get clientSecret() {
		return this._clientSecret;
	}

	validate() {
		const ServicePrincipalValidator = new Schema({
			'_clientId': {
				required: true,
				message: 'client_id must not be blank'
			},
			'_clientSecret': {
				required: true,
				message: 'client_secret must not be blank'
			},
		});

		const config = Object.assign({},
			{
				_clientId: this._clientId,
				_clientSecret: this._clientSecret
			});

		const errors = ServicePrincipalValidator.validate(config);
		if (errors.length > 0) {
			const messages = [];
			errors.forEach(err => messages.push(err.message));
			throw new Error(messages.join('; '));
		}
	}

}


module.exports = ServicePrincipalCredentials;
