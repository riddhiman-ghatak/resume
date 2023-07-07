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

class FontProperties {
	constructor(font) {
		this._fontType = font?.font_type;
		this._familyName = font?.family_name;
		this._name = font?.name;
	}

	get name() {
		return this._name;
	}

	get fontType() {
		return this._fontType;
	}

	get familyName() {
		return this._familyName;
	}

	set name(name) {
		this._name = name;
	}

	set fontType(font_type) {
		this._fontType = font_type;
	}

	set familyName(family_name) {
		this._familyName = family_name;
	}
}

module.exports = FontProperties;
