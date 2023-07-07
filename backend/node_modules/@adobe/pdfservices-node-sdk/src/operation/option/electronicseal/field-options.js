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

const Schema = require('validate'),
	FieldLocation = require('./field-location');

/**
 * Parameters specifying options related to the seal field required for {@link SealOptions}.
 */
class FieldOptions {

	/**
	 *  @hideconstructor
	 *  @param builder
	 */
	constructor(builder) {
		this.fieldLocation = builder.fieldLocation;
		this.pageNumber = builder.pageNumber;
		this.fieldName = builder.fieldName;
		this.visible = builder.visible != null ? builder.visible : true;
		Object.preventExtensions(this);
	}

	/**
	 * Returns the intended field name to be used.
	 * @return {string} the seal field name
	 */
	getFieldName() {
		return this.fieldName;
	}

	/**
	 * Returns the intended visibility flag for the electronic seal.
	 * @return {boolean} the visibility flag
	 */
	isVisible() {
		return this.visible;
	}

	/**
	 * Returns the intended page number for the electronic seal.
	 * @return {Number} the page number
	 */
	getPageNumber() {
		return this.pageNumber;
	}

	/**
	 * Returns a {@link FieldLocation} instance specifying coordinates for the electronic seal.
	 * @return {FieldLocation} the seal field location options
	 */
	getFieldLocation() {
		return this.fieldLocation;
	}

	/**
	 * Builds a {@link FieldOptions} instance.
	 */
	static get Builder() {

		class FieldOptionsBuilder {

			/**
			 * Constructs a {@link FieldOptionsBuilder} instance.
			 */
			constructor(fieldName) {
				this.fieldName = fieldName;
			}

			/**
			 * Sets the seal visibility flag.
			 * Specifies whether the signature field is visible. The default value of true creates a visible signature.
			 *
			 * @param {boolean} visible the seal visibility flag
			 * @return this Builder instance to add any additional parameters
			 */
			setVisible(visible) {
				this.visible = visible;
				return this;
			}

			/**
			 * Sets the page number for seal
			 *
			 * @param {Number} pageNumber the page number of input pdf document
			 * @return this Builder instance to add any additional parameters
			 */
			setPageNumber(pageNumber) {
				this.pageNumber = pageNumber;
				return this;
			}

			/**
			 * Sets the location for the seal field in the document.
			 *
			 * @param {FieldLocation} fieldLocation the seal field location instance
			 * @return this Builder instance to add any additional parameters
			 */
			setFieldLocation(fieldLocation) {
				this.fieldLocation = fieldLocation;
				return this;
			}

			/**
			 * Returns a new {@link FieldOptions} instance built from the current state of this builder.
			 *
			 * @return a new {@link FieldOptions} instance
			 */
			build() {
				let fieldOptions =  new FieldOptions(this);
				Object.freeze(fieldOptions);
				return fieldOptions;
			}
		}

		return FieldOptionsBuilder;
	}

	validate() {
		const validator = new Schema({
			'pageNumber': {
				type: Number,
				match : /^[1-9]+[0-9]*$/u,
				message: {
					type: 'Page number must be a positive Number',
					match: 'Page number in field options is invalid.'
				}
			},
			'fieldName': {
				type: String,
				required: true,
				message: {
					type: 'Field name must be a String',
					required: 'Field name in field options cannot be null or empty.'
				}
			},
			'fieldLocation': {
				type: FieldLocation,
				message: {
					type: 'Field location must be an Object'
				}
			},
			'visible': {
				type: Boolean,
				message: {
					type: 'Visible must be a Boolean.'
				}
			}
		});
		return validator.validate(this);
	}
}

module.exports = FieldOptions;
