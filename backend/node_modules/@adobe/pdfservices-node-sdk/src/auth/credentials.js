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

const ServiceAccountCredentialsBuilder = require('./service-account-credentials-builder');
const ServicePrincipalCredentialsBuilder = require('./service-principal-credentials-builder');
const util = require('util');

/**
 * Marker base class for different types of credentials.
 * Currently it supports {@link ServiceAccountCredentials} and {@link ServicePrincipalCredentials}
 * The factory methods within this class can be used to create instances of credentials classes.
 */
class Credentials {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 *
	 * Creates a new {@link ServiceAccountCredentials} builder.
	 * @deprecated JWT based service account credentials has been deprecated. Please use OAuth Server-to-Server based {@link ServicePrincipalCredentials}.
 	 * @memberOf Credentials
	 * @function
	 * @returns {ServiceAccountCredentials} A new ServiceAccountCredentials instance.
	 *
	 */
	static serviceAccountCredentialsBuilder = util.deprecate(
		() => new ServiceAccountCredentialsBuilder(),
		"serviceAccountCredentialsBuilder() has been deprecated, please move to servicePrincipalCredentialsBuilder() instead"
	)

	/**
	 *
	 * Creates a new {@link ServicePrincipalCredentials} builder.
	 * @memberOf Credentials
	 * @function
	 * @returns {ServicePrincipalCredentials} A new ServicePrincipalCredentials instance.
	 *
	 */
	static servicePrincipalCredentialsBuilder() {
		return new ServicePrincipalCredentialsBuilder();
	}
}

module.exports = Credentials;


