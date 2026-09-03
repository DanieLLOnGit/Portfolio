(function () {
	var grid = document.getElementById('project-grid');
	if (!grid || !('IntersectionObserver' in window)) return;

	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (reduce.matches) return;

	grid.classList.add('is-revealing');
	var cards = grid.querySelectorAll('.card');

	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				entry.target.classList.add('in-view');
				io.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px -12% 0px' });

	cards.forEach(function (card, i) {
		card.style.transitionDelay = (i % 2) * 80 + 'ms';
		io.observe(card);
	});
})();
