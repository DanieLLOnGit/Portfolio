(function () {
	if (!('IntersectionObserver' in window)) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var groups = [
		{ grid: document.getElementById('project-grid'), items: '.card' },
		{ grid: document.querySelector('.skill-grid'), items: '.skill-col' },
		{ grid: document.querySelector('.exp-list'), items: '.exp-item' }
	];

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('in-view');
				io.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -12% 0px' });

	groups.forEach(function (group) {
		if (!group.grid) return;
		group.grid.classList.add('is-revealing');
		group.grid.querySelectorAll(group.items).forEach(function (el, i) {
			el.style.transitionDelay = (i % 3) * 80 + 'ms';
			io.observe(el);
		});
	});

	// Project page: two columns slide in from opposite sides; shots fade up.
	var pcols = document.querySelector('.project-cols');
	if (pcols) {
		pcols.classList.add('is-revealing');
		io.observe(pcols);
	}
	document.querySelectorAll('.project-shot, .carousel').forEach(function (el) {
		el.classList.add('is-revealing');
		io.observe(el);
	});

	// About section: text slides in from the left, photo from the right.
	// Its own observer with a deeper margin so it fires once you've scrolled to it,
	// not when the heading first peeks past a tall hero.
	var about = document.querySelector('.about-inner');
	if (about) {
		about.classList.add('is-revealing');
		var aboutIO = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					aboutIO.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -32% 0px' });
		aboutIO.observe(about);
	}
})();
