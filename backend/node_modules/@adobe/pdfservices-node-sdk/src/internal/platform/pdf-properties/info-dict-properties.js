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

class InfoDictProperties {
	constructor(info_dict) {
		this._creationDate = info_dict?.CreationDate;
		this._creator = info_dict?.Creator;
		this._modDate = info_dict?.ModDate;
		this._producer = info_dict?.Producer;
		this._author = info_dict?.Author;
		this._title = info_dict?.Title;
	}


	get creationDate() {
		return this._creationDate;
	}

	get producer() {
		return this._producer;
	}

	get creator() {
		return this._creator;
	}

	get dateModified() {
		return this._modDate;
	}

	get author() {
		return this._author;
	}

	get title() {
		return this._title;
	}

	set creationDate(creationDate) {
		this._creationDate = creationDate;
	}

	set producer(producer) {
		this._producer = producer;
	}

	set creator(creator) {
		this._creator = creator;
	}

	set dateModified(modDate) {
		this._modDate = modDate;
	}

	set author(author) {
		this._author = author;
	}

	set title(title) {
		this._title = title;
	}

}

module.exports = InfoDictProperties;
