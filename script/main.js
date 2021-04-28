function UpdateTheme(dark = false) {
	console.log('Dark theme', dark);
	document.body.setAttribute('dark', dark);
}

function JumpTo(anchorStr) {
	let target = document.getElementById(anchorStr);
	if (target) {
		console.log('GOTO', anchorStr);
		window.scrollBy(window.scrollX, target.getBoundingClientRect().top -20);
	} else {
		console.error('Invalid GOTO', anchorStr);
	}
}

function UpdateScroll(){
	if (document.body.scrollTop / window.innerHeight > 0.2){
		document.body.setAttribute('scrolled', true);
	}else{
		document.body.removeAttribute('scrolled');
	}
}

function SetupPage() {
	document.body.onscroll = UpdateScroll;
	UpdateScroll();

	document.getElementById('Toggle-Dark-Theme').addEventListener('click', ()=>{
		let dark = localStorage.getItem("dark-theme") !== "true";
		localStorage.setItem('dark-theme', dark.toString());
		UpdateTheme(dark);
	});

	// Goto specified anchor
	if (window.location.hash.length > 1) {
		JumpTo(window.location.hash.slice(1).toLowerCase());
	}

	// Bind anchors
	let root = window.location.origin + window.location.pathname;
	let jumps = [...document.getElementsByTagName('a')].filter(x=>x.href.slice(0, root.length) == root);
	for (let jump of jumps) {
		jump.addEventListener('click', (evt) => {
			let url = new URL(jump.href);
			JumpTo(url.hash.slice(1).toLowerCase());
		});
	}

	// Bind anchor sets
	let headers = [
		...document.getElementsByTagName('h1'),
		...document.getElementsByTagName('h2')
	];
	for (let head of headers) {
		head.addEventListener('click', (evt)=>{
			window.location.hash = `#${evt.target.id}`;
		});
	}


	let iframes = [...document.getElementsByTagName('iframe')]
		.filter(x => x.getAttribute('fit') !== null);
	console.log(iframes);
	for (let iframe of iframes) {
		if (iframe.contentWindow && iframe.contentWindow.document) {
			iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
			iframe.style.width = '100%';
		}
	}
}

window.addEventListener('load', ()=>{
	UpdateTheme(localStorage.getItem("dark-theme") === "true");

	const urlParams = new URLSearchParams(window.location.search);
	const isEmbeded = urlParams.get('embed') !== null;


	if (isEmbeded) {
		document.body.setAttribute('embed', 'true');
	} else {
		SetupPage();
	}
});