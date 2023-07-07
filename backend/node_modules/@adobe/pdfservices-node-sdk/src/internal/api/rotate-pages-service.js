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

class RotatePagesService extends PlatformOperationService {
	constructor() {
		super();
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		let targetFileName = operationMessage.targetFileName;
		let pageActions;
		pageActions = operationMessage.options.pageActions.map((pageAction) => {
			return pageAction.pageAction;
		});
		let options = {pageActions: pageActions};
		let operationApiName = PDFServicesConfig.pageManipulation;
		return new PlatformMessage(files, targetFileName, options, operationApiName, operationMessage.operationName);
	}

}

module.exports = RotatePagesService;

