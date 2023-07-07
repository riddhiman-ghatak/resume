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

const Schema = require('validate');

/**
 * Parameters for creating a tagged PDF using {@link AutotagPDFOperation}.
 */
class AutotagPDFOptions {
	/**
	 * @hideconstructor
	 * @param builder
	 */
	constructor(builder) {
		this._shiftHeadings = builder._shiftHeadings;
		this._generateReport = builder._generateReport;
		Object.preventExtensions(this);
	}

	/**
	 * Boolean value specifying whether headings need to be shifted in the tagged PDF.
	 * @readonly
	 * @type {boolean}
	 */
	get shiftHeadings() {
		return this._shiftHeadings;
	}

	/**
	 * Boolean value specifying whether an additional tagging report needs to be generated.
	 * @readonly
	 * @type {boolean}
	 */
	get generateReport() {
		return this._generateReport;
	}

	/**
	 * Returns a builder for {@link AutotagPDFOptions}.
	 * @memberOf AutotagPDFOptions
	 * @function
	 * @returns {AutotagPDFOptionsBuilder} A Builder instance for initializing {@link AutotagPDFOptions}.
	 */
	static get Builder() {
		/**
		 *
		 * Builds an {@link AutotagPDFOptions} instance.
		 */
		class AutotagPDFOptionsBuilder {
			/**
			 * @hideconstructor
			 */
			constructor() {
				// initialise shiftHeadings and generateReport with default value as false
				this._shiftHeadings = false;
				this._generateReport = false;
			}

			/**
			 * If invoked, then the headings will be shifted in the output PDF document.
			 * @returns {AutotagPDFOptionsBuilder} This Builder instance to add any additional parameters.
			 */
			shiftHeadings() {
				this._shiftHeadings = true;
				return this;
			}

			/**
			 * If invoked, generates an additional tagging report which contains the information about the tags that
			 * the tagged output PDF document contains.
			 * @returns {AutotagPDFOptionsBuilder} This Builder instance to add any additional parameters.
			 */
			generateReport() {
				this._generateReport = true;
				return this;
			}

			/**
			 * Returns a new {@link AutotagPDFOptions} instance built from the current state of this builder.
			 * @returns {AutotagPDFOptions} A new AutotagPDFOptions instance.
			 */
			build() {
				let autotagPdfOptions = new AutotagPDFOptions(this);
				Object.freeze(autotagPdfOptions);
				return autotagPdfOptions;
			}
		}

		return AutotagPDFOptionsBuilder;
	}

	validate() {
		const validator = new Schema({
			'_shiftHeadings': {
				type: Boolean,
				required: false,
				message: {
					type: 'shiftHeadings must be a Boolean'
				}
			},
			'_generateReport': {
				type: Boolean,
				required: false,
				message: {
					type: 'generateReport must be a Boolean'
				}
			}
		});
		return validator.validate(this);
	}
}


module.exports = AutotagPDFOptions;
