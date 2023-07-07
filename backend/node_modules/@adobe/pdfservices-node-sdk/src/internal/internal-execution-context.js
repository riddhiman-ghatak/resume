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

const
	PlatformServiceRequestContext = require('./platform/request/platform-service-request-context'),
	InternalClientConfig = require('./internal-client-config'),
	AuthenticatorFactory = require('./auth/authenticator-factory'),
	ServiceAccountCredentials = require('../auth/service-account-credentials'),
	ServicePrincipalCredentials = require('../auth/service-principal-credentials'),
	ServiceTokenCredentials = require('./auth/service-token-credentials');


class InternalExecutionContext{
	constructor(credentials, clientConfig){

		if (credentials instanceof ServiceAccountCredentials ||
			credentials instanceof ServicePrincipalCredentials  ||
			credentials instanceof ServiceTokenCredentials) {
			if (clientConfig instanceof InternalClientConfig)
				this.clientConfig = clientConfig;
			else
				this.clientConfig = new InternalClientConfig();
			this.clientConfig.validate();
			this.credentials = credentials;
			this.credentials.validate();
			this.authenticator = AuthenticatorFactory.getAuthenticator(credentials, clientConfig);

			// ServicePrincipalCredentials will not contain pdf service uri, it'll be taken from clientConfig
			if(credentials instanceof ServicePrincipalCredentials) {
				this.platformServiceRequestContext = new PlatformServiceRequestContext(this.clientConfig);
			} else {
				const pdfServicesUri = credentials.getPDFServicesUri();
				this.platformServiceRequestContext = new PlatformServiceRequestContext(
					(pdfServicesUri)?
						this.credentials : this.clientConfig);
			}
		}
		else {
			throw new Error("Invalid Credentials provided as argument");
		}
	}

	getBaseRequestFromRequestContext(requestKey, authenticationRequired) {
		let baseRequest = this.platformServiceRequestContext.getBaseHttpRequest(requestKey);
		if(authenticationRequired === true) {
			baseRequest = baseRequest.withAuthenticator(this.authenticator);
		}
		return Promise.resolve(baseRequest);
	}


	validate(){
		this.clientConfig.validate();
		if (this.authenticator == null) {
			throw new Error("Authentication not initialized in the provided context");
		}
	}

}

module.exports = InternalExecutionContext;
