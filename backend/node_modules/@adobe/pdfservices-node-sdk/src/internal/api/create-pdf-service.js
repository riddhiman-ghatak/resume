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
	ExtensionMediaTypeMapping = require('../extension-mediatype-mapping'),
	PDFServicesConfig = require('../config/pdf-services-config');

class CreatePDFService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let options;
		let operationApiName;
		if (operationMessage.inputUrl !== null) {
			options = this.getHtmlToPDFOptions(operationMessage);
			operationApiName = PDFServicesConfig.htmlToPdf;
			let platformMessage = new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
			platformMessage.setInputUrl(operationMessage.sourceFileRefs.input.inputUrl);
			platformMessage.isUploadNeeded(false);
			return platformMessage;
		}
		switch (operationMessage.sourceFileRefs.input.extension) {
			case ExtensionMediaTypeMapping.html.extension:
			case ExtensionMediaTypeMapping.zip.extension: {
				options = this.getHtmlToPDFOptions(operationMessage);
				operationApiName = PDFServicesConfig.htmlToPdf;
				break;
			}
			default: {
				options = operationMessage.options;
				operationApiName = PDFServicesConfig.createPdf;
				break;
			}
		}
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
	}

	createRequestBodyContentForCreateJob(platformMessage, assetIDs) {
		let content = {};
		content = Object.assign(content, platformMessage.options);
		if (platformMessage.isUploadNeeded === false) {
			content = Object.assign(content, {inputUrl: platformMessage.inputUrl});
		} else {
			content = Object.assign(content, {assetID: assetIDs[0]});
		}
		return content;
	}

	getHtmlToPDFOptions(operationMessage) {
		let options = {};
		if (operationMessage.options) {
			let createPDFOptions = operationMessage.options;
			options = Object.assign({},
				{
					pageLayout: {
						pageWidth: createPDFOptions.pageLayout.pageWidth,
						pageHeight: createPDFOptions.pageLayout.pageHeight
					},
					includeHeaderFooter: createPDFOptions.includeHeaderFooter,
					json: JSON.stringify(createPDFOptions.dataToMerge)
				});
		}
		return options;
	}

}

module.exports = CreatePDFService;
