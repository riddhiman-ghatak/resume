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

/**
 * This marker class represents the basic contract for all the credential options
 * to be used for applying PDF Electronic Seal by {@link SealOptions}.
 */
class CertificateCredentials {

	/**
	 *  @hideconstructor
	 */
	constructor() {
		if (this.constructor === CertificateCredentials) {
			throw new TypeError("Can not construct CertificateCredentials class.");
		}
	}

	/**
	 * Create a new {@link CSCCredential} builder.
	 *
	 * @return a {@link CSCCredentialBuilder} instance
	 */
	static cscCredentialBuilder() {
		const CSCCredential = require('./csc-credential');
		return new CSCCredential.Builder();
	}
}

module.exports = CertificateCredentials;
