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

const fs = require('fs'),
	InternalClientConfig = require('./internal/internal-client-config');
const defaultConfig = require('./internal/config/dc-services-default-config');
const Region = require("./region");

/**
 * Encapsulates the API request configurations
 */
class ClientConfig {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	static get Builder() {
		/**
		 *
		 * Builds a {@link ClientConfig} instance.
		 */
		class ClientConfigBuilder {
			/**
			 * @hideconstructor
			 */
			constructor() {
			}

			/**
			 * Sets the connect timeout. It should be greater than zero.
			 * @param {!Number} connectTimeout - Specifies the timeout in milliseconds until a connection is
			 * established in the API calls. Default value is 10000 milliseconds
			 * @returns {ClientConfigBuilder} This Builder instance to add any additional parameters.
			 */
			withConnectTimeout(connectTimeout) {
				this.connectTimeout = connectTimeout;
				return this;
			}

			/**
			 * Sets the read timeout. It should be greater than zero.
			 * @param {!Number} readTimeout -  Specifies the read timeout in milliseconds, which is the timeout for
			 * waiting for data or, put differently, a maximum period inactivity between two consecutive data packets.
			 * Default value is 10000 milliseconds
			 * @returns {ClientConfigBuilder} This Builder instance to add any additional parameters.
			 */
			withReadTimeout(readTimeout) {
				this.readTimeout = readTimeout;
				return this;
			}

			/**
			 * Sets the processing timeout. It should be greater than or equal to 600000 (10 minutes).
			 * @param {!Number} processingTimeout -  Specifies the processing timeout in milliseconds to
			 * process the documents.
			 * Default value is 600000 milliseconds (10 minutes)
			 * @returns {ClientConfigBuilder} This Builder instance to add any additional parameters.
			 */
			withProcessingTimeout(processingTimeout) {
				this.processingTimeout = processingTimeout;
				return this;
			}

			/**
			 * Sets the region code.
			 *
			 * @param {!Region} region - Service region. Default value is US. See {@link Region} for valid values.
			 * @returns {ClientConfigBuilder} This builder instance to add any additional parameters
			 */
			setRegion(region) {
				if (!region)
					throw new Error('Region cannot be null');

				if (!Object.values(Region).includes(region.toUpperCase()))
					throw new Error("Invalid value for region code. Must be either US or EU.");

				this.pdfServicesUri = defaultConfig.pdfServicesRegionURI[region.toUpperCase()];

				return this;
			}

			/**
			 * Sets the connect timeout, read timeout and region code using the JSON client config file path. All the
			 * keys in the JSON structure are optional.
			 * <p>
			 * JSON structure:
			 * <pre>
			 * {
			 *   "connectTimeout": "4000",
			 *   "readTimeout": "20000",
			 *   "region": "EU",
			 *   "processingTimeout": "600000"
			 * }
			 * </pre>
			 * @param {!String} clientConfigFilePath - JSON client config file path
			 * @returns {ClientConfigBuilder} This Builder instance to add any additional parameters.
			 */
			fromFile(clientConfigFilePath) {
				const clientConfig = JSON.parse(fs.readFileSync(clientConfigFilePath));
				const pdfServices = clientConfig.pdf_services;
				const region = clientConfig.region;

				if (pdfServices) {
					this.pdfServicesUri = pdfServices.pdf_services_uri ? pdfServices.pdf_services_uri : this.pdfServicesUri;
				} else if(region) {
					if (!Object.values(Region).includes(region.toUpperCase()))
						throw new Error("Invalid value for region code. Must be either US or EU.");

					this.pdfServicesUri = defaultConfig.pdfServicesRegionURI[region.toUpperCase()];
				}

				this.connectTimeout = parseInt(clientConfig.connectTimeout, 10);
				this.readTimeout = parseInt(clientConfig.readTimeout, 10);
				this.processingTimeout = parseInt(clientConfig.processingTimeout, 10);
				return this;
			}

			/**
			 * Returns a new {@link ClientConfig} instance built from the current state of this builder.
			 * @returns {ClientConfig} A ClientConfig instance.
			 */
			build() {
				let internalClientConfig = new InternalClientConfig(this.connectTimeout, this.readTimeout, this.pdfServicesUri, this.processingTimeout);
				Object.freeze(internalClientConfig);
				return internalClientConfig;
			}
		}

		return ClientConfigBuilder;
	}

	/**
	 * Creates a new {@link ClientConfig} builder.
	 * @memberOf ClientConfig
	 * @function
	 * @returns {ClientConfigBuilder} A ClientConfigBuilder instance.
	 */
	static clientConfigBuilder() {
		return new ClientConfig.Builder();
	}

}

Object.freeze(ClientConfig);
module.exports = ClientConfig;
