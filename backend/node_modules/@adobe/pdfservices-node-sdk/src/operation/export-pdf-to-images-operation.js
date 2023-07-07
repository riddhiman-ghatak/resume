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

const ExportPDFToImagesService = require('../internal/api/export-pdf-to-images-service'),
	OperationMessage = require('../internal/platform/operation-message'),
	logger = require('./../internal/logger'),
	{getRandomFileNameWithExtension} = require('./../internal/util/path-util'),
	ExtensionMediaTypeMapping = require('./../internal/extension-mediatype-mapping'),
	DefaultConfig = require('../internal/config/dc-services-default-config.js'),
	{
		validateAllowedMediaType, validateFileRef, validateClientContext, validateOutputType,
	} = require('../internal/util/validation-util');

/**
 *
 * Supported source file formats for {@link ExportPDFToImagesOperation}.
 * @enum
 * @readonly
 * @memberOf ExportPDFToImagesOperation
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
	 * List of target formats for {@Link ExportPDFToImages}.
	 * @enum
	 * @memberOf ExportPDFToImagesOperation
	 * @readonly
	 */
	SupportedExportFormats = {
		/**
		 * Represents "image/jpeg" media type.

		 * @type {Object}
		 */
		JPEG: ExtensionMediaTypeMapping.jpeg,

		/**
		 * Represents "image/png" media type.
		 * @type {Object}
		 */
		PNG: ExtensionMediaTypeMapping.png
	},
	/**
	 * List of supported outputTypes for {@link ExportPDFToImagesOperation}
	 * @enum
	 * @memberOf ExportPDFToImagesOperation
	 * @readonly
	 */
	OutputType = {
		/**
		 * Represents List Output type
		 * @type {string}
		 */
		LIST_OF_PAGE_IMAGES: 'listOfPageImages',

		/**
		 * Represents Zip Output type
		 * @type {string}
		 */
		ZIP_OF_PAGE_IMAGES: 'zipOfPageImages',
	};

allowedConfiguration = {
	supportedTargetFormats: SupportedExportFormats,

	isValidTargetFormat(targetFormat) {
		return targetFormat && Object.keys(allowedConfiguration.supportedTargetFormats)
			.some(format => this.supportedTargetFormats[format] === targetFormat);
	},

	getSupportedMediaTypes() {
		return Object.values(SupportedSourceFormat);
	},

	getTargetFileExtension(targetExportFormat) {
		switch (targetExportFormat) {
			case this.supportedTargetFormats.JPEG:
				return ExtensionMediaTypeMapping.jpeg.extension;
			case this.supportedTargetFormats.PNG:
				return ExtensionMediaTypeMapping.png.extension;
			default:
				return targetExportFormat.extension;
		}
	},

	getSupportedOutputTypes() {
		return Object.values(OutputType);
	}
};
Object.freeze(SupportedExportFormats);
Object.freeze(SupportedSourceFormat);
Object.freeze(OutputType);
Object.freeze(allowedConfiguration);


/**
 * An operation which exports a source PDF file to a supported format specified by
 * {@link ExportPDFToImagesOperation.SupportedExportFormats}.
 * <p>
 * The result is a list of images. For example, a PDF file with 15
 * pages will generate 15 image files. The first file's name ends with "_0" and the last file's name ends with "_14".
 *
 * Sample Usage:
 * <pre class="prettyprint">
 * <code>
 *  const credentials = PDFServicesSdk.Credentials.servicePrincipalCredentialsBuilder()
 *            .withClientId("PDF_SERVICES_CLIENT_ID")
 *            .withClientSecret("PDF_SERVICES_CLIENT_SECRET")
 *            .build(),
 *        executionContext = PDFServicesSdk.ExecutionContext.create(credentials),
 *        ExportPDFToImages = PDFServicesSdk.ExportPDFToImages,
 *        exportPDFToImages = ExportPDFToImages.Operation.createNew(ExportPDFToImages.SupportedTargetFormats.JPEG),
 *        input = PDFServicesSdk.FileRef.createFromLocalFile('PDF.pdf', ExportPDFToImages.SupportedSourceFormat.pdf);
 *
 *  exportPDFToImages.setInput(input);
 *
 *  exportPDFToImages.execute(executionContext)
 *      .then(result => {
 *           let saveFilesPromises = [];
 *           for(let i = 0; i < result.length; i++){
 *               saveFilesPromises.push(result[i].saveAsFile(`output/exportPDFToJPEGOutput_{i}.jpeg`));
 *           }
 *           return Promise.all(saveFilesPromises);
 *       })
 *      .catch(err => console.log(err));
 * </code>
 * </pre>
 *
 */
class ExportPDFToImagesOperation {
	/**
	 * @hideconstructor
	 * @param targetFormat
	 */
	constructor(targetFormat) {
		this.targetFormat = targetFormat;
		this.sourceFileRef = null;
		this.outputType = OutputType.LIST_OF_PAGE_IMAGES;
		Object.preventExtensions(this);
	}

	static get SupportedExportFormats() {
		return SupportedExportFormats;
	}

	static get SupportedSourceFormat() {
		return SupportedSourceFormat;
	}

	static get OutputType() {
		return OutputType;
	}

	/**
	 * Constructs an {@link ExportPDFToImagesOperation} instance.
	 *
	 * @param {!ExportPDFToImagesOperation.SupportedExportFormats} targetFormat - Format to which the PDF will be exported to.
	 * @returns {ExportPDFToImagesOperation} A new ExportPDFToImagesOperation instance
	 *
	 */
	static createNew(targetFormat) {
		if (!allowedConfiguration.isValidTargetFormat(targetFormat)) {
			throw new Error(`Invalid target format ${targetFormat} provided for export-pdf-to-images operation`);
		}
		return new ExportPDFToImagesOperation(targetFormat);
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
	 * Sets outputType to be used for exporting PDF to Images operation, specified by {@link ExportPDFToImagesOperation.OutputType}.
	 * @param {!ExportPDFToImagesOperation.OutputType} outputType - see {@link ExportPDFToImagesOperation.OutputType}. Default
	 * value is {@link ExportPDFToImagesOperation.OutputType.LIST_OF_PAGE_IMAGES}
	 */
	setOutputType(outputType) {
		this.outputType = outputType;
	}


	/**
	 * Executes this operation using the supplied context and returns a Promise which resolves to the operation result.
	 *
	 * The resultant files may be stored in the system temporary directory (per the os.tempdir(), symlinks are resolved
	 * to the actual path).
	 * See {@link FileRef} for how temporary resources are cleaned up.
	 *
	 * @param {!ExecutionContext} context - The context in which the operation will be executed.
	 * @returns {Promise<FileRef[]>} A promise which resolves to the operation result.
	 * @throws {ServiceApiError} if an API call results in an error response.
	 * @throws {ServiceUsageError} if service usage limits have been reached or credentials quota has been exhausted.
	 */

	execute(context) {
		try {
			this.validate(context);
		} catch (err) {
			return Promise.reject(err);
		}
		logger.info('All validations successfully done. Beginning Export PDF to Images Operation execution');
		const targetFileExtension = this.outputType === OutputType.ZIP_OF_PAGE_IMAGES ?
			ExtensionMediaTypeMapping.zip.extension : allowedConfiguration.getTargetFileExtension(this.targetFormat)
		const targetFileName = getRandomFileNameWithExtension(targetFileExtension),
			operationMessage = new OperationMessage(this.sourceFileRef, targetFileName, DefaultConfig.operationName.exportPdfToImages),
			exportPDFToImagesService = new ExportPDFToImagesService();
		operationMessage.setTargetFormat(this.targetFormat);
		operationMessage.setOptions(this.options);
		operationMessage.setOutputType(this.outputType);
		return exportPDFToImagesService.perform(context, operationMessage)
			.then(res => Promise.resolve(res))
			.catch(err => Promise.reject(err));
	}

	validate(context) {
		validateClientContext(context);
		validateFileRef(this.sourceFileRef);
		validateOutputType(allowedConfiguration.getSupportedOutputTypes(), this.outputType);
		validateAllowedMediaType(allowedConfiguration.getSupportedMediaTypes(), this.sourceFileRef);
	}
}

Object.freeze(ExportPDFToImagesOperation);
module.exports = ExportPDFToImagesOperation;
