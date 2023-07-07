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

const PlatformOperationService = require('./platform-operation-service'),
	PlatformMessage = require('../platform/platform-message'),
	PDFServicesConfig = require('../config/pdf-services-config');

class ExtractPdfService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let options = (operationMessage.options) ? Object.assign({}, operationMessage.options) : {"elementsToExtract": ["text"]},
			files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let operationApiName = PDFServicesConfig.extractPdf;
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
	}

	getAssetListOrMetadata(response) {
		return [response.content.resource.downloadUri];
	}

}

module.exports = ExtractPdfService;
