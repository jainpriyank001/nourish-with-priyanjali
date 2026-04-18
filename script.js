/* =========================================================================
   Nourish with Priyanjali — script.js
   Vanilla JS: mobile menu, scroll reveal, nav shadow, modal, form, a11y.
   ========================================================================= */
(() => {
  'use strict';

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobile = () => {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.hidden = true;
  };
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
      mobileMenu.hidden = expanded;
    });
    // Close mobile menu whenever a link inside it is clicked
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMobile();
    });
  }

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback — reveal everything immediately
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Modal: open / close / focus trap ---------- */
  const modal = document.getElementById('booking-modal');
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('is-locked');
    closeMobile();
    // Focus first input after paint
    requestAnimationFrame(() => {
      const first = modal.querySelector('input, select, textarea, button');
      if (first) first.focus();
    });
  };

  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  // Delegate open/close clicks
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-modal]');
    if (opener) { e.preventDefault(); openModal(); return; }
    const closer = e.target.closest('[data-close-modal]');
    if (closer) { e.preventDefault(); closeModal(); return; }
  });

  // Keyboard: Esc to close, Tab to trap focus
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(modal.querySelectorAll(FOCUSABLE))
        .filter((el) => !el.hasAttribute('hidden'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* ---------- FAQ accordion: keep one open at a time ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });

  /* ---------- Booking form → mailto fallback --------------------------
     When Calendly / Google Form is wired up (see index.html comment),
     delete this form block. Until then, submissions open the user's mail
     client with a prefilled message to the address below.
     ------------------------------------------------------------------- */
  const BOOKING_EMAIL = 'priyanjalijain81@gmail.com';
  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name  = (data.get('name')  || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const time  = (data.get('time')  || '').toString().trim();
      const msg   = (data.get('message') || '').toString().trim();

      const subject = `Discovery Session Request — ${name || 'New client'}`;
      const bodyLines = [
        `Hi Priyanjali,`,
        ``,
        `I'd like to book a free discovery session.`,
        ``,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Preferred time: ${time || '—'}`,
        ``,
        `Message:`,
        msg || '(none)',
      ];
      const href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
      window.location.href = href;

      // Optimistic success UX
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const original = submitBtn.textContent;
        submitBtn.textContent = 'Opening your email…';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = original;
          submitBtn.disabled = false;
          form.reset();
          closeModal();
        }, 1400);
      }
    });
  }
})();
