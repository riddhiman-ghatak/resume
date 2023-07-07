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

class PermissionsSettingsProperties {
	constructor(permissions) {
		this._assistiveTechnology = permissions?.assistive_technology;
		this._formFilling = permissions?.form_filling;
		this._copying = permissions?.copying;
		this._pageExtraction = permissions?.page_extraction;
		this._documentAssembly = permissions?.document_assembly;
		this._commenting = permissions?.commenting;
		this._printing = permissions?.printing;
		this._editing = permissions?.editing;
	}

	get hasAssistiveTechnology() {
		return this._assistiveTechnology;
	}

	get isFormFillingAllowed() {
		return this._formFilling;
	}

	get isCopyingAllowed() {
		return this._copying;
	}

	get isPageExtractionAllowed() {
		return this._pageExtraction;
	}

	get isDocumentAssemblyAllowed() {
		return this._documentAssembly;
	}

	get isCommentingAllowed() {
		return this._commenting;
	}

	get printingPermissionLevel() {
		return this._printing;
	}

	get isEditingAllowed() {
		return this._editing;
	}

	set hasAssistiveTechnology(assistive_technology) {
		this._assistiveTechnology = assistive_technology;
	}

	set isFormFillingAllowed(form_filling) {
		this._formFilling = form_filling;
	}

	set isCopyingAllowed(copying) {
		this._copying = copying;
	}

	set isPageExtractionAllowed(page_extraction) {
		this._pageExtraction = page_extraction;
	}

	set isDocumentAssemblyAllowed(document_assembly) {
		this._documentAssembly = document_assembly;
	}

	set isCommentingAllowed(commenting) {
		this._commenting = commenting;
	}

	set printingPermissionLevel(printing) {
		this._printing = printing;
	}

	set isEditingAllowed(editing) {
		this._editing = editing;
	}
}

module.exports = PermissionsSettingsProperties;
