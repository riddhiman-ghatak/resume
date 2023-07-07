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
 * Supported elements to represent electronic seal required for {@link AppearanceOptions}.
 * @enum
 * @memberOf AppearanceOptions
 * @readonly
 */
const AppearanceItem = {

	/**
	 * Represents the name of certificate owner.
	 * @type {string}
	 */
	NAME : "NAME",

	/**
	 * Represents the date of applying electronic seal.
	 * @type {string}
	 */
	DATE : "DATE",

	/**
	 * Represents the distinguished name information of certificate.
	 * @type {string}
	 */
	DISTINGUISHED_NAME : "DISTINGUISHED_NAME",

	/**
	 * Represents Labels for Seal Information.
	 * @type {string}
	 */
	LABELS : "LABELS",

	/**
	 * Represents the background image to be used for sealing.
	 * @type {string}
	 */
	SEAL_IMAGE : "SEAL_IMAGE"

}
Object.freeze(AppearanceItem);

/**
 * Parameters specifying set of elements (i.e. appearance items) to represent electronic seal
 * required for {@link SealOptions}.
 */
class AppearanceOptions {

	/**
	 * Creates a new {@link AppearanceOptions} instance.
	 */
	constructor() {
		this.appearanceItems = new Set();
	}

	/**
	 * Add the appearance items to the set.
	 * @param {AppearanceOptions.AppearanceItem} appearanceItem the appearance item
	 */
	addItem(appearanceItem){
		this.appearanceItems.add(appearanceItem);
	}

	/**
	 * Returns the set of seal appearance items.
	 * @return {Set} the set of seal appearance items
	 */
	getItems() {
		return this.appearanceItems;
	}

	static get AppearanceItem() {
		return AppearanceItem;
	}
}

module.exports = AppearanceOptions;
