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

const Content = require('./content-properties');

class PageProperties {
	constructor(page) {
		this._pageNumber = page?.page_number;
		this._isScanned = page?.is_scanned;
		this._hasStructure = page?.has_structure;
		this._height = page?.height;
		this._width = page?.width;
		this._content = page?.content ? new Content(page.content) : undefined;
	}

	get pageNumber() {
		return this._pageNumber;
	}

	get isScanned() {
		return this._isScanned;
	}

	get width() {
		return this._width;
	}

	get hasStructure() {
		return this._hasStructure;
	}

	get content() {
		return this._content;
	}

	get height() {
		return this._height;
	}

	set pageNumber(page_number) {
		this._pageNumber = page_number;
	}

	set isScanned(is_scanned) {
		this._isScanned = is_scanned;
	}

	set width(width) {
		this._width = width;
	}

	set hasStructure(has_structure) {
		this._hasStructure = has_structure;
	}

	set content(content) {
		this._content = content ? new Content(content) : undefined;
	}

	set height(height) {
		this._height = height;
	}
}

module.exports = PageProperties;
