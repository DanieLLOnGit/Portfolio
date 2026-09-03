(function () {
	if (!('IntersectionObserver' in window)) return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var groups = [
		{ grid: document.getElementById('project-grid'), items: '.card' },
		{ grid: document.querySelector('.skill-grid'), items: '.skill-col' }
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
})();
