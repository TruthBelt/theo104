// THEO 104 deck viewer: one deck and one slide at a time; buttons, arrow keys, and swipe.
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var viewer = document.querySelector('.viewer');
  if (!viewer) return;
  var decks = Array.prototype.slice.call(viewer.querySelectorAll('.deck'));
  var picks = Array.prototype.slice.call(document.querySelectorAll('[data-pick]'));
  var prev = document.querySelector('.controls .prev');
  var next = document.querySelector('.controls .next');
  var count = document.querySelector('.controls .count');
  var d = 0, s = 0;

  // Number every slide's footer from its place in the deck.
  decks.forEach(function (deck) {
    var slides = deck.querySelectorAll('.slide');
    Array.prototype.forEach.call(slides, function (slide, i) {
      var n = slide.querySelector('.s-num');
      if (n) n.textContent = (i + 1) + ' / ' + slides.length;
    });
  });

  function show(deckIndex, slideIndex, focus) {
    d = Math.max(0, Math.min(decks.length - 1, deckIndex));
    var slides = decks[d].querySelectorAll('.slide');
    s = Math.max(0, Math.min(slides.length - 1, slideIndex));
    decks.forEach(function (deck, i) { deck.classList.toggle('active', i === d); });
    Array.prototype.forEach.call(slides, function (slide, i) { slide.classList.toggle('active', i === s); });
    picks.forEach(function (b, i) { b.setAttribute('aria-pressed', i === d ? 'true' : 'false'); });
    count.textContent = 'Slide ' + (s + 1) + ' of ' + slides.length;
    prev.disabled = d === 0 && s === 0;
    next.disabled = d === decks.length - 1 && s === slides.length - 1;
    next.textContent = s === slides.length - 1 && d < decks.length - 1 ? 'Next deck →' : 'Next →';
    if (focus) viewer.focus({ preventScroll: true });
  }

  function step(delta) {
    var len = decks[d].querySelectorAll('.slide').length;
    if (delta > 0) {
      if (s < len - 1) show(d, s + 1);
      else if (d < decks.length - 1) show(d + 1, 0);
    } else {
      if (s > 0) show(d, s - 1);
      else if (d > 0) show(d - 1, decks[d - 1].querySelectorAll('.slide').length - 1);
    }
  }

  picks.forEach(function (b, i) {
    b.addEventListener('click', function () {
      show(i, 0);
      if (window.matchMedia('(max-width: 640px)').matches) viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
  });

  var x0 = null, y0 = null;
  viewer.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    x0 = y0 = null;
  });

  var m = /^#deck-(\d+)$/.exec(location.hash);
  show(m ? parseInt(m[1], 10) - 1 : 0, 0);
  // A #deck-n link lands on the deck heading, not wherever the hidden decks left the scroll.
  if (m) setTimeout(function () { document.getElementById('decks-h').scrollIntoView(); }, 0);
})();
