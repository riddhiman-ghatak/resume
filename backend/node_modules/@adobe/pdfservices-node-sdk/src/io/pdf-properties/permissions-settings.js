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
 * This class provides information about the permission settings of the specified PDF file, such as restricting print permissions,
 * edit permissions etc.
 */
class PermissionsSettings {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file will be supported by a screen reader.
	 * @function
	 * @returns {boolean} True if the specified PDF file will be supported by a screen reader. False otherwise.
	 */
	get hasAssistiveTechnology() {
		return this._assistiveTechnology;
	}

	/**
	 * Returns a boolean specifying whether adding comments in the specified PDF file is permitted.
	 * @function
	 * @returns {boolean} True if adding comments in the specified PDF file is permitted. False otherwise.
	 */
	get isCommentingAllowed() {
		return this._commenting;
	}

	/**
	 * Returns a boolean specifying whether copying the content of the specified PDF file is permitted.
	 * @function
	 * @returns {boolean} True if copying the content of the specified PDF file is permitted. False otherwise.
	 */
	get isCopyingAllowed() {
		return this._copying;
	}

	/**
	 * Returns a boolean specifying whether adding or inserting pages in the specified PDF file is permitted.
	 * @function
	 * @returns {boolean} True if adding or inserting pages in the specified PDF file is permitted. False otherwise.
	 */
	get isDocumentAssemblyAllowed() {
		return this._documentAssembly;
	}

	/**
	 * Returns a boolean specifying whether editing the content in the specified PDF file is permitted.
	 * @function
	 * @returns {boolean} True if editing the content in the specified PDF file is permitted. False otherwise.
	 */
	get isEditingAllowed() {
		return this._editing;
	}

	/**
	 * Returns a boolean specifying whether form filling is permitted in the specified PDF file.
	 * @function
	 * @returns {boolean} True if form filling is permitted in the specified PDF file. False otherwise.
	 */
	get isFormFillingAllowed() {
		return this._formFilling;
	}

	/**
	 * Returns a boolean specifying whether extracting pages of the specified PDF file is permitted.
	 * @function
	 * @returns {boolean} True if extracting pages of the specified PDF file is permitted. False otherwise.
	 */
	get isPageExtractionAllowed() {
		return this._pageExtraction;
	}

	/**
	 * Returns a string specifying permission level for printing the file.
	 * @function
	 * @returns {string} The permission level for printing the file.
	 */
	get printingPermissionLevel() {
		return this._printing;
	}
}

module.exports = PermissionsSettings;
