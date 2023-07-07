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
 * This class provides information about the font used in the specified PDF file, such as font-name, font-family etc.
 */
class Font {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a string specifying the post-script name of the font - e.g. "YERPXC+MyriadPro-Regular" etc.
	 * @function
	 * @returns {string} The post-script name of the font.
	 */
	get name() {
		return this._name;
	}

	/**
	 * Returns a string specifying the font technology type - e.g. "Type 1", "TrueType", "OpenType" etc.
	 * @function
	 * @returns {string} The font technology type.
	 */
	get fontType() {
		return this._fontType;
	}

	/**
	 * Returns a string specifying font's family name - e.g. For font "Times Bold Italic", family name is "Times" etc.
	 * @function
	 * @returns {string} The font's family name.
	 */
	get familyName() {
		return this._familyName;
	}
}

module.exports = Font;
