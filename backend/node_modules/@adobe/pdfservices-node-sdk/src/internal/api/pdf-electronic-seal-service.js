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
	AppearanceOptions = require('../../operation/option/electronicseal/appearance-options'),
	PDFServicesConfig = require("../config/pdf-services-config");

class PDFElectronicSealService extends PlatformOperationService {

	constructor() {
		super();
		this.sealImage = null;
	}

	setSealImage(sealImage) {
		this.sealImage = sealImage;
	}

	getPlatformMessage(operationMessage) {
		let files = [operationMessage.sourceFileRefs];
		if (this.sealImage !== null) {
			files.push(this.sealImage);
		}
		let targetFileName = operationMessage.targetFileName;
		let options = (operationMessage.options) ? Object.assign({}, operationMessage.options) : {};
		let operationName = PDFServicesConfig.electronicSeal;
		return new PlatformMessage(files, targetFileName, options, operationName, operationMessage.operationName);
	}

	setContentForSealOptions(sealOptions) {
		let	sealFieldOptions = {}, content = {};
		sealFieldOptions = Object.assign(sealFieldOptions, {
			sealFieldOptions: {
				fieldName: sealOptions.fieldOptions.fieldName,
				visible : sealOptions.fieldOptions.visible
			}
		});
		if (sealOptions.fieldOptions.pageNumber) {
			sealFieldOptions = Object.assign(sealFieldOptions, {
				sealFieldOptions: {
					...sealFieldOptions.sealFieldOptions,
					pageNumber: sealOptions.fieldOptions.pageNumber
				}
			});
		}
		if (sealOptions.fieldOptions.fieldLocation) {
			sealFieldOptions = Object.assign(sealFieldOptions, {
				sealFieldOptions: {
					...sealFieldOptions.sealFieldOptions,
					location: {
						top: sealOptions.fieldOptions.fieldLocation.top,
						left: sealOptions.fieldOptions.fieldLocation.left,
						right: sealOptions.fieldOptions.fieldLocation.right,
						bottom: sealOptions.fieldOptions.fieldLocation.bottom
					}
				}
			});
		}
		if (sealOptions.appearanceOptions.appearanceItems.size === 0) {
			sealOptions.appearanceOptions.addItem(AppearanceOptions.AppearanceItem.NAME);
			sealOptions.appearanceOptions.addItem(AppearanceOptions.AppearanceItem.LABELS);
		}

		content = Object.assign(content, {
			sealOptions: {
				signatureFormat: sealOptions.signatureFormat,
				cscCredentialOptions: {
					credentialId: sealOptions.certificateCredentials.credentialID,
					providerName: sealOptions.certificateCredentials.providerName,
					authorizationContext: {
						tokenType: sealOptions.certificateCredentials.cscAuthContext.tokenType,
						accessToken: sealOptions.certificateCredentials.cscAuthContext.accessToken,
					},
					credentialAuthParameters: {
						pin: sealOptions.certificateCredentials.pin,
					}
				},
				sealFieldOptions: {
					...sealFieldOptions.sealFieldOptions
				},
				sealAppearanceOptions: {displayOptions: Array.from(sealOptions.appearanceOptions.appearanceItems)}
			}
		});

		return content;
	}

	createRequestBodyContentForCreateJob(platformMessage, locations) {
		let content;
		content = this.setContentForSealOptions(platformMessage.options);
		content = Object.assign(content,{inputDocumentAssetID: locations[0]});
		if (locations.length>1) {
			content = Object.assign(content, {sealImageAssetID: locations[1]});
		}
		return content;
	}

}

module.exports = PDFElectronicSealService;
