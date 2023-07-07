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

const {v4} = require('uuid');

class PlatformMessage {
	constructor(files, targetFileName, options, operationName, operationNameHeader, includeRanges, outputType) {
		this.files = files;
		this.targetFileName = targetFileName;
		this.options = options;
		this.operationName = operationName;
		this.operationNameHeader = operationNameHeader
		this.includeRanges = includeRanges;
		this.outputType = outputType;
		this.requestId = v4();
	}

	setInputUrl(inputUrl) {
		this.inputUrl = inputUrl;
	}

	isUploadNeeded(isUploadNeeded) {
		this.isUploadNeeded = isUploadNeeded;
	}
}

module.exports = PlatformMessage;
