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

const ServiceApiError = require('../../error/service-api-error'),
	ServiceUsageError = require('../../error/service-usage-error'),
	http = require('http'),
	https = require('https'),
	zlib = require('zlib'),
	_ = require('lodash/core'),
	Url = require('url'),
	DefaultHeaders = require('./default-dc-request-options'),
	logger = require('./../logger'),
	specialHttpErrorCodes = require('./../config/dc-services-default-config').specialHttpErrorCodes,
	apiGatewayErrorCodes = require('./../config/dc-services-default-config').apiGatewayErrorCodes,
	imsErrorCodes = require('./../config/dc-services-default-config').imsErrorCodes,
	awsSpecificGenericErrorMessage = require('../config/dc-services-default-config').awsSpecificGenericErrorMessage,
	xml2js = require('xml2js');

const CONTENT_TYPE_HEADER_NAME = "content-type";
const APPLICATION_XML_HEADER_VALUE = "application/xml";

// IMS error handling specific constants
const IMS_CERTIFICATE_EXPIRY_ERROR_DESCRIPTION_STRING = 'Could not match JWT signature to any of the bindings';

function rejectWithServiceApiError(requestOptions, promiseReject, httpResponse) {
	if (requestOptions.authenticate === true) {
		promiseReject(new ServiceApiError(
			specialHttpErrorCodes[httpResponse.status],
			requestOptions.headers[DefaultHeaders.DC_REQUEST_ID_HEADER_KEY], httpResponse.status
		));
	}
	promiseReject(new ServiceApiError(
		specialHttpErrorCodes[httpResponse.status],
		requestOptions.headers[DefaultHeaders.SESSION_TOKEN_REQUEST_ID_HEADER_KEY], httpResponse.status
	));
}

function handleJsonResponse(result, reject, options) {

	try {
		result.content = JSON.parse(result.content);

		if (result.content.error) {//for checking platform related errors of wrong credentials.
			result.content.message = result.content.error.message;
		} else
			// Merging different types of possible error message fields into a single one
			result.content.message = result.content.message || result.content.title;

	} catch (e) {
		rejectWithServiceApiError(options, reject, result);
	}
}

function getErrorMappingMessages(result) {
	let apiGatewaySubErrorCodesForStatus = apiGatewayErrorCodes[result.status];
	/* additional PAPI handling (for result.content.error.details.error_code)
	{
		"error": {
			"code": "<code>",
			"message": "<message>",
			"details": {
				"error_code": "429001/429002"
				}
    	}
	}
	*/
	let imsErrorCode = imsErrorCodes[result.status];
	if (imsErrorCode && imsErrorCode[result.content.error]) {
		return getIMSError(imsErrorCode[result.content.error], result);
	} else if (apiGatewaySubErrorCodesForStatus &&
		((result.content.error_code && apiGatewaySubErrorCodesForStatus[result.content.error_code])
			|| (result.content.error?.details?.error_code && apiGatewaySubErrorCodesForStatus[result.content.error.details.error_code]))) {
		return apiGatewaySubErrorCodesForStatus[result.content.error_code].errorMessage;
	}
}

function getIMSError(errorSubCode, result) {
	if (errorSubCode) {
		// Special handling for invalid token and certificate expiry cases from IMS (status code 400)
		if (result.status === 400) {
			if (result.content.error_description === IMS_CERTIFICATE_EXPIRY_ERROR_DESCRIPTION_STRING) {
				return errorSubCode.imsCertificateExpiredErrorMessage;
			} else {
				return errorSubCode.imsInvalidTokenGenericErrorMessage
			}
		}
	}
}

function handleErrorResponse(result, options, reject) {
	if (result.headers[CONTENT_TYPE_HEADER_NAME] === APPLICATION_XML_HEADER_VALUE) {
		handleXMLErrorResponse(result, reject);
	} else {
		handleServiceJsonErrorResponse(result, options, reject);
	}
}

function handleServiceJsonErrorResponse(result, options, reject) {
	handleJsonResponse(result, reject, options);
	let customErrorMessage = getErrorMappingMessages(result);

	// for handling different error response structure from gateway and platform api
	let errorCode = result.content?.error?.code || result.content?.error_code ;

	// Reject with ServiceUsageError for Service Usage Errors with status code 429
	if (result.status == 429) {
		reject(new ServiceUsageError(
			customErrorMessage || result.content.message,
			result.headers[DefaultHeaders.DC_REQUEST_ID_HEADER_KEY], result.status, errorCode
		));
	}
	reject(
		new ServiceApiError(
			customErrorMessage || result.content.error_description || result.content.message,
			result.headers[DefaultHeaders.SESSION_TOKEN_REQUEST_ID_HEADER_KEY]
			|| result.headers[DefaultHeaders.DC_REQUEST_ID_HEADER_KEY],
			result.status, errorCode || result.content?.error
		));
}

function handleXMLErrorResponse(response, reject) {
	/*
		<?xml version="1.0" encoding="UTF-8"?>
			<Error>
				<Code>Error Code</Code>
				<Message>Error Message</Message>
				<AWSAccessKeyId>Access Key</AWSAccessKeyId>
				<StringToSign>String</StringToSign>
				<SignatureProvided>Signature</SignatureProvided>
				<StringToSignBytes>String</StringToSignBytes>
				<CanonicalRequest> Request Body</CanonicalRequest>
				<CanonicalRequestBytes>Request Bytes</CanonicalRequestBytes>
				<RequestId>Request ID</RequestId>
				<HostId>Host ID</HostId>
			</Error>
		 */
	const requestId = response.headers['x-amz-request-id'];
	const statusCode = response.status;
	xml2js.parseString(response.content, (err, result) => {
		if (err) {
			throw new ServiceApiError(awsSpecificGenericErrorMessage, requestId, 500, null);
		}
		const error = result.Error;
		reject(new ServiceApiError(error.Message, requestId, statusCode, error.Code));
	});
}

function isTextContentType(type) {
	return (/^text\/|json;|json$|xml;|xml$|svg;|svg$/).test(type);
}

function onData(chunk, ary) {
	if (chunk) {
		ary.push(chunk);
	}
	return ary;
}

function onEnd(chunk, res, ary, options, fulfill, reject) {
	if (chunk) {
		ary.push(chunk);
	}
	const resType = res.headers['content-type'],
		result = {
			status: res.statusCode,
			statusText: res.statusText || res.statusCode,
			headers: res.headers,
			content: isTextContentType(resType) ?
				ary.join('') :
				(ary.length === 1 ? ary[0] : Buffer.concat(ary))
		};

	if (specialHttpErrorCodes[result.status]) {
		rejectWithServiceApiError(options, reject, result);
	}

	// Allow 401 status response to resolve for request retry
	if (result.status >= 400 && result.status != 401) {
		handleErrorResponse(result, options, reject);
	} else {
		fulfill(result);
	}
	fulfill(result);
}

function createHttpRequest(options, fulfill, reject) {

	let res;
	let ary = [],
		httpLib = options.protocol === 'http:' ? http : https;
	return httpLib.request(options, response => {
		res = response;
		// response_content_open is set to true for download file cases
		if (options.response_content_open) {
			if (res.statusCode >= 400) {
				res.on('data', function (chunk) {
					ary = onData(chunk, ary);
				});
				res.on('end', function (chunk) {
					onEnd(chunk, res, ary, options, fulfill, reject);
				});
			} else {
				fulfill(response);
			}
		} else if (/gzip/.test(res.headers['content-encoding'])) {
			const gunzip = zlib.createGunzip();
			res.pipe(gunzip);
			gunzip.on('data', data => {
				ary.push(data.toString());
			})
				.on('end', function (chunk) {
					onEnd(chunk, res, ary, options, fulfill, reject);
				});
		} else {
			res.on('data', function (chunk) {
				ary = onData(chunk, ary);
			});
			res.on('end', function (chunk) {
				onEnd(chunk, res, ary, options, fulfill, reject);
			});
		}
	});
}

function onError(err, reject) {
	logger.error(`Unexpected Error, request could not be completed ${err}`);
	reject(new Error(`Unexpected error encountered while executing request ${err}`));
}

module.exports = {
	http: {
		getHeader(map, name) {
			if (!map || !name) {
				return null;
			}
			const result = map[name];
			return result !== undefined ? result : map[String(name)
				.toLowerCase()];
		},
		getRequestId(options) {
			return options[DefaultHeaders.DC_REQUEST_ID_HEADER_KEY] ||
				options[DefaultHeaders.SESSION_TOKEN_REQUEST_ID_HEADER_KEY];
		},
		call(requestParams, content) {
			const self = this,
				url = requestParams.uri,
				options = _.extend(requestParams || {}, Url.parse(url));
			return new Promise((fulfill, reject) => {
				const req = createHttpRequest(options, fulfill, reject);
				req.setTimeout(options.readTimeout);
				req.on('error', function (error) {
					onError(error, reject);
				});
				req.on('timeout', () => {
					req.destroy();
					reject(new ServiceApiError(
						`request timed out, ${options.timeout / 1000} seconds expired`,
						self.getRequestId(options), null
					));
				});
				if (content) {
					req.write(content);
				}
				req.end();
			});
		}
	}
};
