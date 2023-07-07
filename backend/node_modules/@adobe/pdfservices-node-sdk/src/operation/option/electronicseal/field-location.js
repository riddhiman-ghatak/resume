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

const Schema = require('validate');

/**
 * Parameters specifying options related to seal field location coordinates required for {@link FieldOptions}.
 */
class FieldLocation {

	/**
	 * Constructs a {@link FieldLocation} instance.
	 * @param {!Number} left the left coordinate of field location
	 * @param {!Number} top the top coordinate of field location
	 * @param {!Number} right the right coordinate of field location
	 * @param {!Number} bottom the bottom coordinate of field location
	 */
	constructor(left, top, right, bottom) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}

	/**
	 * Returns the left coordinate in default user space units for seal field.
	 * @return {Number} left coordinate value
	 */
	getLeft() {
		return this.left;
	}

	/**
	 * Returns the top coordinate in default user space units for seal field.
	 * @return {Number} top coordinate value
	 */
	getTop() {
		return this.top;
	}

	/**
	 * Returns the right coordinate in default user space units for seal field.
	 * @return {Number} right coordinate value
	 */
	getRight() {
		return this.right;
	}

	/**
	 * Returns the bottom coordinate in default user space units for seal field.
	 * @return {Number} bottom coordinate value
	 */
	getBottom() {
		return this.bottom;
	}

	validate() {
		const validator = new Schema({
			'left': {
				type: Number,
				required: true,
				message: {
					type: 'Left coordinate must be a Number',
					required: 'Left coordinate in field location cannot be null.'
				}
			},
			'top': {
				type: Number,
				required: true,
				message: {
					type: 'Top coordinate must be a Number',
					required: 'Top coordinate in field location cannot be null.'
				}
			},
			'right': {
				type: Number,
				required: true,
				message: {
					type: 'Right coordinate must be a Number',
					required: 'Right coordinate in field location cannot be null.'
				}
			},
			'bottom': {
				type: Number,
				required: true,
				message: {
					type: 'Bottom coordinate must be a Number',
					required: 'Bottom coordinate in field location cannot be null.'
				}
			}
		});
		return validator.validate(this);
	}

}

module.exports = FieldLocation;
