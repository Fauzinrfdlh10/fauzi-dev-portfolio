/* ===================================
   DESIGNER.DEV — script.js
   =================================== */

/* ─── Custom Cursor ─── */
(function () {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth follower
  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Hover state
  const hoverEls = document.querySelectorAll('a, button, input, textarea, .bento-card, .testi-card, .timeline-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


/* ─── Navbar scroll behaviour ─── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── Mobile hamburger ─── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ─── Scroll Reveal (IntersectionObserver) ─── */
(function () {
  const targets = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-stat'
  );
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);

      setTimeout(() => el.classList.add('revealed'), delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();


/* ─── Active nav link on scroll ─── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => {
        const active = l.getAttribute('href') === `#${id}`;
        l.style.color = active ? 'var(--blue)' : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();


/* ─── Smooth parallax on hero orbs ─── */
(function () {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  const speeds = [0.04, 0.06, 0.03];

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    orbs.forEach((orb, i) => {
      const s = speeds[i] || 0.04;
      orb.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
    });
  }, { passive: true });
})();


/* ─── Contact form ─── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn      = form.querySelector('.btn-submit');
    const btnText  = btn.querySelector('.btn-text');
    const btnIcon  = btn.querySelector('.btn-icon .material-symbols-outlined');

    // Basic validation
    let valid = true;
    ['name', 'email', 'message'].forEach(field => {
      const input = form.querySelector(`#${field}`);
      if (!input || !input.value.trim()) {
        input && shake(input);
        valid = false;
      }
    });
    if (!valid) return;

    try {
      const payload = {
        full_name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject')?.value.trim() || 'New Inquiry',
        message: document.getElementById('message').value.trim()
      };

      btn.disabled = true;
      btnText.textContent = 'Sending…';

      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      btn.classList.add('sent');
      btnText.textContent = 'Message Sent!';
      if (btnIcon) btnIcon.textContent = 'check_circle';

      form.reset();

      setTimeout(() => {
        btn.classList.remove('sent');
        btnText.textContent = 'Send Message';
        if (btnIcon) btnIcon.textContent = 'send';
        btn.disabled = false;
      }, 4000);

    } catch (error) {
      alert('Error: ' + error.message);
      btnText.textContent = 'Send Message';
      btn.disabled = false;
    }
  });

  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shakeField 0.4s ease';
    el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  }
})();


/* ─── Inject shake keyframe ─── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shakeField {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── Bento card tilt effect ─── */
(function () {
  const cards = document.querySelectorAll('.bento-card');
  if (!cards.length || window.matchMedia('(max-width: 768px)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─── Number count-up animation ─── */
(function () {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const end = parseInt(raw, 10);
      if (isNaN(end)) return;
      const suffix = raw.replace(/\d/g, '');

      let start = 0;
      const dur = 1200;
      const step = 16;
      const inc  = end / (dur / step);

      const timer = setInterval(() => {
        start = Math.min(start + inc, end);
        el.textContent = Math.floor(start) + suffix;
        if (start >= end) clearInterval(timer);
      }, step);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
})();
