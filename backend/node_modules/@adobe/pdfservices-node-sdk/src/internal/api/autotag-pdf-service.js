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

const PlatformOperationService = require('./platform-operation-service'),
	PlatformMessage = require('../platform/platform-message'),
	PDFServicesConfig = require('../config/pdf-services-config'),
	AutotagPDFOutput = require("../../io/autotag/autotag-pdf-output"),
	ExtensionMediaTypeMapping = require('../extension-mediatype-mapping'),
	defaultConfig = require('../../internal/config/dc-services-default-config');

const {writeFile} = require("../util/file-util");

class AutoTagPDFService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let autotagTargetFileNames = operationMessage.targetFileName;

		// creating options object from Autotag options class
		let options = (operationMessage.options) ?
			{
				shiftHeadings: operationMessage.options.shiftHeadings,
				generateReport: operationMessage.options.generateReport
			} :
			{};

		let operationApiName = PDFServicesConfig.autotagPdf;
		return new PlatformMessage(files, autotagTargetFileNames, options, operationApiName, operationMessage.operationName);
	}

	getAssetListOrMetadata(response) {
		let result = [response.content["tagged-pdf"]?.downloadUri];
		// if report is generated in response then add it to result
		response.content.report ? result.push(response.content.report.downloadUri) : null;
		return result;
	}

	writeFileToLocal(responses, platformMessage) {
		let autotagPDFOutputArg = {};

		responses.map((response) => {
			let isGeneratedReport = response.headers[defaultConfig.contentType] === ExtensionMediaTypeMapping.xlsx.mediaType;
			let targetFileName = isGeneratedReport ?
				platformMessage.targetFileName.reportFileNameWithExtension :
				platformMessage.targetFileName.taggedPDFFileNameWithExtension;

			let fileRef = writeFile(response.content, targetFileName);
			fileRef.input.isOperationResult = true;
			isGeneratedReport ? autotagPDFOutputArg.reportFileRef = fileRef : autotagPDFOutputArg.taggedPDFFileRef = fileRef;
			return fileRef;
		});


		let autotagPDFOutput = new AutotagPDFOutput(autotagPDFOutputArg);
		return Promise.resolve(autotagPDFOutput);
	}

}

module.exports = AutoTagPDFService;
