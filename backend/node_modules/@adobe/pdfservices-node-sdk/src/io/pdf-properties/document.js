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
 * This class provides information about the document level properties of the specified PDF file, such as tags, fonts, PDF Version etc.
 */
class Document {
	/**
	 * @hideconstructor
	 */
	constructor() {
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is based on the XFA (Extensible Forms Architecture) format.
	 * @function
	 * @returns {boolean} True if the specified PDF file is based on the XFA format. False otherwise
	 */
	get isXFA() {
		return this._isXFA;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file contains any form fields.
	 * @function
	 * @returns {boolean} True if the specified PDF file contains any form fields. False otherwise.
	 */
	get isAcroform() {
		return this._hasAcroform;
	}

	/**
	 * Returns the size of the specified PDF file.
	 * @function
	 * @returns {string} The size of the specified PDF file.
	 */
	get fileSize() {
		return this._fileSize;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file contains any embedded files.
	 * @function
	 * @returns {boolean} True if the specified PDF file contains any embedded files. False otherwise.
	 */
	get containsEmbeddedFiles() {
		return this._hasEmbeddedFiles;
	}

	/**
	 * Returns the count of the number of times the specified PDF file is edited and saved.
	 * @function
	 * @returns {number} The count of the number of times the specified PDF file is edited and saved.
	 */
	get incrementalSaveCount() {
		return this._incrementalSaveCount;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file has been digitally signed with a certifying signature.
	 * @function
	 * @returns {boolean} True if the specified PDF file has been digitally signed with a certifying signature. False otherwise.
	 */
	get isCertified() {
		return this._isCertified;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is digitally signed.
	 * @function
	 * @returns {boolean} True if the specified PDF file is digitally signed. False otherwise.
	 */
	get isSigned() {
		return this._isSigned;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is encrypted.
	 * @function
	 * @returns {boolean} True if the specified PDF file is encrypted. False otherwise.
	 */
	get isEncrypted() {
		return this._isEncrypted;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is linearized.
	 * @function
	 * @returns {boolean} True if the specified PDF file is linearized. False otherwise.
	 */
	get isLinearized() {
		return this._isLinearized;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is a portfolio PDF.
	 * @function
	 * @returns {boolean} True if the specified PDF file is a portfolio PDF. False otherwise.
	 */
	get isPortfolio() {
		return this._isPortfolio;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is tagged.
	 * @function
	 * @returns {boolean} True if the specified PDF file is tagged. False otherwise.
	 */
	get isTagged() {
		return this._isTagged;
	}

	/**
	 * Returns a boolean specifying whether the specified PDF file is a Fully Tagged PDF.
	 * @function
	 * @returns {boolean} True if the specified PDF file is a Fully Tagged PDF. False otherwise.
	 */
	get isFullyTaggedPDF() {
		return this._isFTPDF;
	}

	/**
	 * Returns a number specifying the number of pages in the specified PDF file.
	 * @function
	 * @returns {number} The number of pages in the specified PDF file.
	 */
	get pageCount() {
		return this._pageCount;
	}

	/**
	 * Returns a string specifying the version of the specified PDF file - e.g. "1.7", "2.0" etc.
	 * @function
	 * @returns {string} The version of the specified PDF file.
	 */
	get pdfVersion() {
		return this._pdfVersion;
	}

	/**
	 * Returns a string specifying the PDF/A compliance level for the specified PDF file - e.g "PDF/A-4" etc.
	 * @function
	 * @returns {string} The PDF/A compliance level for the specified PDF file.
	 */
	get pdfAComplianceLevel() {
		return this._pdfaComplianceLevel;
	}

	/**
	 * Returns a string specifying the PDF/E compliance level for the specified PDF file - e.g. "PDF/E-1" etc.
	 * @function
	 * @returns {string} The PDF/E compliance level for the specified PDF file.
	 */
	get pdfEComplianceLevel() {
		return this._pdfeComplianceLevel;
	}

	/**
	 * Returns a string specifying the PDF/UA compliance level for the specified PDF file - e.g. "PDF/UA-1" etc.
	 * @function
	 * @returns {string} The PDF/UA compliance level for the specified PDF file.
	 */
	get pdfUAComplianceLevel() {
		return this._pdfuaComplianceLevel;
	}

	/**
	 * Returns a string specifying the PDF/VT compliance level for the specified PDF file - e.g. "PDF/VT-3" etc.
	 * @function
	 * @returns {string} The PDF/VT compliance level for the specified PDF file.
	 */
	get pdfVTComplianceLevel() {
		return this._pdfvtComplianceLevel;
	}

	/**
	 * Returns a string specifying the PDF/X compliance level for the specified PDF file - e.g. "PDF/X-4" etc.
	 * @function
	 * @returns {string} The PDF/X compliance level for the specified PDF file.
	 */
	get pdfXComplianceLevel() {
		return this._pdfxComplianceLevel;
	}

	/**
	 * Returns an array of {@link Font} instances present in the specified PDF file.
	 * @function
	 * @returns {Array<Font>} An array of {@link Font} instances.
	 */
	get fonts() {
		return this._fonts;
	}

	/**
	 * Returns an {@link InfoDict} instance that specifies information related to the specified PDF file such as creation date, author etc.
	 * @function
	 * @returns {InfoDict} An {@link InfoDict} instance.
	 */
	get infoDict() {
		return this._infoDict;
	}

	/**
	 * Returns a string specifying the full metadata of the specified PDF file as provided by the author and producer of the document.
	 * @function
	 * @returns {string} The full metadata of the specified PDF file as provided by the author and producer of the document.
	 */
	get xmpMetadata() {
		return this._xmp;
	}
}

module.exports = Document;
