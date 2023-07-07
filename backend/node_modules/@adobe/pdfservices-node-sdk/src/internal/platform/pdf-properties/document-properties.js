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

const InfoDict = require('./info-dict-properties');
const Font = require('./font-properties');

class DocumentProperties {
	constructor(document) {
		this._isXFA = document?.is_XFA;
		this._hasAcroform = document?.has_acroform;
		this._fileSize = document?.file_size;
		this._hasEmbeddedFiles = document?.has_embedded_files;
		this._incrementalSaveCount = document?.incremental_save_count;
		this._isCertified = document?.is_certified;
		this._isSigned = document?.is_signed;
		this._isEncrypted = document?.is_encrypted;
		this._isLinearized = document?.is_linearized;
		this._isPortfolio = document?.is_portfolio;
		this._isTagged = document?.is_tagged;
		this._isFTPDF = document?.is_FTPDF;
		this._pageCount = document?.page_count;
		this._pdfVersion = document?.pdf_version;
		this._pdfaComplianceLevel = document?.pdfa_compliance_level;
		this._pdfeComplianceLevel = document?.pdfe_compliance_level;
		this._pdfuaComplianceLevel = document?.pdfua_compliance_level;
		this._pdfvtComplianceLevel = document?.pdfvt_compliance_level;
		this._pdfxComplianceLevel = document?.pdfx_compliance_level;
		this._fonts = document?.fonts ? document.fonts.map(font => {
			return new Font(font);
		}) : undefined;
		this._infoDict = document?.info_dict ? new InfoDict(document.info_dict) : undefined;
		this._xmp = document?.XMP;
	}

	get isLinearized() {
		return this._isLinearized;
	}

	get pdfEComplianceLevel() {
		return this._pdfeComplianceLevel;
	}

	get isTagged() {
		return this._isTagged;
	}

	get isPortfolio() {
		return this._isPortfolio;
	}

	get isCertified() {
		return this._isCertified;
	}

	get isEncrypted() {
		return this._isEncrypted;
	}

	get infoDict() {
		return this._infoDict;
	}

	get isFullyTaggedPDF() {
		return this._isFTPDF;
	}

	get pdfVersion() {
		return this._pdfVersion;
	}

	get isAcroform() {
		return this._hasAcroform;
	}

	get fileSize() {
		return this._fileSize;
	}

	get isSigned() {
		return this._isSigned;
	}

	get incrementalSaveCount() {
		return this._incrementalSaveCount;
	}

	get containsEmbeddedFiles() {
		return this._hasEmbeddedFiles;
	}

	get isXFA() {
		return this._isXFA;
	}

	get fonts() {
		return this._fonts;
	}

	get pdfAComplianceLevel() {
		return this._pdfaComplianceLevel;
	}

	get pdfVTComplianceLevel() {
		return this._pdfvtComplianceLevel;
	}

	get pdfXComplianceLevel() {
		return this._pdfxComplianceLevel;
	}

	get pdfUAComplianceLevel() {
		return this._pdfuaComplianceLevel;
	}

	get xmpMetadata() {
		return this._xmp;
	}

	get pageCount() {
		return this._pageCount;
	}

	set isLinearized(is_linearized) {
		this._isLinearized = is_linearized;
	}

	set pdfEComplianceLevel(pdfe_compliance_level) {
		this._pdfeComplianceLevel = pdfe_compliance_level;
	}

	set isTagged(is_tagged) {
		this._isTagged = is_tagged;
	}

	set isPortfolio(is_portfolio) {
		this._isPortfolio = is_portfolio;
	}

	set isCertified(is_certified) {
		this._isCertified = is_certified;
	}

	set isEncrypted(is_encrypted) {
		this._isEncrypted = is_encrypted;
	}

	set infoDict(info_dict) {
		this._infoDict = info_dict ? new InfoDict(info_dict) : undefined;
	}

	set isFullyTaggedPDF(is_FTPDF) {
		this._isFTPDF = is_FTPDF;
	}

	set pdfVersion(pdf_version) {
		this._pdfVersion = pdf_version;
	}

	set isAcroform(has_acroform) {
		this._hasAcroform = has_acroform;
	}

	set fileSize(file_size) {
		this._fileSize = file_size;
	}

	set isSigned(is_signed) {
		this._isSigned = is_signed;
	}

	set incrementalSaveCount(incremental_save_count) {
		this._incrementalSaveCount = incremental_save_count;
	}

	set containsEmbeddedFiles(has_embedded_files) {
		this._hasEmbeddedFiles = has_embedded_files;
	}

	set isXFA(is_XFA) {
		this._isXFA = is_XFA;
	}

	set fonts(fonts) {
		this._fonts = fonts ? fonts.map(font => {
			return new Font(font);
		}) : undefined;
	}

	set pdfAComplianceLevel(pdfa_compliance_level) {
		this._pdfaComplianceLevel = pdfa_compliance_level;
	}

	set pdfVTComplianceLevel(pdfvt_compliance_level) {
		this._pdfvtComplianceLevel = pdfvt_compliance_level;
	}

	set pdfXComplianceLevel(pdfx_compliance_level) {
		this._pdfxComplianceLevel = pdfx_compliance_level;
	}

	set pdfUAComplianceLevel(pdfua_compliance_level) {
		this._pdfuaComplianceLevel = pdfua_compliance_level;
	}

	set xmpMetadata(xmp) {
		this._xmp = xmp;
	}

	set pageCount(page_count) {
		this._pageCount = page_count;
	}
}

module.exports = DocumentProperties;
