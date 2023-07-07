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
const Schema = require('validate');

/**
 * Parameters for representing CSC authorization context.
 */
class CSCAuthContext {

	/**
	 * Creates a new {@link CSCAuthContext} instance.
	 * Token type is set to default value that is "Bearer".
	 * @param {!string} accessToken the access token
	 * @param {string} tokenType the token type
	 */
	constructor(accessToken, tokenType = "Bearer") {
		this.accessToken = accessToken;
		this.tokenType = tokenType;
	}

	/**
	 * Returns the access token required for CSC based services.
	 * @return {string} CSC Provider access token
	 */
	getAccessToken() {
		return this.accessToken;
	}

	/**
	 * Returns the type of access token.
	 * @return {string} token type
	 */
	getTokenType() {
		return this.tokenType;
	}

	validate() {
		const validator = new Schema({
			'accessToken': {
				type: String,
				required: true,
				message: {
					type: 'Access token must be a string',
					required: 'Access token in auth context for CSC credentials cannot be null or empty.'
				}
			},
			'tokenType': {
				type: String,
				message: {
					type: 'Token type must be a string',
					required: 'Token type in auth context for CSC credentials cannot be null or empty.'
				}
			}
		});
		return validator.validate(this);
	}
}

module.exports = CSCAuthContext;
