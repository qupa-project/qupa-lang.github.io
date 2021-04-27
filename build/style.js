const markdown = require('markdown-it');
const shiki = require('shiki');
const path = require('path');
const fs = require('fs');


module.exports = {
	create: async function() {
		let config = JSON.parse(fs.readFileSync('./syntaxes/index.json', 'utf8'));
		let rel = path.join(__dirname, "../syntaxes/");
		for (let i in config.langs) {
			config.langs[i].path = path.join(rel, config.langs[i].path);
		}

		let highlighter = await shiki.getHighlighter({
			theme: 'monokai',
			langs: config.langs
		});

		let md = markdown({
			html: true,
			highlight: (code, lang) => {
				return highlighter.codeToHtml(code, lang);
			}
		})

		return md;
	}
};