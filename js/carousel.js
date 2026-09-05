(function () {
	document.querySelectorAll('.carousel').forEach(function (carousel) {
		var viewport = carousel.querySelector('.carousel-viewport');
		var track = carousel.querySelector('.carousel-track');
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

		// Scroll offset that lines slide i up with the left edge of the strip.
		// Works whether every slide is the same width or each one differs.
		function offsetOf(i) {
			return slides[i].offsetLeft - slides[0].offsetLeft;
		}

		function maxLeft() {
			return Math.max(0, track.scrollWidth - viewport.clientWidth);
		}

		function nearestIndex() {
			var x = viewport.scrollLeft, best = 0, bestD = Infinity;
			for (var i = 0; i < slides.length; i++) {
				var d = Math.abs(offsetOf(i) - x);
				if (d < bestD) { bestD = d; best = i; }
			}
			return best;
		}

		function paint() {
			dots.forEach(function (dot, d) {
				dot.setAttribute('aria-selected', d === index ? 'true' : 'false');
			});
			// Disable an arrow only when the strip is actually at that end, so it
			// still works while the last few slides share one view.
			if (prev) prev.disabled = viewport.scrollLeft <= 1;
			if (next) next.disabled = viewport.scrollLeft >= maxLeft() - 1;
		}

		// Move to a slide. `scroll` = drive the scroll position; otherwise we're
		// just syncing state to a scroll the viewer already made.
		function goTo(i, scroll) {
			index = Math.max(0, Math.min(slides.length - 1, i));
			if (scroll) {
				var left = Math.min(offsetOf(index), maxLeft());
				try { viewport.scrollTo({ left: left, behavior: 'smooth' }); }
				catch (e) { viewport.scrollLeft = left; }
			}
			paint();
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
				index = nearestIndex();
				paint();
			});
		}, { passive: true });

		// Media (video, images, embeds) loading in can shift the layout;
		// re-assert the current slide a few times early on.
		function reassert() {
			viewport.scrollLeft = Math.min(offsetOf(index), maxLeft());
			paint();
		}
		window.addEventListener('resize', reassert);
		reassert();
		requestAnimationFrame(reassert);
		window.addEventListener('load', reassert);
		carousel.querySelectorAll('img').forEach(function (el) {
			if (!el.complete) el.addEventListener('load', reassert, { once: true });
		});
		carousel.querySelectorAll('video').forEach(function (el) {
			el.addEventListener('loadedmetadata', reassert, { once: true });
		});
	});
})();
