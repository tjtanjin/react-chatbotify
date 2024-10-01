/* eslint-disable no-undef */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';

// Read the file (assuming your file is 'index.js')
const filePath = './dist/index.js';
let fileContent = fs.readFileSync(filePath, 'utf-8');

// Remove the `import 'style.css';` line (assumes it's the first line)
fileContent = fileContent.replace(/import\s+['"]\.\/style\.css['"]\s*;/, '');

const ssrFolder = "./ssr";
const noCssImportFileName = "./ssrValidationIndexNoCssImport.js";
const noCssImportFilePath = `${ssrFolder}/${noCssImportFileName}`;
fs.writeFileSync(noCssImportFilePath, fileContent, 'utf-8');

/**
 * The following SSR validations are executed to ensure that the components
 * are rendered server-side without any errors. Since we're in a Node.js environment,
 * the browser-specific APIs and global objects (for eg. window) are not available and
 * hence the validations are limited to rendering the components and checking for any render errors.
 * ---
 * If the ChatBot and ChatBotProvider components are accessing the `window` object before the 
 * DOM is ready, then the SSR will fail with the following error: `ReferenceError: window is not defined [...]`
*/

// SSR Validation: ChatBot
try {
	const ChatBot = await import(noCssImportFileName).then((mod) => mod.default);
	ReactDOMServer.renderToString(React.createElement(ChatBot));
	console.info('ChatBot: server-side rendering validation passed.');
} catch (error) {
	fs.rmSync(noCssImportFilePath);
	console.error('ChatBot rendered server-side with error.', error);
	throw new Error('ChatBot: server-side rendering validation failed.');
}

// SSR Validation: ChatBotProvider
try {
	const ChatBotProvider = await import(noCssImportFileName).then((mod) => mod.ChatBotProvider);
	ReactDOMServer.renderToString(React.createElement(ChatBotProvider));
	console.info('ChatBotProvider: server-side rendering validation passed.');
} catch (error) {
	fs.rmSync(noCssImportFilePath);
	console.error('ChatBotProvider rendered server-side with error.', error);
	throw new Error('ChatBotProvider: server-side rendering validation failed.');
}

fs.rmSync(noCssImportFilePath);