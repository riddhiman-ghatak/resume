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
 * This class provides information about the content of the specified PDF file, such as number of images, textual content etc.
 */
class Content {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a boolean specifying whether the content is empty/blank.
	 * @function
	 * @returns {boolean} True if the content is empty. False otherwise.
	 */
	get isEmpty() {
		return this._isEmpty;
	}

	/**
	 * Returns a boolean specifying whether the content has any images.
	 * @function
	 * @returns {boolean} True if the content has any images. False otherwise.
	 */
	get containsImages() {
		return this._hasImages;
	}

	/**
	 * Returns the number of images in the content.
	 * @function
	 * @returns {number} The number of images in the content.
	 */
	get numberOfImages() {
		return this._numberOfImages;
	}

	/**
	 * Returns a boolean specifying whether the content consists only images.
	 * @function
	 * @returns {boolean} True if the content consists only images. False otherwise.
	 */
	get containsImagesOnly() {
		return this._onlyImages;
	}

	/**
	 * Returns a boolean specifying whether the content has any text.
	 * @function
	 * @returns {boolean} True if the content has any text. False otherwise.
	 */
	get containsText() {
		return this._hasText;
	}
}

module.exports = Content;
