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

class EncryptionSettingsProperties {
	constructor(encryption) {
		this._algorithm = encryption?.algorithm;
		this._bitLength = encryption?.bit_length;
		this._encryptAttachmentsOnly = encryption?.encrypt_attachments_only;
		this._encryptMetadata = encryption?.encrypt_metadata;
		this._hasOwnerPassword = encryption?.has_owner_password;
		this._hasUserPassword = encryption?.has_user_password;
	}

	get onlyAttachmentsEncrypted() {
		return this._encryptAttachmentsOnly;
	}

	get isOwnerPasswordSet() {
		return this._hasOwnerPassword;
	}

	get isMetadataEncrypted() {
		return this._encryptMetadata;
	}

	get isUserPasswordSet() {
		return this._hasUserPassword;
	}

	get bitLength() {
		return this._bitLength;
	}

	get algorithm() {
		return this._algorithm;
	}

	set onlyAttachmentsEncrypted(encrypt_attachments_only) {
		this._encryptAttachmentsOnly = encrypt_attachments_only;
	}

	set isUserPasswordSet(has_user_password) {
		this._hasUserPassword = has_user_password;
	}

	set isMetadataEncrypted(encrypt_metadata) {
		this._encryptMetadata = encrypt_metadata;
	}

	set isOwnerPasswordSet(has_owner_password) {
		this._hasOwnerPassword = has_owner_password;
	}

	set bitLength(bit_length) {
		this._bitLength = bit_length;
	}

	set algorithm(algorithm) {
		this._algorithm = algorithm;
	}
}

module.exports = EncryptionSettingsProperties;
