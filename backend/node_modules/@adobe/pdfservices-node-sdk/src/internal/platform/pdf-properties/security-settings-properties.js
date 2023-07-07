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

const Encryption = require('./encryption-settings-properties');
const Permissions = require('./permissions-settings-properties');

class SecuritySettingsProperties {
	constructor(security_info) {
		this._encryption = security_info?.encryption ? new Encryption(security_info.encryption) : undefined;
		this._permissions = security_info?.permissions ? new Permissions(security_info.permissions) : undefined;
	}

	get encryption() {
		return this._encryption;
	}

	get permissions() {
		return this._permissions;
	}

	set encryption(encryption) {
		this._encryption = encryption ? new Encryption(encryption) : undefined;
	}

	set permissions(permissions) {
		this._permissions = permissions ? new Permissions(permissions) : undefined;
	}
}

module.exports = SecuritySettingsProperties;
