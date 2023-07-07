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

const Schema = require('validate');

/**
 * List of supported locales for {@link ExportPDFOperation}
 * @enum
 * @memberOf ExportPDFOptions
 * @readonly
 */

const OCRSupportedLocale = {
	/**
	 * Represents "Danish (Denmark)" locale
	 * @type {string}
	 */
	DA_DK: 'da-DK',
	/**
	 * Represents "Lithuanian (Lithuania)" locale
	 * @type {string}
	 */
	LT_LT: 'lt-LT',
	/**
	 * Represents "Slovenian (Slovenia)" locale
	 * @type {string}
	 */
	SL_SI: 'sl-SI',
	/**
	 * Represents "Greek (Greece)" locale
	 * @type {string}
	 */
	EL_GR: 'el-GR',
	/**
	 * Represents "Russian (Russia)" locale
	 * @type {string}
	 */
	RU_RU: 'ru-RU',
	/**
	 * Represents "English (United States)" locale
	 * @type {string}
	 */
	EN_US: 'en-US',
	/**
	 * Represents "Hungarian (Hungary)" locale
	 * @type {string}
	 */
	HU_HU: 'hu-HU',
	/**
	 * Represents "Estonian (Estonia)" locale
	 * @type {string}
	 */
	ET_EE: 'et-EE',
	/**
	 * Represents "Portuguese (Brazil)" locale
	 * @type {string}
	 */
	PT_BR: 'pt-BR',
	/**
	 * Represents "Ukrainian (Ukraine)" locale
	 * @type {string}
	 */
	UK_UA: 'uk-UA',
	/**
	 * Represents "Norwegian (Norway)" locale
	 * @type {string}
	 */
	NB_NO: 'nb-NO',
	/**
	 * Represents "Polish (Poland)" locale
	 * @type {string}
	 */
	PL_PL: 'pl-PL',
	/**
	 * Represents "Latvian (Latvia)" locale
	 * @type {string}
	 */
	LV_LV: 'lv-LV',
	/**
	 * Represents "Finnish (Finland)" locale
	 * @type {string}
	 */
	FI_FI: 'fi-FI',
	/**
	 * Represents "Japanese (Japan)" locale
	 * @type {string}
	 */
	JA_JP: 'ja-JP',
	/**
	 * Represents "Spanish (Spain)" locale
	 * @type {string}
	 */
	ES_ES: 'es-ES',
	/**
	 * Represents "Bulgarian (Bulgaria)" locale
	 * @type {string}
	 */
	BG_BG: 'bg-BG',
	/**
	 * Represents "English (United Kingdom)" locale
	 * @type {string}
	 */
	EN_GB: 'en-GB',
	/**
	 * Represents "Czech (Czech Republic)" locale
	 * @type {string}
	 */
	CS_CZ: 'cs-CZ',
	/**
	 * Represents "Maltese (Malta)" locale
	 * @type {string}
	 */
	MT_MT: 'mt-MT',
	/**
	 * Represents "German (Germany)" locale
	 * @type {string}
	 */
	DE_DE: 'de-DE',
	/**
	 * Represents "Croatian (Croatia)" locale
	 * @type {string}
	 */
	HR_HR: 'hr-HR',
	/**
	 * Represents "Slovak (Slovakia)" locale
	 * @type {string}
	 */
	SK_SK: 'sk-SK',
	/**
	 * Represents "Serbian (Serbia)" locale
	 * @type {string}
	 */
	SR_SR: 'sr-SR',
	/**
	 * Represents "Catalan (Canada)" locale
	 * @type {string}
	 */
	CA_CA: 'ca-CA',
	/**
	 * Represents "Macedonian (Macedonia)" locale
	 * @type {string}
	 */
	MK_MK: 'mk-MK',
	/**
	 * Represents "Korean (Korea)" locale
	 * @type {string}
	 */
	KO_KR: 'ko-KR',
	/**
	 * Represents "German (Switzerland)" locale
	 * @type {string}
	 */
	DE_CH: 'de-CH',
	/**
	 * Represents "Dutch (Netherlands)" locale
	 * @type {string}
	 */
	NL_NL: 'nl-NL',
	/**
	 * Represents "Chinese (China)" locale
	 * @type {string}
	 */
	ZH_CN: 'zh-CN',
	/**
	 * Represents "Swedish (Sweden)" locale
	 * @type {string}
	 */
	SV_SE: 'sv-SE',
	/**
	 * Represents "Italian (Italy)" locale
	 * @type {string}
	 */
	IT_IT: 'it-IT',
	/**
	 * Represents "Turkish (Turkey)" locale
	 * @type {string}
	 */
	TR_TR: 'tr-TR',
	/**
	 * Represents "French (France)" locale
	 * @type {string}
	 */
	FR_FR: 'fr-FR',
	/**
	 * Represents "Romanian (Romania)" locale
	 * @type {string}
	 */
	RO_RO: 'ro-RO',
	/**
	 * Represents "Hebrew (Israel)" locale
	 * @type {string}
	 */
	IW_IL: 'iw-IL',
	/**
	 * Represents "European Portuguese" locale
	 * @type {string}
	 */
	PT_PT: 'pt-PT',
	/**
	 * Represents "Norwegian Nynorsk (Norway)" locale
	 * @type {string}
	 */
	NN_NO: 'nn-NO',
	/**
	 * Represents "Basque (Spain)" locale
	 * @type {string}
	 */
	EU_ES: 'eu-ES',
	/**
	 * Represents "Galician (Spain)" locale
	 * @type {string}
	 */
	GL_ES: 'gl-ES',
	/**
	 * Represents "Chinese (traditional)" locale
	 * @type {string}
	 */
	ZH_HANT: 'zh-Hant',
};

Object.freeze(OCRSupportedLocale);

/**
 * Parameters for exporting a source PDF file to a supported format using {@link ExportPDFOperation}.
 */
class ExportPDFOptions {
	/**
	 * Constructs a {@link ExportPDFOptions} instance.
	 *
	 * @param {!ExportPDFOptions.OCRSupportedLocale} ocrLang - see {@link ExportPDFOptions.OCRSupportedLocale}. Default
	 * value is {@link ExportPDFOptions.OCRSupportedLocale.EN_US}
	 *
	 */
	constructor(ocrLang) {
		if (!ocrLang) throw new Error("ocrLang cannot be null");
		this.ocrLang = ocrLang;
		Object.preventExtensions(this);
	}

	static get OCRSupportedLocale() {
		return OCRSupportedLocale;
	}

	validate() {
		const validator = new Schema({
			'ocrLang': {
				type: String,
				required: true,
				enum: Object.values(OCRSupportedLocale),
				message: {
					type: 'ocrLang must be a string',
				}
			}

		});
		return validator.validate(this);
	}
}


module.exports = ExportPDFOptions;
