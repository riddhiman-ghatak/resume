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

const Document = require('./document-properties');
const SecuritySettings = require('./security-settings-properties');
const Page = require('./page-properties');

class Metadata {
	constructor(metadata) {
		this._document = metadata?.document ? new Document(metadata.document) : undefined;
		this._securitySettings = metadata?.security_info ? new SecuritySettings(metadata.security_info) : undefined;
		this._pages = metadata?.pages ? metadata.pages.map(page => {
			return new Page(page);
		}) : undefined;
	}

	get document() {
		return this._document;
	}

	get securitySettings() {
		return this._securitySettings;
	}

	get pages() {
		return this._pages;
	}

	set document(document) {
		this._document = document ? new Document(document) : undefined;
	}

	set securitySettings(security_info) {
		this._securitySettings = security_info ? new SecuritySettings(security_info) : undefined;
	}

	set pages(pages) {
		this._pages = pages ? pages.map(page => {
			return new Page(page);
		}) : undefined;
	}
}

module.exports = Metadata;
