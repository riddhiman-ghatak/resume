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

const ServicePrincipalCredentials = require('./service-principal-credentials');
const _ = require('lodash');
const SCOPES_BLANK_ERROR = "scopes must not be blank";

class ServicePrincipalCredentialsBuilder {
	/**
	 * @hideconstructor
	 */
	constructor() {

	}

	/**
	 * Set the client id (API Key)
	 * @param {!String} clientId - Client Id (API Key)
	 * @returns {ServicePrincipalCredentialsBuilder} This Builder instance to add any additional parameters.
	 */
	withClientId(clientId) {
		this._clientId = clientId;
		return this;
	}

	/**
	 * Set the client secret
	 * @param {!String} clientSecret - Client Secret
	 * @returns {ServicePrincipalCredentialsBuilder} This Builder instance to add any additional parameters.
	 */
	withClientSecret(clientSecret) {
		this._clientSecret = clientSecret;
		return this;
	}

	/**
	 * Returns a new {@link ServicePrincipalCredentials} instance built from the current state of this builder.
	 * @returns {ServicePrincipalCredentials} A ServicePrincipalCredentials instance.
	 */
	build() {
		let servicePrincipalCredentials = new ServicePrincipalCredentials(this._clientId, this._clientSecret);
		Object.freeze(servicePrincipalCredentials);
		return servicePrincipalCredentials;

	}
}

module.exports = ServicePrincipalCredentialsBuilder;
