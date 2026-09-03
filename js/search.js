(function () {
	var ITEMS = [
		{ label: 'About', keywords: 'about intro bio columbia electrical engineering', href: '#about' },
		{ label: 'Work', keywords: 'work projects portfolio', href: '#work' },
		{ label: 'Writing', keywords: 'writing posts blog articles', href: '#writing' },
		{ label: 'Contact', keywords: 'contact email phone resume get in touch', href: '#contact' }
	];

	var trigger = document.getElementById('search-trigger');
	var overlay = document.getElementById('search-overlay');
	var input = document.getElementById('search-input');
	var results = document.getElementById('search-results');
	var activeIndex = 0;

	function render(query) {
		var q = query.trim().toLowerCase();
		var matches = ITEMS.filter(function (it) {
			return !q || it.label.toLowerCase().indexOf(q) !== -1 || it.keywords.indexOf(q) !== -1;
		});
		activeIndex = 0;
		results.innerHTML = '';
		matches.forEach(function (it, i) {
			var li = document.createElement('li');
			li.textContent = it.label;
			li.dataset.href = it.href;
			if (i === 0) li.classList.add('is-active');
			li.addEventListener('click', function () { go(it.href); });
			results.appendChild(li);
		});
	}

	function setActive(delta) {
		var items = results.querySelectorAll('li');
		if (!items.length) return;
		items[activeIndex].classList.remove('is-active');
		activeIndex = (activeIndex + delta + items.length) % items.length;
		items[activeIndex].classList.add('is-active');
		items[activeIndex].scrollIntoView({ block: 'nearest' });
	}

	function go(href) {
		close();
		var el = document.querySelector(href);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}

	function open() {
		overlay.hidden = false;
		input.value = '';
		render('');
		input.focus();
	}

	function close() {
		overlay.hidden = true;
		trigger.focus();
	}

	trigger.addEventListener('click', open);

	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) close();
	});

	input.addEventListener('input', function () { render(input.value); });

	input.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowDown') { e.preventDefault(); setActive(1); }
		else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(-1); }
		else if (e.key === 'Enter') {
			e.preventDefault();
			var active = results.querySelector('li.is-active');
			if (active) go(active.dataset.href);
		} else if (e.key === 'Escape') { close(); }
	});

	document.addEventListener('keydown', function (e) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			overlay.hidden ? open() : close();
		}
	});
})();
