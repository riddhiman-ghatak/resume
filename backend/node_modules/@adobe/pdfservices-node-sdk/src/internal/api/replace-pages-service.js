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
	PageRanges = require('./../../operation/option/page-ranges'),
	PlatformMessage = require('../platform/platform-message'),
	PDFServicesConfig = require('../config/pdf-services-config'),
	PageRange = require("../io/page-range");

class ReplacePagesService extends PlatformOperationService {
	constructor() {
		super();
	}

	getFilesToReplace(baseFileRef, filesToReplace) {
		let keys = Object.keys(filesToReplace);
		keys.sort();
		let fileRefList = [],
			pageRangeList = [];
		let baseFileStartIndex = 1;

		for (let key of keys) {
			let entry = parseInt(key, 10);
			if (entry !== baseFileStartIndex) {
				fileRefList.push(baseFileRef);
				let pageRange = new PageRanges();
				pageRange.addPageRange(baseFileStartIndex, entry - 1);
				pageRangeList.push(pageRange);
			}
			fileRefList.push(filesToReplace[entry].getSourceFileRef());
			pageRangeList.push(filesToReplace[entry].getPageRanges());
			baseFileStartIndex = entry + 1;
		}
		fileRefList.push(baseFileRef);
		let pageRange = new PageRanges();
		pageRange.addAllFrom(baseFileStartIndex);
		pageRangeList.push(pageRange);
		return {fileRefList: fileRefList, pageRangeList: pageRangeList};
	}

	getPlatformMessage(operationMessage) {
		let filesAndPageRanges = this.getFilesToReplace(operationMessage.baseFileRef, operationMessage.sourceFileRefs),
			fileRefList = filesAndPageRanges.fileRefList,
			pageRangeList = filesAndPageRanges.pageRangeList;
		if (fileRefList.length > 20) {
			throw new Error("Too many replacements specified for the operation");
		}

		let targetFileName = operationMessage.targetFileName;
		let options = operationMessage.options;
		let operationApiName = PDFServicesConfig.combinePdf;
		return new PlatformMessage(fileRefList, targetFileName, options, operationApiName, operationMessage.operationName, pageRangeList);
	}

	createRequestBodyContentForCreateJob(platformMessage, assetIDs) {
		let assetsArray = assetIDs.map((asset, index) => {
			return {
				assetID: asset,
				pageRanges: platformMessage.includeRanges[index].getRanges().length !== 0 ?
					platformMessage.includeRanges[index].getRanges() : [new PageRange(1, undefined)]
			};
		});
		return {assets: assetsArray};
	}

}

module.exports = ReplacePagesService;
