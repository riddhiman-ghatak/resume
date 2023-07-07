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
 * This class provides document authoring related information, such as creation date, creator etc.
 */
class InfoDict {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a string specifying the date of file creation.
	 * @function
	 * @returns {string} The date of file creation.
	 */
	get creationDate() {
		return this._creationDate;
	}

	/**
	 * Returns a string specifying the creator tool of the specified PDF file - e.g. "Adobe Acrobat 21.5" etc.
	 * @function
	 * @returns {string} The creator tool of the specified PDF file.
	 */
	get creator() {
		return this._creator;
	}

	/**
	 * Returns a string specifying the date when the file was last modified.
	 * @function
	 * @returns {string} The date when the file was last modified.
	 */
	get dateModified() {
		return this._modDate;
	}

	/**
	 * Returns a string specifying the authoring tool used to generate the specified PDF file - e.g. "Adobe Acrobat 21.5 Image Conversion Plug-in" etc.
	 * @function
	 * @returns {string} The authoring tool used to generate the specified PDF file.
	 */
	get producer() {
		return this._producer;
	}

	/**
	 * Returns the name of the author of the specified PDF file
	 * @function
	 * @returns {string} The name of the author of the specified PDF file.
	 */
	get author() {
		return this._author;
	}

	/**
	 * Returns a string specifying the title of the specified PDF file.
	 * @function
	 * @returns {string} The title of the specified PDF file.
	 */
	get title() {
		return this._title;
	}
}

module.exports = InfoDict;
