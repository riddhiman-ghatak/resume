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
 * This class provides information about a page of the specified PDF file, such as page number, height, width etc.
 */
class Page {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns the page number of this {@link Page}, starting from 0.
	 * @function
	 * @returns {number} The page number.
	 */
	get pageNumber() {
		return this._pageNumber;
	}

	/**
	 * Returns a boolean specifying whether the page has structure/tagging.
	 * @function
	 * @returns {boolean} True if the page has structure/tagging. False otherwise.
	 */
	get hasStructure() {
		return this._hasStructure;
	}

	/**
	 * Returns a boolean specifying whether the page is scanned.
	 * @function
	 * @returns {boolean} True if the page is scanned. False otherwise.
	 */
	get isScanned() {
		return this._isScanned;
	}

	/**
	 * Returns the width of the page.
	 * @function
	 * @returns {number} Width of the page.
	 */
	get width() {
		return this._width;
	}

	/**
	 * Returns the height of the page.
	 * @function
	 * @returns {number} Height of the page.
	 */
	get height() {
		return this._height;
	}

	/**
	 * Returns a {@link Content} instance that specifies content level properties of the PDF such as number of images, textual content etc.
	 * @function
	 * @returns {Content} A {@link Content} instance.
	 */
	get content() {
		return this._content;
	}
}

module.exports = Page;
