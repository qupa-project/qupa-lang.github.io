window.addEventListener('load', ()=>{
	function UpdateScroll(){
		if (document.body.scrollTop / window.innerHeight > 0.2){
			document.body.setAttribute('scrolled', true);
		}else{
			document.body.removeAttribute('scrolled');
		}
	}

	document.body.onscroll = UpdateScroll;
	UpdateScroll();

	let dark = localStorage.getItem("dark-theme") === "true";
	function UpdateTheme() {
		console.log('Dark theme', dark);
		document.body.setAttribute('dark', dark);
	}
	UpdateTheme();

	document.getElementById('Toggle-Dark-Theme').addEventListener('click', ()=>{
		dark = !dark;
		console.log('');
		UpdateTheme();
	});
});