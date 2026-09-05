(function () {
	document.querySelectorAll('.carousel').forEach(function (carousel) {
		var viewport = carousel.querySelector('.carousel-viewport');
		var slides = Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide'));
		var dotsWrap = carousel.querySelector('.carousel-dots');
		var prev = carousel.querySelector('.carousel-prev');
		var next = carousel.querySelector('.carousel-next');
		if (!viewport || slides.length < 2) {
			if (prev) prev.hidden = true;
			if (next) next.hidden = true;
			return;
		}

		var index = 0;

		var dots = slides.map(function (_, i) {
			var dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Slide ' + (i + 1));
			dot.addEventListener('click', function () { goTo(i, true); });
			dotsWrap.appendChild(dot);
			return dot;
		});

		function paint() {
			dots.forEach(function (dot, d) {
				dot.setAttribute('aria-selected', d === index ? 'true' : 'false');
			});
			if (prev) prev.disabled = index === 0;
			if (next) next.disabled = index === slides.length - 1;
		}

		// Move to a slide. `scroll` = drive the scroll position; otherwise we're
		// just syncing state to a scroll the viewer already made.
		function goTo(i, scroll) {
			index = Math.max(0, Math.min(slides.length - 1, i));
			paint();
			if (scroll) {
				var left = index * viewport.clientWidth;
				try { viewport.scrollTo({ left: left, behavior: 'smooth' }); }
				catch (e) { viewport.scrollLeft = left; }
			}
		}

		if (prev) prev.addEventListener('click', function () { goTo(index - 1, true); });
		if (next) next.addEventListener('click', function () { goTo(index + 1, true); });

		carousel.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1, true); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, true); }
		});

		// Sync the dots when the viewer scrolls/swipes the strip themselves.
		var raf;
		viewport.addEventListener('scroll', function () {
			if (raf) return;
			raf = requestAnimationFrame(function () {
				raf = null;
				var w = viewport.clientWidth;
				if (!w) return;
				var i = Math.round(viewport.scrollLeft / w);
				if (i !== index) { index = i; paint(); }
			});
		}, { passive: true });

		window.addEventListener('resize', function () {
			if (viewport.clientWidth) viewport.scrollLeft = index * viewport.clientWidth;
		});

		// Media (video, images, embeds) loading in can shift the scroll position;
		// re-assert the current slide a few times early on.
		function reassert() {
			if (viewport.clientWidth) viewport.scrollLeft = index * viewport.clientWidth;
		}
		reassert();
		requestAnimationFrame(reassert);
		window.addEventListener('load', reassert);
		carousel.querySelectorAll('img').forEach(function (el) {
			if (!el.complete) el.addEventListener('load', reassert, { once: true });
		});
	});
})();
