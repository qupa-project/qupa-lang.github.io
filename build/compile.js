const IngestArticles = require('./ingestArticles.js');
const fs = require('fs');


if (!fs.existsSync('./tag/')) {
	fs.mkdirSync('./tag/');
}

let head = fs.readFileSync('./template/head.html');
let header = fs.readFileSync('./template/header.html');
let footer = fs.readFileSync('./template/footer.html');
let bank = IngestArticles();


function BuildArticle(article) {
	let body = '<div class="wrapper">';
	body += `<h1>${article.title}</h1>`+article.body;

	body += '<span class="tags"><h6 style="display: inline-block;">Tags:</h6>'
	for (let tag of article.tags){
		body += `<a href="/tag/${tag}.html"><tag>${tag};</tag></a>`;
	}
	body += '</span>';

	body += "</div>";
	fs.writeFileSync(
		"."+article.path,
		`<head>${head}<title>Tag: ${article.title}</title></head><body>${header}${body}${footer}</body>`
	);
}
function BuildTagPage(name) {
	let body = '<div class="wrapper">';
	body += '<h2 style="margin-left: 3%;">Tag: '+name+'</h2>';

	bank.tags[name] = bank.tags[name].sort((a,b) => {
		let A = Date.parse(bank.posts[a].date.split('/').reverse().join('-'));
		let B = Date.parse(bank.posts[b].date.split('/').reverse().join('-'));
		return B - A;
	});

	for (let id of bank.tags[name]){
		let entry = bank.posts[id];
		body += '<article>';

		body += `<div class="meta">`
		body += `<a href="${entry.path}"><h3>${entry.title}</h3></a>`;
		body += `<span class="date">${entry.date}</span>`;
		body += `</div>`
		// body += `<span class="author">${entry.author}</span>`;
		body += `<div class="content">`;
		body += `${entry.description}`;
		body += `</div>`;

		body += '<div class="tags">'
		for (let tag of entry.tags){
			body += `<a href="/tag/${tag.toLowerCase()}.html"><tag>${tag};</tag></a>`;
		}
		body += '</div></article>';
	}
	body += '</div>';

	return fs.writeFileSync(
		`./tag/${name}.html`.toLowerCase(),
		`<head>${head}<title>Tag: ${name}</title></head><body>${header}${body}${footer}</body>`,
		'utf8'
	);
}


for (let article of bank.posts) {
	BuildArticle(article);
}
for (let name in bank.tags) {
	BuildTagPage(name);
}