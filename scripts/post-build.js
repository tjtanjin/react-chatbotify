import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// directory names of the current module)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// files to ignore (remove)
const distDir = path.resolve(__dirname, "../dist");
const filesToRemove = [
	path.join(distDir, "App.d.ts"),
	path.join(distDir, "App.d.ts.map"),
	path.join(distDir, "devIndex.d.ts"),
	path.join(distDir, "devIndex.d.ts.map"),
];

// types to copy
const indexDts = path.join(distDir, "index.d.ts");
const indexCts = path.join(distDir, "index.d.cts");

// handles removing of files
const removeFiles = (files) => {
	files.forEach(file => {
		fs.unlink(file, (err) => {
			if (err && err.code !== "ENOENT") {
				console.error(`Error deleting ${file}:`, err);
			} else {
				console.info(`${file} was deleted or does not exist.`);
			}
		});
	});
};

// handles copying of files
const copyIndexDtsToCts = (src, dest) => {
	fs.copyFile(src, dest, (err) => {
		if (err) {
			console.error(`Error copying ${src} to ${dest}:`, err);
		} else {
			console.info(`Copied ${src} to ${dest}`);
		}
	});
};

// run post build actions
removeFiles(filesToRemove);
copyIndexDtsToCts(indexDts, indexCts);
