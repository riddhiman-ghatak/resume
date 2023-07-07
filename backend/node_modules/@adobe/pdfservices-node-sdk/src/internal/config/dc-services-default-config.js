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

const projectJson = require('./../../../package.json');

const customErrorMessages = {

	// Custom IMS error messages
	imsInvalidTokenGenericErrorMessage: 'Either your certificate for PDF Services API credentials has expired or an ' +
		'invalid Organization_ID/Account_ID has been used in credentials. Please visit Adobe IO ' +
		'Console(http://console.adobe.io/) to update your public certificate to use the same credentials or to check ' +
		'the value of Organization Id or Account ID.',
	imsCertificateExpiredErrorMessage: 'Your certificate for PDF Services API credentials might have expired. ' +
		'Please visit Adobe IO Console(http://console.adobe.io/) to update your public certificate to use the same ' +
		'credentials.',

	// Service usage exception error messages
	serviceUsageLimitReachedErrorMessage: 'Service usage limit has been reached. Please retry after sometime.',
	integrationServiceUsageLimitReachedErrorMessage: 'Service usage limit has been reached for the integration. ' +
		'Please retry after sometime.'
};

const defaultConfig = {
	logFileName: 'config/pdfservices-sdk-log4js-config.json',
	tempFolderName: 'pdfServicesSdkResult',
	globalApiKey: 'AdobeDCPlatformOperationKey',

	http: {
		connectTimeout: 10000,
		readTimeout: 10000
	},
	processingTimeout: 1000 * 60 * 10,
	pdfServicesUri: "https://pdf-services.adobe.io",
	pdfServicesRegionURI: {
		US: "https://pdf-services-ue1.adobe.io",
		EU: "https://pdf-services-ew1.adobe.io"
	},
	imsBaseUri: "https://ims-na1.adobelogin.com",
	imsTokenUri: "https://ims-na1.adobelogin.com/ims/token/v1",
	claim: "/s/ent_documentcloud_sdk",
	jwt: {
		baseUri: 'https://ims-na1.adobelogin.com',
		uriSuffix: 'ims/exchange/jwt/',
		audienceSuffix: 'c/'
	},
	servicePrincipal: {
		uriSuffix: 'token',
	},
	appInfo: `${projectJson.name}-${projectJson.version}`,
	awsSpecificGenericErrorMessage: "An exception occurred while processing the file.",
	specialHttpErrorCodes: {
		503: 'ServiceUnavailable:The Gateway servers are up, but overloaded with requests. Try again later.',
		// eslint-disable-next-line max-len
		504: 'Gateway Timeout:The Gateway servers are up, but the request could not be serviced due to some failure within our stack. Try again later.',
		502: 'BadGateway:Bad gateway',
		413: 'RequestEntityTooLarge:Request entity too large'
	},
	apiGatewayErrorCodes: {
		429: {
			'429001': {
				errorMessage: customErrorMessages.serviceUsageLimitReachedErrorMessage
			},
			'429002': {
				errorMessage: customErrorMessages.integrationServiceUsageLimitReachedErrorMessage
			}
		}
	},
	imsErrorCodes: {
		400: {
			'invalid_token': {
				imsInvalidTokenGenericErrorMessage: customErrorMessages.imsInvalidTokenGenericErrorMessage,
				imsCertificateExpiredErrorMessage: customErrorMessages.imsCertificateExpiredErrorMessage
			}
		}
	},
	operationName: {
		autotagPdf: 'Autotag PDF Operation',
		createPdf: 'Create PDF Operation',
		combinePdf: 'Combine Files Operation',
		exportPdf: 'Export PDF Operation',
		exportPdfToImages: 'Export PDF to Images Operation',
		htmlToPdf: 'HTML to PDF Operation',
		ocr: 'OCR Operation',
		compressPdf: 'Compress PDF Operation',
		linearizePdf: 'Linearize PDF Operation',
		protectPdf: 'Protect PDF Operation',
		insertPages: 'Insert Pages Operation',
		replacePages: 'Replace Pages Operation',
		reorderPages: 'Reorder Pages Operation',
		rotatePages: 'Rotate Pages Operation',
		deletePages: 'Delete Pages Operation',
		removeProtection: 'Remove Protection Operation',
		splitPDF: 'Split PDF Operation',
		mergeDocument: 'Document Merge Operation',
		extractPdf: 'Extract PDF Operation',
		PDFProperties: 'PDF Properties Operation',
		eSeal: 'Electronic Seal Operation',

	},
	contentType: "content-type"
};

module.exports = defaultConfig;
