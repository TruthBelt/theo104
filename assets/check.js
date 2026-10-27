/* Check Yourself: one deck's question set at a time. Choose an answer: a wrong one is struck and the
   question stays open; the right one, or "Show answer," closes it and opens the explanation. Nothing is saved. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-set]'));
  var sets = Array.prototype.slice.call(document.querySelectorAll('.ck-set'));
  var bar = document.querySelector('.ck-tabs');
  if (!tabs.length || !sets.length) return;

  function show(id, scroll) {
    sets.forEach(function (s) { s.classList.toggle('active', s.id === id); });
    tabs.forEach(function (b) {
      var on = b.getAttribute('data-set') === id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    if (scroll) bar.scrollIntoView({ block: 'start' });
  }

  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { show(b.getAttribute('data-set'), bar.getBoundingClientRect().top < 0); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); show(n.getAttribute('data-set'), false);
    });
  });
  document.querySelectorAll('[data-ck-goto]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(a.getAttribute('data-ck-goto'), true); });
  });

  function close(q) {
    q.classList.add('done');
    q.querySelectorAll('.ck-opt').forEach(function (o) {
      o.setAttribute('aria-disabled', 'true');
      if (o.hasAttribute('data-ok')) o.classList.add('right');
    });
    q.querySelector('.ck-ans').open = true;
  }

  document.querySelectorAll('.ck-q').forEach(function (q) {
    var fb = q.querySelector('.ck-fb');
    q.querySelectorAll('.ck-opt').forEach(function (o) {
      o.addEventListener('click', function () {
        if (o.getAttribute('aria-disabled') === 'true') return;
        if (o.hasAttribute('data-ok')) { fb.textContent = 'Correct.'; close(q); }
        else { o.classList.add('wrong'); o.setAttribute('aria-disabled', 'true'); fb.textContent = 'Not quite. Try again, or show the answer.'; }
      });
    });
    q.querySelector('.ck-ans').addEventListener('toggle', function () {
      if (this.open && !q.classList.contains('done')) { fb.textContent = ''; close(q); }
    });
  });

  show(sets[0].id, false);
})();
