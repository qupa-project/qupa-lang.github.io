require('dotenv').config();


const IngestArticles = require('./ingestArticles.js');
const { resolve } = require('path');
const fs = require('fs');

if (!fs.existsSync('./tag/')) {
	fs.mkdirSync('./tag/');
}
if (!fs.existsSync('./rss/')) {
	fs.mkdirSync('./rss/');
}

let head = fs.readFileSync('./template/head.html');
let header = fs.readFileSync('./template/header.html');
let footer = fs.readFileSync('./template/footer.html');
let bank = IngestArticles();


fs.writeFileSync('./CNAME', process.env.CNAME);



function SortPosts() {
	// Sort all posts
	bank.posts = bank.posts.sort((a, b) => {
		let A = Date.parse(a.date.split('/').reverse().join('-'));
		let B = Date.parse(b.date.split('/').reverse().join('-'));
		return B - A;
	});

	// Sort all tags
	for (let name in bank.tags) {
		bank.tags[name] = bank.tags[name].sort((a,b) => {
			return bank.posts.indexOf(a) - bank.posts.indexOf(b);
		});
	}
}



function BuildArticle(article) {
	// Standard HTML meta
	let meta = `<meta charset="UTF-8">`;
	meta += `<title>${article.title}</title>`;
	meta += `<meta name="description" content="${article.description}">`;
	meta += `<meta name="keywords" content="${article.tags.join(", ")}">`;
	if (article.author) {
		meta += `<meta name="author" content="${article.author}">`;
	}

	// Open Graph
	meta += `<meta property="og:title" content="${article.title}">`;
	meta += `<meta property="og:description" content="${article.description}">`;
	meta += `<meta property="og:type" content="article">`;
	meta += `<meta property="og:url" content="https://${process.env.CNAME}${article.path}">`;
	meta += `<meta property="og:process.env.SITE_NAME" content="${process.env.SITE_NAME}">`;
	meta += `<meta property="og:tag" content="${article.tags.join(", ")}">`;



	// Body
	let body = '<div class="wrapper">';
	body += `<h1>${article.title}</h1>`+article.body;

	if (article.tags.length > 0) {
		body += '<span class="tags"><h6 style="display: inline-block;">Tags:</h6>'
		for (let tag of article.tags){
			body += `<a href="/tag/${tag.toLowerCase()}.html"><tag>${tag};</tag></a>`;
		}
		body += '</span>';
	}

	body += "</div>";
	fs.writeFileSync(
		"."+article.path,
		`<!DOCTYPE html><html><head>${meta}${head}</head><body>${header}${body}${footer}</body></html>`
	);
}
function BuildTagPage(name) {
	let body = '<div class="wrapper">';
	body += '<h2 style="margin-left: 3%;">Tag: '+name+'</h2>';

	for (let entry of bank.tags[name]){
		body += '<article>';

		body += `<div class="meta">`
		body += `<a href="${entry.path}"><h3>${entry.title}</h3></a>`;
		body += `<span class="date">${entry.date}</span>`;
		body += `</div>`
		// body += `<span class="author">${entry.author}</span>`;
		body += `<div class="content"><p>`;
		body += `${entry.description}`;
		body += `</p></div>`;

		body += '<div class="tags">';
		for (let tag of entry.tags){
			body += `<a href="/tag/${tag.toLowerCase()}.html"><tag>${tag};</tag></a>`;
		}
		body += '</div></article>';
	}
	body += `<p><a href="/rss/${name.toLocaleLowerCase()}.rss">Tag specific RSS feed</a></p>`;
	body += '</div>';

	return fs.writeFileSync(
		`./tag/${name.toLocaleLowerCase()}.html`.toLowerCase(),
		`<!DOCTYPE html><html><head>${head}<title>Tag: ${name}</title></head><body>${header}${body}${footer}</body></html>`,
		'utf8'
	);
}


function BuildRSS(tag = "all") {
	let body = "";

	function HTMLEncode(str) {
		return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#'+i.charCodeAt(0)+';';
	 })
	}

	let channel = `<title>${tag}</title>`
		+ `<link>https://${process.env.CNAME}/</link>`
		+ `<lastBuildDate>${Date()}</lastBuildDate>`;

	let set = tag == "all" ? bank.posts : bank.tags[tag];
	for (let post of set) {
		let item = `<title>${HTMLEncode(post.title)}</title>`
			+ `<description>${HTMLEncode(post.description)}</description>`
			+ `<link>https://${process.env.CNAME}${post.path}</link>`
			+ `<pubDate>${post.date}</pubDate>`;

		channel += `<item>${item}</item>`;
	}

	body += `<channel>${channel}</channel>`;
	return fs.writeFileSync(
		`./rss/${tag}.rss`.toLowerCase(),
		`<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>${body}</channel></rss>`,
		'utf8'
	);
}


function BuildSiteMap(bank) {
	fs.writeFileSync(
		resolve('./sitemap.txt'),
		bank.posts.map(x => `https://${process.env.CNAME}${x.path}`)
			.concat( Object.keys(bank.tags).map(x => `https://${process.env.CNAME}/tag/${x.toLocaleLowerCase()}.html`) )
			.join('\n')
	);
}


SortPosts();
for (let article of bank.posts) {
	BuildArticle(article);
}
for (let name in bank.tags) {
	BuildTagPage(name);
}
for (let name in bank.tags) {
	BuildRSS(name);
}
BuildRSS("all");
BuildSiteMap(bank);