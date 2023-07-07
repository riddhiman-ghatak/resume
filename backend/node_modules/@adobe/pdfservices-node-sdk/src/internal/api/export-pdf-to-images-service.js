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
	{writeFile} = require("../util/file-util");

class ExportPDFToImagesService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let options = Object.assign({}, {
			targetFormat: operationMessage.targetFormat.extension,
			outputType: operationMessage.outputType
		});
		let operationApiName = PDFServicesConfig.exportPdfToImages;
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
	}

	getAssetListOrMetadata(response) {
		return response.content.assetList.map((asset) => {
			return asset.downloadUri;
		});
	}

	writeFileToLocal(responses, platformMessage) {
		let fileRefList = responses.map((response, index) => {
			let targetFileName = index + platformMessage.targetFileName;
			let fileRef = writeFile(response.content, targetFileName);
			fileRef.input.isOperationResult = true;
			return fileRef;
		});
		return Promise.resolve(fileRefList);
	}

}

module.exports = ExportPDFToImagesService;
