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

const ExportPDFService = require('../internal/api/export-pdf-service'),
	OperationMessage = require('../internal/platform/operation-message'),
	logger = require('./../internal/logger'),
	{ getRandomFileNameWithExtension } = require('./../internal/util/path-util'),
	ExtensionMediaTypeMapping = require('./../internal/extension-mediatype-mapping'),
	DefaultConfig = require('../internal/config/dc-services-default-config.js'),
	{
		validateAllowedMediaType, validateFileRef, validateClientContext
	} = require('../internal/util/validation-util');


/**
 *
 * Supported source file formats for {@link ExportPDFOperation}.
 * @enum
 * @readonly
 * @memberOf ExportPDFOperation
 *
 */
const SupportedSourceFormat = {
		/**
		 * Represents "application/pdf" media type
		 * @type {string}
		 */
		pdf: ExtensionMediaTypeMapping.pdf.mediaType
	},
	/**
	 * List of target formats for {@Link ExportPDFOperation}.
	 * @enum
	 * @memberOf ExportPDFOperation
	 * @readonly
	 */
	SupportedExportFormats = {
		/**
		 * Represents "application/msword" media type.
		 * @type {Object}
		 */
		DOC: ExtensionMediaTypeMapping.doc,

		/**
		 * Represents "application/vnd.openxmlformats-officedocument.wordprocessingml.document" media type
		 * @type {Object}
		 */
		DOCX: ExtensionMediaTypeMapping.docx,

		/**
		 * Represents "application/vnd.openxmlformats-officedocument.presentationml.presentation" media type
		 * @type {Object}
		 */
		PPTX: ExtensionMediaTypeMapping.pptx,

		/**
		 * Represents "text/rtf" media type.
		 * @type {Object}
		 */
		RTF: ExtensionMediaTypeMapping.rtf,

		/**
		 * Represents "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" media type
		 * @type {Object}
		 */
		XLSX: ExtensionMediaTypeMapping.xlsx
	},
	allowedConfiguration = {
		supportedTargetFormats: SupportedExportFormats,

		isValidTargetFormat(targetFormat) {
			return targetFormat && Object.keys(allowedConfiguration.supportedTargetFormats)
				.some(format => this.supportedTargetFormats[format] === targetFormat);
		},

		getSupportedMediaTypes() {
			return Object.values(SupportedSourceFormat);
		}
	};
Object.freeze(SupportedExportFormats);
Object.freeze(SupportedSourceFormat);
Object.freeze(allowedConfiguration);


/**
 * An operation which exports a source PDF file to a supported format specified by
 * {@link ExportPDFOperation.SupportedExportFormats}.
 * <p>
 *
 * Sample Usage:
 * <pre class="prettyprint">
 * <code>
 *  const credentials = PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
 *            .withClientId("PDF_SERVICES_CLIENT_ID")
 *            .withClientSecret("PDF_SERVICES_CLIENT_SECRET")
 *            .build(),
 *        executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
 *        ExportPDF = PDFServicesSdk.ExportPDF,
 *        exportPdfOperation = ExportPDF.Operation.createNew(ExportPDF.SupportedTargetFormats.DOCX),
 *        input = PDFServicesSdk.FileRef.createFromLocalFile('PDF.pdf', ExportPDF.SupportedSourceFormat.pdf);
 *
 *  exportPdfOperation.setInput(input);
 *
 *  exportPdfOperation.execute(executionContext)
 *      .then(result => result.saveAsFile('exportPdf.docx'))
 *      .catch(err => console.log(err));
 *
 * </code>
 * </pre>
 *
 */
class ExportPDFOperation {
	/**
	 * @hideconstructor
	 * @param targetFormat
	 */
	constructor(targetFormat) {
		this.targetFormat = targetFormat;
		this.sourceFileRef = null;
		this.options = null;
		Object.preventExtensions(this);
	}

	static get SupportedExportFormats() {
		return SupportedExportFormats;
	}

	static get SupportedSourceFormat() {
		return SupportedSourceFormat;
	}

	/**
	 * Constructs an {@link ExportPDFOperation} instance.
	 *
	 * @param {!ExportPDFOperation.SupportedExportFormats} targetFormat - Format to which the PDF will be exported to.
	 * @returns {ExportPDFOperation} A new ExportPDFOperation instance
	 *
	 */
	static createNew(targetFormat) {
		if (!allowedConfiguration.isValidTargetFormat(targetFormat)) {
			throw new Error(`Invalid target format ${targetFormat} provided for export operation`);
		}
		return new ExportPDFOperation(targetFormat);
	}

	static getTargetFormats() {
		return allowedConfiguration.supportedTargetFormats;
	}

	/**
	 * Sets an input PDF file (media type "application/pdf").
	 *
	 * @param {!FileRef} sourceFileRef - An input PDF file.
	 */
	setInput(sourceFileRef) {
		this.sourceFileRef = sourceFileRef;
	}

	/**
	 * Sets the options for this operation. See {@link ExportPDFOptions} for how to specify the options for the different locales.
	 * @param {ExportPDFOptions=} options - optional parameters.
	 */
	setOptions(options) {
		this.options = options;
	}


	/**
	 * Executes this operation using the supplied context and returns a Promise which resolves to the operation result.
	 *
	 * The resulting file may be stored in the system temporary directory (per the os.tempdir(), symlinks are resolved
	 * to the actual path).
	 * See {@link FileRef} for how temporary resources are cleaned up.
	 *
	 * @param {!ExecutionContext} context - The context in which the operation will be executed.
	 * @returns {Promise<FileRef>} A promise which resolves to the operation result.
	 * @throws {ServiceApiError} if an API call results in an error response.
	 * @throws {ServiceUsageError} if service usage limits have been reached or credentials quota has been exhausted.
	 */

	execute(context) {
		try {
			this.validate(context);
		} catch (err) {
			return Promise.reject(err);
		}
		logger.info('All validations successfully done. Beginning PDF export');
		const targetFileName = getRandomFileNameWithExtension(this.targetFormat.extension),
			operationMessage = new OperationMessage(this.sourceFileRef, targetFileName, DefaultConfig.operationName.exportPdf),
			exportPDFService = new ExportPDFService();
		operationMessage.setTargetFormat(this.targetFormat);
		operationMessage.setOptions(this.options);
		return exportPDFService.perform(context, operationMessage)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	}

	validate(context) {
		validateClientContext(context);
		validateFileRef(this.sourceFileRef);
		validateAllowedMediaType(allowedConfiguration.getSupportedMediaTypes(), this.sourceFileRef);
	}
}

Object.freeze(ExportPDFOperation);
module.exports = ExportPDFOperation;
