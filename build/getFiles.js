const { resolve, extname, basename } = require('path');
const fs = require('fs');

function GetFiles(directory, filter = [], ignore = []) {
	let files = [];
	let paths = fs.readdirSync(directory);
	for (let path of paths) {
		path = resolve(directory, path);
		let stats = fs.lstatSync(path);

		if (stats.isFile()) {
			let ext = extname(path);
			if (filter.length == 0 || filter.indexOf(ext) !== -1) {
				files.push(path);
			}
		} else {
			if (ignore.length != 0 && ignore.indexOf( basename(path) ) != -1) {
				continue;
			}

			files = files.concat(GetFiles(path, filter));
		}
	}

	return files;
}

module.exports = GetFiles;