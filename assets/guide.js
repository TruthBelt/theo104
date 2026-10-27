/* Essay guide tabs: one part shown at a time. Without script, every part shows in order. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-part]'));
  var parts = Array.prototype.slice.call(document.querySelectorAll('.part'));
  var bar = document.querySelector('.part-tabs');
  if (!tabs.length || !parts.length) return;

  function show(id, scroll, mark) {
    if (!document.getElementById(id) || !document.getElementById(id).classList.contains('part')) id = parts[0].id;
    parts.forEach(function (p) { p.classList.toggle('active', p.id === id); });
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-part') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    if (mark && history.replaceState) history.replaceState(null, '', '#' + id);
    if (scroll && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: 'start' });
  }

  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { show(b.getAttribute('data-part'), true, true); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); show(n.getAttribute('data-part'), false, true);
    });
  });
  document.querySelectorAll('[data-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(a.getAttribute('data-goto'), true, true); bar.scrollIntoView({ block: 'start' }); });
  });

  show((location.hash || '').slice(1), false, false);
})();
