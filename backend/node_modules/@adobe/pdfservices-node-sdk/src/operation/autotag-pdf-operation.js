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

const AutotagPDFService = require('../internal/api/autotag-pdf-service'),
	ExtensionMediaTypeMapping = require('../internal/extension-mediatype-mapping'),
	OperationMessage = require('../internal/platform/operation-message'),
	{getRandomFileNameWithExtension} = require('../internal/util/path-util'),
	logger = require('./../internal/logger'),
	AutotagPDFOptions = require('./option/autotagpdf/autotag-pdf-options'),
	DefaultConfig = require('../internal/config/dc-services-default-config.js'),
	{
		validateClientContext, validateFileRef, validateAllowedMediaType,
		validateOptionInstanceType, validateOperationOptions
	} = require('./../internal/util/validation-util');


/**
 *
 * Supported source file formats for {@link AutotagPDFOperation}.
 * @enum
 * @readonly
 * @memberOf AutotagPDFOperation
 *
 */
const SupportedSourceFormat = {

		/**
		 * Represents "application/pdf" media type
		 * @type {string}
		 */
		pdf: ExtensionMediaTypeMapping.pdf.mediaType
	},

	allowedConfiguration = {
		targetFilesExtension: {
			taggedPDFExtension: ExtensionMediaTypeMapping.pdf.extension,
			reportExtension: ExtensionMediaTypeMapping.xlsx.extension
		},

		getSupportedMediaTypes() {
			return Object.values(SupportedSourceFormat);
		},

		optionInstanceMapping: new Map([
			[ExtensionMediaTypeMapping.pdf, AutotagPDFOptions]
		])
	};
Object.freeze(allowedConfiguration);
Object.freeze(SupportedSourceFormat);

/**
 * An operation that creates PDF documents with enhanced readability from existing PDF documents.
 * An optional tagging report can also be generated which contains the information
 * about the tags that the tagged output PDF document contains.
 *
 * Accessibility tags, used by assistive technology such as screen reader are required to make PDF files compliant.
 * However, the generated PDF is not guaranteed to comply with accessibility standards such as WCAG and PDF/UA as
 * there could be a need to perform further downstream remediation to meet those standards.
 *
 * Sample Usage:
 * <pre class="prettyprint">
 * <code>
 * const credentials =  PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
 *           .withClientId("PDF_SERVICES_CLIENT_ID")
 *           .withClientSecret("PDF_SERVICES_CLIENT_SECRET")
 *           .build(),
 *       executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
 *       AutotagPDF = PDFServicesSdk.AutotagPDF,
 *       autotagPDFOperation = AutotagPDF.Operation.createNew(),
 *       input = PDFServicesSdk.FileRef.createFromLocalFile(
 *                   'autotagPdfInput.pdf',
 *                   AutotagPDF.SupportedSourceFormat.pdf);
 *
 * autotagPDFOperation.setInput(input);
 *
 * autotagPDFOperation.execute(executionContext)
 *     .then(result => result.taggedPDF.saveAsFile("taggedPDFOutput.pdf"))
 *     .catch(err => console.log(err));
 * </code>
 * </pre>
 *
 */
class AutotagPDFOperation {
	/**
	 * @hideconstructor
	 */
	constructor() {
		this._sourceFileRef = null;
		this._options = null;
		Object.preventExtensions(this);
	}

	/**
	 * Constructs an {@link AutotagPDFOperation} instance.
	 * @returns {AutotagPDFOperation} A new AutotagPDFOperation instance.
	 *
	 */
	static createNew() {
		return new AutotagPDFOperation();
	}


	static get SupportedSourceFormat() {
		return SupportedSourceFormat;
	}

	/**
	 * Sets an input file.
	 *
	 * @param {!FileRef} sourceFileRef - An input file.
	 */
	setInput(sourceFileRef) {
		this._sourceFileRef = sourceFileRef;
	}

	/**
	 * Sets the parameters for this operation. See {@link AutotagPDFOptions} for how to specify the options.
	 * @param {AutotagPDFOptions=} options - optional parameters; use null for default values
	 */
	setOptions(options) {
		this._options = options;
	}

	/**
	 * Executes this operation using the supplied context and returns a Promise which resolves to {@link AutotagPDFOutput}.
	 *
	 * The resulting file(s) may be stored in the system temporary directory (per the os.tempdir(), symlinks are resolved
	 * to the actual path).
	 * See {@link FileRef} for how temporary resources are cleaned up.
	 *
	 * @param {!ExecutionContext} context - The context in which the operation will be executed.
	 * @returns {Promise<AutotagPDFOutput>} A promise which resolves to the operation result.
	 * @throws {ServiceApiError} if an API call results in an error response.
	 * @throws {ServiceUsageError} if service usage limits have been reached or credentials quota has been exhausted.
	 */
	execute(context) {
		try {
			this.validate(context);
		} catch (err) {
			return Promise.reject(err);
		}
		logger.info('All validations successfully done. Beginning Autotag PDF operation execution');
		const autotagTargetFileNames = {
				taggedPDFFileNameWithExtension: getRandomFileNameWithExtension(allowedConfiguration.targetFilesExtension.taggedPDFExtension),
				reportFileNameWithExtension: getRandomFileNameWithExtension(allowedConfiguration.targetFilesExtension.reportExtension)
			},
			operationMessage = new OperationMessage(this._sourceFileRef, autotagTargetFileNames, DefaultConfig.operationName.autotagPdf),
			autoTagPDFService = new AutotagPDFService();
		operationMessage.setOptions(this._options);
		return autoTagPDFService.perform(context, operationMessage)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	}

	validate(context) {
		validateClientContext(context);
		validateFileRef(this._sourceFileRef);
		validateAllowedMediaType(allowedConfiguration.getSupportedMediaTypes(), this._sourceFileRef);
		if (this._options != null) {
			validateOptionInstanceType(allowedConfiguration.optionInstanceMapping, this._sourceFileRef, this._options);
			validateOperationOptions(this._options);
		}
	}
}

Object.freeze(AutotagPDFOperation);
module.exports = AutotagPDFOperation;
