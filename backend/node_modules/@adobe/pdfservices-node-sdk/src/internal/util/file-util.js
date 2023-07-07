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

const fs = require('fs'),
	FileRef = require("../../io/file-ref"),
	temp = require('temp-dir'),
	path = require('path');

function ensureDirectoryExistence(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true});
	}
}

function writeFile(content, targetFileName) {
	const tempDir = `${temp + path.sep}pdfServicesSdkResult${path.sep}`,
		filePath = tempDir + targetFileName;
	ensureDirectoryExistence(tempDir);
	fs.writeFileSync(filePath, Buffer.from(content));
	fs.chmodSync(filePath, '600');
	return FileRef.createFromLocalFile(filePath);
}

module.exports = {
	writeFile
};
