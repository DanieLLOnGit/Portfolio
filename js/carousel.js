(function () {
	document.querySelectorAll('.carousel').forEach(function (carousel) {
		var track = carousel.querySelector('.carousel-track');
		var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
		var dotsWrap = carousel.querySelector('.carousel-dots');
		var prev = carousel.querySelector('.carousel-prev');
		var next = carousel.querySelector('.carousel-next');
		if (slides.length < 2) {
			if (prev) prev.hidden = true;
			if (next) next.hidden = true;
			return;
		}

		var index = 0;

		var dots = slides.map(function (_, i) {
			var dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Photo ' + (i + 1));
			dot.addEventListener('click', function () { go(i); });
			dotsWrap.appendChild(dot);
			return dot;
		});

		function render() {
			track.style.transform = 'translateX(' + (-index * 100) + '%)';
			dots.forEach(function (dot, i) {
				dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
			});
		}

		function go(i) {
			index = (i + slides.length) % slides.length;
			render();
		}

		prev.addEventListener('click', function () { go(index - 1); });
		next.addEventListener('click', function () { go(index + 1); });

		carousel.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
		});

		// Swipe on touch devices
		var startX = null;
		track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
		track.addEventListener('touchend', function (e) {
			if (startX === null) return;
			var dx = e.changedTouches[0].clientX - startX;
			if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
			startX = null;
		});

		render();
	});
})();
