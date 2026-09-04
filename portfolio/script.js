/* ═══════════════════════════════════════════════════════════════════════
   Yeasin Arafat — portfolio
   No dependencies. Every feature degrades to working HTML without JS.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Flag that JS is live. The reveal styles are scoped to `.js` so that if this
     script never runs, nothing is left stuck at opacity 0. */
  root.classList.add('js');

  /* ── theme ──────────────────────────────────────────────────────────
     The resolved theme is already on <html> from the inline head script;
     here we only wire up the toggle and sync its label. */

  const toggle = document.querySelector('.theme-toggle');
  const stateLabel = document.querySelector('[data-theme-state]');

  function paintToggle(theme) {
    if (stateLabel) stateLabel.textContent = theme;
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'light'));
      toggle.setAttribute('title', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    }
  }

  paintToggle(root.getAttribute('data-theme') || 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      paintToggle(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    });
  }

  /* Follow the OS only while the visitor hasn't made an explicit choice. */
  let hasStoredChoice = false;
  try { hasStoredChoice = Boolean(localStorage.getItem('theme')); } catch (e) { /* ignore */ }

  if (!hasStoredChoice) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      const next = e.matches ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      paintToggle(next);
    });
  }

  /* ── hero typewriter ────────────────────────────────────────────────
     The command text is already in the HTML, so this is decoration only. */

  const typed = document.querySelector('[data-typewriter]');

  if (typed && !reduceMotion) {
    const text = typed.getAttribute('data-typewriter');
    typed.textContent = '';

    let i = 0;
    const step = function () {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(step, 62);
    };
    setTimeout(step, 320);
  }

  /* ── scroll reveal ──────────────────────────────────────────────────── */

  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }

  /* ── active nav link ────────────────────────────────────────────────
     Marks the section currently occupying the top of the viewport. */

  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length) {
    let queued = false;

    const syncNav = function () {
      queued = false;
      const line = window.scrollY + window.innerHeight * 0.28;
      let active = -1;

      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= line) active = i;
      }

      /* Pin the last link once the page is scrolled to the very bottom, so the
         final short section still registers. */
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        active = sections.length - 1;
      }

      navLinks.forEach(function (link, i) {
        link.classList.toggle('is-active', i === active);
      });
    };

    const onScroll = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(syncNav);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    syncNav();
  }

  /* ── copy to clipboard ──────────────────────────────────────────────── */

  /* The async Clipboard API needs a secure context and a fresh user gesture.
     Where it is unavailable we fall back to a hidden textarea + execCommand,
     which is deprecated but still the most widely supported escape hatch. */
  function legacyCopy(value) {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, value.length);

    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }

    document.body.removeChild(ta);
    return ok;
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    const original = btn.textContent;
    let restore;

    btn.addEventListener('click', async function () {
      const value = btn.getAttribute('data-copy');
      let ok = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          /* Race the write: in some embedded browsers the promise never settles
             because a permission prompt can't be surfaced, which would otherwise
             leave the button silently stuck with no feedback. */
          ok = await Promise.race([
            navigator.clipboard.writeText(value).then(function () { return true; }),
            new Promise(function (resolve) { setTimeout(function () { resolve(false); }, 500); })
          ]);
        } catch (e) { ok = false; }
      }

      if (!ok) ok = legacyCopy(value);

      btn.textContent = ok ? 'copied' : 'select it';
      btn.setAttribute('data-copied', '');

      /* If we truly cannot write, at least select the address so ⌘/Ctrl+C works. */
      if (!ok) {
        const target = btn.closest('li').querySelector('.link__val');
        if (target) {
          const range = document.createRange();
          range.selectNodeContents(target);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      clearTimeout(restore);
      restore = setTimeout(function () {
        btn.textContent = original;
        btn.removeAttribute('data-copied');
      }, 1800);
    });
  });

  /* ── local time in Dhaka ────────────────────────────────────────────
     Shown in Dhaka time regardless of where the visitor is. */

  const clock = document.querySelector('[data-clock]');

  if (clock) {
    let format;
    try {
      format = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (e) {
      format = null;
    }

    const tick = function () {
      const now = new Date();
      clock.textContent = format
        ? format.format(now)
        : String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      clock.setAttribute('datetime', now.toISOString());
    };

    tick();
    setInterval(tick, 30000);
  }

  /* ── placeholder links ──────────────────────────────────────────────
     Stops href="#" rows from yanking the page to the top before the real
     URLs are filled in. This no-ops automatically once they are. */

  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
