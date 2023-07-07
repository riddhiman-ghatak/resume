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
	PDFServicesConfig = require('../config/pdf-services-config'),
	Metadata = require('../platform/pdf-properties/metadata'),
	PDFProperties = require('../../io/pdf-properties/pdf-properties');

class PDFPropertiesService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let options = (operationMessage.options) ? Object.assign({}, operationMessage.options) : {"pageLevel": false};
		let operationApiName = PDFServicesConfig.pdfProperties;
		let outputType = operationMessage.outputType;
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName, null, outputType);
	}

	getOperationResult(context, response, platformMessage) {
		let metadata = new Metadata(response.content.metadata);
		return this.getPDFPropertiesObject(metadata);
	}

	getPDFPropertiesObject(metadata) {
		let pdfProperties = new PDFProperties();
		pdfProperties = Object.assign(pdfProperties, metadata);
		return pdfProperties;
	}
}

module.exports = PDFPropertiesService;
