/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const logger = require('../../internal/logger');

/**
 * This class represents output of {@link AutotagPDFOperation}.
 */
class AutotagPDFOutput {
	/**
	 * @hideconstructor
	 */
	constructor({taggedPDFFileRef, reportFileRef}) {
		this._taggedPDFFileRef = taggedPDFFileRef;
		this._reportFileRef = reportFileRef;
	}

	/**
	 * Reference to the output tagged PDF document.
	 * @readonly
	 * @type {FileRef}
	 */
	get taggedPDF() {
		return this._taggedPDFFileRef;
	}

	/**
	 * Reference to the additional tagging report, if specified for the operation, null otherwise.
	 * @readonly
	 * @type {FileRef}
	 */
	get report() {
		return this._reportFileRef !== undefined ? this._reportFileRef : null;
	}
}

module.exports = AutotagPDFOutput;
