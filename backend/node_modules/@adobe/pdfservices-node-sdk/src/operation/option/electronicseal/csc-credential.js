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
const Schema = require('validate'),
	CertificateCredentials = require('./certificate-credentials'),
	CSCAuthContext = require('./csc-auth-context');

/**
 * Parameters for representing the CSC Provider based credentials as a subtype
 * for {@link CertificateCredentials}.
 */
class CSCCredential extends CertificateCredentials {

	/**
	 *  @hideconstructor
	 *  @param builder
	 */
	constructor(builder) {
		super();
		this.providerName = builder.providerName;
		this.credentialID = builder.credentialID;
		this.pin = builder.pin;
		this.cscAuthContext = builder.cscAuthContext;
		Object.preventExtensions(this);
	}

	/**
	 * Returns the name of trust service provider.
	 * @return {string} trust service provider name
	 */
	getProviderName() {
		return this.providerName;
	}

	/**
	 * Returns the certificate credential ID of user.
	 * @return {string} credential ID
	 */
	getCredentialID() {
		return this.credentialID;
	}

	/**
	 * Returns the PIN to be used for validating credentials.
	 * @return {string} the PIN value
	 */
	getPin() {
		return this.pin;
	}

	/**
	 * Returns the credential authorization parameters.
	 * @return {CSCAuthContext} the credential auth params
	 */
	getCSCAuthContext() {
		return this.cscAuthContext;
	}

	/**
	 * Builds a {@link CSCCredential} instance.
	 */
	static get Builder() {

		class CSCCredentialBuilder {

			/**
			 * Constructs a {@link CSCCredentialBuilder} instance.
			 */
			constructor() {}

			/**
			 * Sets the name of trust service provider being used.
			 * @param {!string} providerName the provider name
			 * @return this Builder instance to add any additional parameters
			 */
			withProviderName(providerName) {
				this.providerName = providerName;
				return this;
			}

			/**
			 * Sets the TSP credential ID.
			 * It is the digital ID stored with the TSP provider that should be used for sealing.
			 * @param {!string} credentialID the credential ID
			 * @return this Builder instance to add any additional parameters
			 */
			withCredentialID(credentialID) {
				this.credentialID = credentialID;
				return this;
			}

			/**
			 * Sets the PIN associated with credential ID.
			 * @param {!string} pin the pin
			 * @return this Builder instance to add any additional parameters
			 */
			withPin(pin) {
				this.pin = pin;
				return this;
			}

			/**
			 * Sets the CSC auth context.
			 * It encapsulates the service authorization data required to communicate with the TSP and access CSC provider APIs.
			 * @param {!CSCAuthContext} cscAuthContext the CSC auth context
			 * @return this Builder instance to add any additional parameters
			 */
			withCSCAuthContext(cscAuthContext) {
				this.cscAuthContext = cscAuthContext;
				return this;
			}

			/**
			 * Returns a new {@link CSCCredential} instance built from the current state of this builder.
			 *
			 * @return a new {@link CSCCredential} instance
			 */
			build() {
				let cscCredential =  new CSCCredential(this);
				Object.freeze(cscCredential);
				return cscCredential;
			}
		}

		return CSCCredentialBuilder;
	}

	validate() {
		const validator = new Schema({
			'providerName': {
				type: String,
				required: true,
				message: {
					type: 'Provider name must be a string',
					required: 'Provider name in CSC credentials cannot be null or empty.'
				}
			},
			'credentialID': {
				type: String,
				required: true,
				message: {
					type: 'Credential ID must be a string',
					required: 'Credential ID in CSC credentials cannot be null or empty.'
				}
			},
			'pin': {
				type: String,
				required: true,
				message: {
					type: 'Pin must be a string',
					required: 'Pin in CSC credentials cannot be null or empty.'
				}
			},
			'cscAuthContext': {
				type: CSCAuthContext,
				required: true,
				message: {
					type: 'Auth context must be an object of type CSCAuthContext',
					required: 'Auth context in CSC credentials cannot be null.'
				}
			}
		});
		return validator.validate(this);
	}
}
module.exports = CSCCredential;
