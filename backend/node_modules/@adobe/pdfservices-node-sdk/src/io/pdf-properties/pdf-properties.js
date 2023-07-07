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
 * This class represents the metadata of the specified PDF file, such as document, pages and security level information.
 */
class PDFProperties {

	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a {@link Document} instance specifying document level properties such as fonts, PDF version etc.
	 * @function
	 * @returns {Document} A {@link Document} instance consisting of document level properties.
	 */
	get document() {
		return this._document;
	}

	/**
	 * Returns a {@link SecuritySettings} instance specifying security settings of the specified PDF file such as encryption and permission settings.
	 * @function
	 * @returns {SecuritySettings} A {@link SecuritySettings} instance consisting of security settings of the PDF.
	 */
	get securitySettings() {
		return this._securitySettings;
	}

	/**
	 * Returns an array of {@link Page} instances specifying page level properties of the pages from the specified PDF file
	 * such as page number, page height etc.
	 * @function
	 * @returns {Array<Page>} An array of {@link Page} instances.
	 */
	get pages() {
		return this._pages;
	}
}

module.exports = PDFProperties;
