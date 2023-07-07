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
const Schema = require('validate'),
	CSCCredential = require('./csc-credential'),
	AppearanceOptions = require('./appearance-options'),
	FieldOptions = require('./field-options');

/**
 * Supported signature formats to create electronic seal required for {@link SealOptions}.
 * @enum
 * @memberOf SealOptions
 * @readonly
 */
const SignatureFormat = {

	/**
	 * Represents PKCS7 format
	 * @type {string}
	 */
	PKCS7 : 'PKCS7',

	/**
	 * Represents PADES format
	 * @type {string}
	 */
	PADES : 'PADES'
};
Object.freeze(SignatureFormat);

/**
 * Parameters for specifying the input seal options required for {@link PDFElectronicSealOperation}.
 */
class SealOptions {

	/**
	 *  @hideconstructor
	 *  @param builder
	 */
	constructor(builder) {
		this.signatureFormat = builder.signatureFormat;
		this.certificateCredentials = builder.certificateCredentials;
		this.fieldOptions = builder.fieldOptions;
		this.appearanceOptions = builder.appearanceOptions;
		Object.preventExtensions(this);
	}

	static get SignatureFormat() {
		return SignatureFormat;
	}

	/**
	 * Returns the intended signature format to be used for applying electronic seal.
	 * @return {SignatureFormat} the signature format
	 */
	getSignatureFormat() {
		return this.signatureFormat
	}

	/**
	 * Returns the {@link CertificateCredentials} instance containing information regarding Certificate Credentials.
	 * @return {CertificateCredentials} a {@link CertificateCredentials} instance
	 */
	getCertificateCredentials() {
		return this.certificateCredentials
	}

	/**
	 * Returns the {@link FieldOptions} instance containing information regarding Seal Field Position
	 * in PDF Document.
	 * @return {FieldOptions} a {@link FieldOptions} instance
	 */
	getFieldOptions() {
		return this.fieldOptions
	}

	/**
	 * Returns the {@link AppearanceOptions} instance containing information regarding elements
	 * to be displayed in Seal Field.
	 * @return {AppearanceOptions} a {@link AppearanceOptions} instance
	 */
	getAppearanceOptions() {
		return this.appearanceOptions
	}

	/**
	 * Builds a {@link SealOptions} instance.
	 */
	static get Builder() {

		class SealOptionsBuilder {

			/**
			 * Constructs a {@link SealOptionsBuilder} instance.
			 * @param {!CertificateCredentials} certificateCredentials digital seal credential to be used for applying electronic seal
			 * @param {!FieldOptions} fieldOptions seal field options to be used for applying electronic seal
			 */
			constructor(certificateCredentials, fieldOptions) {
				this.signatureFormat = SignatureFormat.PKCS7;
				this.certificateCredentials = certificateCredentials;
				this.fieldOptions = fieldOptions;
			}

			/**
			 * Sets the signature format.
			 *
			 * @param {SignatureFormat} signatureFormat the signature format to be used for applying electronic seal
			 * @return this Builder instance to add any additional parameters
			 */
			withSignatureFormat(signatureFormat) {
				this.signatureFormat = signatureFormat;
				return this;
			}

			/**
			 * Sets the seal appearance options.
			 *
			 * @param {AppearanceOptions} appearanceOptions the seal appearance options;
			 * @return this Builder instance to add any additional parameters
			 */
			withAppearanceOptions(appearanceOptions) {
				this.appearanceOptions = appearanceOptions;
				return this;
			}

			/**
			 * Returns a new {@link SealOptions} instance built from the current state of this builder.
			 *
			 * @return a new {@link SealOptions} instance
			 */
			build() {
				if (this.appearanceOptions == null) {
					this.appearanceOptions = new AppearanceOptions();
				}
				let sealOptions =  new SealOptions(this);
				Object.freeze(sealOptions);
				return sealOptions;
			}

		}

		return SealOptionsBuilder;
	}

	validate() {
		const validator = new Schema({
			'signatureFormat': {
				type: String,
				enum:Object.values(SignatureFormat),
				message: {
					type: 'Signature format must be a String'
				}
			},
			'certificateCredentials': {
				type: CSCCredential,
				required: true,
				message: {
					type: 'Certificate credentials must be an object of type CertificateCredentials',
					required: 'Certificate credentials cannot be null.'
				}
			},
			'fieldOptions': {
				type: FieldOptions,
				required: true,
				message: {
					type: 'Field options must be an object of type FieldOptions',
					required: 'Field options cannot be null.'
				}
			},
			'appearanceOptions': {
				type: AppearanceOptions,
				message: {
					type: 'Appearance options must be an object of type AppearanceOptions'
				}
			}
		});
		return validator.validate(this);
	}

}

module.exports = SealOptions;
