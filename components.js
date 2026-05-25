/* ================================================================
   Quotami — Shared Components
   Sticky bar · WhatsApp button · Exit intent popup · Mobile nav
   ================================================================ */

/* ── MOBILE NAV (hamburger + mega-menu accordion) ── */
(function () {
  function init() {
    var nav = document.querySelector('nav');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    var savedScrollY = 0;

    function setNavOpen(open) {
      nav.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        savedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.classList.add('nav-open');
        document.body.style.top = '-' + savedScrollY + 'px';
      } else {
        document.body.classList.remove('nav-open');
        document.body.style.top = '';
        window.scrollTo(0, savedScrollY);
      }
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var open = nav.getAttribute('data-open') === 'true';
      setNavOpen(!open);
    });

    // Mega-menu: toggle su click — funziona sia desktop che mobile/tablet
    // Su desktop il :hover apre comunque, ma il click serve per dispositivi touch
    var megaTriggers = document.querySelectorAll('.has-mega > a');
    megaTriggers.forEach(function (a) {
      a.addEventListener('click', function (e) {
        // Solo se href="#": altrimenti è un link vero, lascia passare
        if (a.getAttribute('href') !== '#') return;
        e.preventDefault();
        var li = a.parentElement;
        var wasOpen = li.getAttribute('data-open') === 'true';
        // Chiudi altri mega menu aperti
        document.querySelectorAll('.has-mega[data-open="true"]').forEach(function (other) {
          if (other !== li) other.setAttribute('data-open', 'false');
        });
        li.setAttribute('data-open', String(!wasOpen));
      });
    });

    // Click fuori → chiude mega-menu aperti (solo su desktop, su mobile c'è hamburger)
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) return;
      if (e.target.closest('.has-mega')) return;
      document.querySelectorAll('.has-mega[data-open="true"]').forEach(function (li) {
        li.setAttribute('data-open', 'false');
      });
    });

    // Click su un sottolink del mega-panel (link reale) → blur + chiudi pannello
    // così focus-within non lo tiene aperto dopo la navigazione
    document.querySelectorAll('.mega-panel a').forEach(function (link) {
      link.addEventListener('click', function () {
        var li = link.closest('.has-mega');
        if (li) li.setAttribute('data-open', 'false');
        link.blur();
      });
    });

    // ESC chiude tutti i mega-menu aperti
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.has-mega[data-open="true"]').forEach(function (li) {
          li.setAttribute('data-open', 'false');
        });
        if (nav.getAttribute('data-open') === 'true') {
          setNavOpen(false);
        }
      }
    });

    // Chiudi menu mobile cliccando su un link interno (non sui trigger del mega)
    document.querySelectorAll('nav ul a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth > 900) return;
        if (link.parentElement.classList.contains('has-mega') && link.getAttribute('href') === '#') return;
        setNavOpen(false);
      });
    });

    // Chiudi al resize verso desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        if (nav.getAttribute('data-open') === 'true') setNavOpen(false);
        document.querySelectorAll('.has-mega[data-open]').forEach(function (li) {
          li.removeAttribute('data-open');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ── WHATSAPP BUTTON ── */
(function () {
  const a = document.createElement('a');
  a.className = 'wa-btn';
  a.href = 'https://wa.me/393922198185';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', 'Parla con un consulente su WhatsApp');
  a.innerHTML =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
    '</svg>' +
    '<span class="wa-tooltip">Parla con un consulente</span>';
  document.body.appendChild(a);
})();

/* ── EXIT INTENT POPUP — RIMOSSO ──
 * Era pressure tactics non allineata al posizionamento da consulente.
 * Le funzioni rfCloseExit/rfSubmitExit qui sotto sono mantenute solo per
 * non rompere eventuali handler dimenticati nelle pagine. Sicure perché
 * cercano elementi che non esistono più. */

function rfCloseExit() {
  const o = document.getElementById('rf-ei-overlay');
  if (o) o.classList.remove('show');
}

function rfSubmitExit() {
  const emailEl = document.getElementById('rf-ei-email');
  const email = emailEl.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.style.borderColor = '#d43a2f';
    emailEl.focus();
    return;
  }
  const box = document.querySelector('#rf-ei-overlay .ei-box');
  box.innerHTML =
    '<div style="text-align:center;padding:1.5rem 0">' +
      '<div style="font-size:2.5rem;margin-bottom:1rem">✅</div>' +
      '<h3 style="font-family:\'Syne\',sans-serif;font-size:1.2rem;color:var(--text);margin-bottom:.5rem">Ricevuto!</h3>' +
      '<p style="color:var(--text-muted);font-size:.875rem;line-height:1.6">Abbiamo inviato il calcolo del risparmio fiscale a <strong>' + email + '</strong>.</p>' +
      '<a href="piano-pensione.html" style="display:inline-block;margin-top:1.25rem;background:var(--green-dark);color:#fff;padding:.8rem 1.75rem;border-radius:12px;text-decoration:none;font-family:\'Syne\',sans-serif;font-weight:700;font-size:.9rem">Calcola subito il mio piano →</a>' +
      '<p style="margin-top:1rem;font-size:.75rem;color:var(--text-muted);cursor:pointer" onclick="rfCloseExit()">Chiudi</p>' +
    '</div>';
  setTimeout(rfCloseExit, 6000);
}
