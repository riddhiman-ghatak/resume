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
	{writeFile} = require('../util/file-util');

class SplitPDFService extends PlatformOperationService {
	constructor() {
		super();
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

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let operationApiName = PDFServicesConfig.splitPdf;
		let options = (operationMessage.options) ? Object.assign({}, {
			splitoption: {
				fileCount: operationMessage.options.fileCount === null ? undefined : operationMessage.options.fileCount,
				pageCount: operationMessage.options.pageCount === null ? undefined : operationMessage.options.pageCount,
				pageRanges: operationMessage.options.pageRanges === null ? undefined : operationMessage.options.pageRanges.getRanges()
			}
		}) : {};
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
	}

	getAssetListOrMetadata(response) {
		return response.content.assetList.map((asset) => {
			return asset.downloadUri;
		});
	}

}

module.exports = SplitPDFService;

