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
 * This class provides information about the encryption settings of the specified PDF file, such as user and owner passwords,
 * encryption algorithm etc.
 */
class EncryptionSettings {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a string specifying the encryption algorithm used to encrypt the specified PDF file - e.g. "AES" etc.
	 * @function
	 * @returns {string} The name of the encryption algorithm used to encrypt the specified PDF file.
	 */
	get algorithm() {
		return this._algorithm;
	}

	/**
	 * Returns the number of bits in the key used by a cryptographic algorithm to encrypt the specified PDF file.
	 * @function
	 * @returns {number} The number of bits in the key used by a cryptographic algorithm.
	 */
	get bitLength() {
		return this._bitLength;
	}

	/**
	 * Returns a boolean specifying whether the owner password is set for the specified PDF file.
	 * @function
	 * @returns {boolean} True if the owner password is set for the specified PDF file. False otherwise.
	 */
	get isOwnerPasswordSet() {
		return this._hasOwnerPassword;
	}

	/**
	 * Returns a boolean specifying whether the user password is set for the specified PDF file.
	 * @function
	 * @returns {boolean} True if the user password is set for the specified PDF file. False otherwise.
	 */
	get isUserPasswordSet() {
		return this._hasUserPassword;
	}

	/**
	 * Returns a boolean specifying whether only the file attachments in the specified PDF file are encrypted.
	 * @function
	 * @returns {boolean} True if only the file attachments in the specified PDF file are encrypted. False otherwise.
	 */
	get onlyAttachmentsEncrypted() {
		return this._encryptAttachmentsOnly;
	}

	/**
	 * Returns a boolean specifying whether the metadata of the specified PDF file is encrypted.
	 * @function
	 * @returns {boolean} True if the metadata of the specified PDF file is encrypted. False otherwise.
	 */
	get isMetadataEncrypted() {
		return this._encryptMetadata;
	}
}

module.exports = EncryptionSettings;
