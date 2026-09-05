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
		// Once the viewer interacts, stop auto-pinning to the first slide.
		var settled = false;

		var dots = slides.map(function (_, i) {
			var dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Slide ' + (i + 1));
			dot.addEventListener('click', function () { scrollToSlide(i); });
			dotsWrap.appendChild(dot);
			return dot;
		});

		function setActive(i) {
			index = Math.max(0, Math.min(slides.length - 1, i));
			dots.forEach(function (dot, d) {
				dot.setAttribute('aria-selected', d === index ? 'true' : 'false');
			});
			if (prev) prev.disabled = index === 0;
			if (next) next.disabled = index === slides.length - 1;
		}

		function scrollToSlide(i) {
			settled = true;
			var target = Math.max(0, Math.min(slides.length - 1, i));
			viewport.scrollTo({ left: target * viewport.clientWidth, behavior: 'smooth' });
		}

		if (prev) prev.addEventListener('click', function () { scrollToSlide(index - 1); });
		if (next) next.addEventListener('click', function () { scrollToSlide(index + 1); });

		carousel.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToSlide(index - 1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); scrollToSlide(index + 1); }
		});

		viewport.addEventListener('pointerdown', function () { settled = true; }, { once: true });
		viewport.addEventListener('wheel', function () { settled = true; }, { once: true, passive: true });

		var raf;
		viewport.addEventListener('scroll', function () {
			if (raf) return;
			raf = requestAnimationFrame(function () {
				raf = null;
				setActive(Math.round(viewport.scrollLeft / viewport.clientWidth));
			});
		}, { passive: true });

		window.addEventListener('resize', function () {
			viewport.scrollLeft = index * viewport.clientWidth;
		});

		// Media (images, YouTube/Drive iframes, video) can nudge the scroll
		// position as it loads; hold at slide 1 until it settles or the viewer acts.
		function pinToStart() {
			if (settled) return;
			viewport.scrollLeft = 0;
			setActive(0);
		}
		pinToStart();
		requestAnimationFrame(pinToStart);
		window.addEventListener('load', pinToStart);
		carousel.querySelectorAll('img, iframe').forEach(function (el) {
			el.addEventListener('load', pinToStart);
		});
		carousel.querySelectorAll('video').forEach(function (el) {
			el.addEventListener('loadedmetadata', pinToStart);
		});
		setTimeout(function () { settled = true; }, 1500);
	});
})();
