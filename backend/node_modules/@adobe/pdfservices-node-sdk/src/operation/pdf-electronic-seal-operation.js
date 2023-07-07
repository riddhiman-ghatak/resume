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
const PDFElectronicSealService = require('../internal/api/pdf-electronic-seal-service'),
	logger = require('./../internal/logger'),
	{
		validateClientContext, validateSealOptions, validateAllowedMediaType
	} = require('./../internal/util/validation-util'),
	DefaultConfig =  require('../internal/config/dc-services-default-config.js'),
	SealOptions = require('./option/electronicseal/seal-options'),
	OperationMessage = require('../internal/platform/operation-message'),
	ExtensionMediaTypeMapping = require('../internal/extension-mediatype-mapping'),
	{ getRandomFileNameWithExtension } = require('../internal/util/path-util'),
	_ = require('lodash-core');


/**
 *
 * Supported source file formats for {@link PDFElectronicSealOperation}.
 * @enum
 * @readonly
 * @memberOf PDFElectronicSealOperation
 *
 */
const SupportedSourceFormat = {

		/**
		 * Represents "application/pdf" media type.
		 * @type {string}
		 */
		pdf: ExtensionMediaTypeMapping.pdf.mediaType,

	},

	/**
	 * Supported seal image media types for {@Link PDFElectronicSealOperation}.
	 * @enum
	 * @memberOf PDFElectronicSealOperation
	 * @readonly
	 */
	SupportedSealImageFormat = {
		/**
		 * Represents "application/pdf" media type.
		 * @type {string}
		 */
		pdf: ExtensionMediaTypeMapping.pdf.mediaType,
		/**
		 * Represents "image/jpeg" media type
		 * @type {string}
		 */
		jpeg: ExtensionMediaTypeMapping.jpeg.mediaType,

		/**
		 * Represents "image/png" media type
		 * @type {string}
		 */
		png: ExtensionMediaTypeMapping.png.mediaType,

	},

	allowedConfiguration = {

		getSupportedSourceMediaType() {
			return Object.values(SupportedSourceFormat);
		},

		getSupportedSealImageMediaType() {
			return Object.values(SupportedSealImageFormat);
		}

	};
Object.freeze(allowedConfiguration);
Object.freeze(SupportedSourceFormat);
Object.freeze(SupportedSealImageFormat);

/**
 * An operation that allows clients to apply an electronic seal onto various PDF documents such as
 * agreements, invoices and more.
 * <p>
 * To know more about PDF Electronic Seal, please see the <a href="http://www.adobe.com/go/dc_eseal_overview_doc" target="_blank">documentation</a>.
 * <p>
 *
 * Sample Usage:
 * <pre class="prettyprint">
 * <code>
 *  const pdfElectronicSeal = PDFServicesSdk.PDFElectronicSeal,
 *  	options = pdfElectronicSeal.options;
 *
 *  const certificateCredentials = options.CertificateCredentials.cscCredentialBuilder()
 *  	.withProviderName("&lt;PROVIDER_NAME&gt;")
 *  	.withCredentialID("&lt;CREDENTIAL_ID&gt;")
 *  	.withPin("&lt;PIN&gt;")
 *  	.withCSCAuthContext(new options.CSCAuthContext("&lt;ACCESS_TOKEN&gt;"))
 *  	.build();
 *
 *  const sealFieldName = "Signature1";
 *  const fieldOptions = new options.FieldOptions.Builder(sealFieldName)
 *  	.setFieldLocation(new options.FieldLocation(150, 250, 350, 200))
 *  	.setPageNumber(1)
 *  	.build();
 *
 *  const sealOptions = new options.SealOptions.Builder(certificateCredentials, fieldOptions).build(),
 *  	pdfElectronicSealOperation = pdfElectronicSeal.Operation.createNew(sealOptions);
 *
 *  pdfElectronicSealOperation.setInput(PDFServicesSdk.FileRef.createFromLocalFile('~/Documents/sampleInvoice.pdf'));
 *  const credentials =  PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
 *         .withClientId("PDF_SERVICES_CLIENT_ID")
 *         .withClientSecret("PDF_SERVICES_CLIENT_SECRET")
 *         .build();
 *  pdfElectronicSealOperation.execute(PDFServicesSdk.ExecutionContext.create(credentials))
 *  	.then(result => result.saveAsFile('output/sealedOutput.pdf'));
 * </code>
 * </pre>
 */

class PDFElectronicSealOperation {
	/**
	 * @hideconstructor
	 */
	constructor(sealOptions) {
		this.sealOptions = sealOptions;
		this.inputDocument = null;
		this.sealImage = null;
		this.isInvoked = false;
		Object.preventExtensions(this);
	}

	/**
	 * Sets the input PDF document.
	 *
	 * @param {!FileRef} inputDoc an input file; Cannot be null
	 */
	setInput(inputDoc) {
		if (inputDoc == null) throw new Error('No input was set for operation');
		this.inputDocument = inputDoc
	}

	/**
	 * Sets the seal image file.
	 *
	 * @param {FileRef} sealImage a seal image file
	 */
	setSealImage(sealImage) {
		if (sealImage != null) {
			this.sealImage = sealImage;
		}
	}

	static get SupportedSourceFormat() {
		return SupportedSourceFormat;
	}

	/**
	 * Constructs a {@link PDFElectronicSealOperation} instance.
	 *
	 * @param {!SealOptions} sealOptions options for applying electronic seal on the input PDF document; Cannot be null.
	 * @returns {PDFElectronicSealOperation} a new PDFElectronicSealOperation instance
	 */
	static createNew (sealOptions) {
		return new PDFElectronicSealOperation(sealOptions);
	}

	/**
	 * Executes this operation synchronously using the supplied context and returns a new FileRef instance for the resulting sealed file.
	 *
	 * The resulting file may be stored in the system temporary directory (per the os.tempdir(), symlinks are resolved to the actual path).
	 * See {@link FileRef} for how temporary resources are cleaned up.
	 *
	 * @param {!ExecutionContext} context the context in which to execute the operation.
	 * @returns {Promise<FileRef>} A promise which resolves to the operation result.
	 * @throws {ServiceApiError} if an API call results in an error response.
	 * @throws {ServiceUsageError} If service usage limits have been reached or credentials quota has been exhausted.
	 */
	execute(context) {
		try {
			this.validate(context);
		} catch (err) {
			return Promise.reject(err);
		}
		logger.info('All validations successfully done. Beginning electronic Seal Operation execution');

		const targetFileName = getRandomFileNameWithExtension("pdf"),
			operationMessage = new OperationMessage(this.inputDocument, targetFileName, DefaultConfig.operationName.eSeal),
			pdfElectronicSealService = new PDFElectronicSealService();
		operationMessage.setOptions(this.sealOptions);
		pdfElectronicSealService.setSealImage(this.sealImage);
		this.isInvoked = true;
		return pdfElectronicSealService.perform(context, operationMessage)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	}

	validate(context) {
		if (this.isInvoked)
			throw new Error('Operation instance must only be invoked once');
		validateClientContext(context);

		if (this.inputDocument ==  null) throw  new Error("No input was set for operation");

		validateAllowedMediaType(allowedConfiguration.getSupportedSourceMediaType(), this.inputDocument);
		if (this.sealImage != null) {
			validateAllowedMediaType(allowedConfiguration.getSupportedSealImageMediaType(), this.sealImage);
		}

		if (this.sealOptions == null) throw new Error("PDF Electronic Seal options cannot be null");
		if (!(this.sealOptions instanceof SealOptions)) {
			throw new Error('Invalid option instance type provided for the electronic seal operation');
		}
		const copy = _.cloneDeep(this.sealOptions);
		validateSealOptions(copy);
	}
}
module.exports = PDFElectronicSealOperation;
