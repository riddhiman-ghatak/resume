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

const DefaultConfig =  require('./config/dc-services-default-config');

class InternalClientConfig{

	constructor(connectTimeout,  readTimeout, pdfServicesUri, processingTimeout){

		this.connectTimeout = connectTimeout ? connectTimeout : parseInt(DefaultConfig.http.connectTimeout, 10);
		this.readTimeout = readTimeout ? readTimeout : parseInt(DefaultConfig.http.readTimeout, 10);
		this.pdfServicesUri = pdfServicesUri ? pdfServicesUri : DefaultConfig.pdfServicesUri;
		this.processingTimeout = processingTimeout ? processingTimeout : parseInt(DefaultConfig.processingTimeout, 10);
		this.validate();
	}
	getConnectTimeout() {
		return this.connectTimeout;
	}

	getReadTimeout() {
		return this.readTimeout;
	}

	getPDFServicesUri() {
		return this.pdfServicesUri;
	}

	getProcessingTimeout() {
		return this.processingTimeout;
	}

	validate() {
		if (this.readTimeout <= 0) {
			throw new Error(`Invalid value for read timeout ${
								this.readTimeout} Must be valid integer greater than 0`);
		}
		if (this.connectTimeout <= 0) {
			throw new Error(`Invalid value for connect timeout ${
								this.connectTimeout} Must be valid integer greater than 0`);
		}
		if (this.processingTimeout < DefaultConfig.processingTimeout) {
			throw new Error(`Invalid value for processing timeout. Must be valid integer greater than or equal to 600000 (10 minutes)`);
		}
	}

}

module.exports = InternalClientConfig;
