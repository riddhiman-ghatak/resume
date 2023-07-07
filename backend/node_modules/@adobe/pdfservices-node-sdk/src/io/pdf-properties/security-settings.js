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
 * This class provides information about the security settings of the specified PDF file, such as encryption and permission settings.
 */
class SecuritySettings {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns an {@link EncryptionSettings} instance specifying encryption settings of the PDF.
	 * @function
	 * @returns {EncryptionSettings} An {@link EncryptionSettings} instance.
	 */
	get encryption() {
		return this._encryption;
	}

	/**
	 * Returns a {@link PermissionsSettings} instance specifying permissions settings of the PDF such as content copying, editing etc.
	 * @function
	 * @returns {PermissionsSettings} A {@link PermissionsSettings} instance.
	 */
	get permissions() {
		return this._permissions;
	}
}

module.exports = SecuritySettings;
