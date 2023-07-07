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

class ContentProperties {
	constructor(content) {
		this._isEmpty = content?.is_empty;
		this._hasImages = content?.has_images;
		this._numberOfImages = content?.number_of_images;
		this._onlyImages = content?.only_images;
		this._hasText = content?.has_text;
	}

	get numberOfImages() {
		return this._numberOfImages;
	}

	get containsImagesOnly() {
		return this._onlyImages;
	}

	get containsText() {
		return this._hasText;
	}

	get containsImages() {
		return this._hasImages;
	}

	get isEmpty() {
		return this._isEmpty;
	}

	set numberOfImages(number_of_images) {
		this._numberOfImages = number_of_images;
	}

	set containsImagesOnly(only_images) {
		this._onlyImages = only_images;
	}

	set containsText(has_text) {
		this._hasText = has_text;
	}

	set containsImages(has_images) {
		this._hasImages = has_images;
	}

	set isEmpty(is_empty) {
		this._isEmpty = is_empty;
	}
}

module.exports = ContentProperties;
