<<<<<<< HEAD
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
=======
const body = document.body;
const loader = document.getElementById("loader");
const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const cursor = document.getElementById("cursor");
const canvas = document.getElementById("ambient-canvas");
const ctx = canvas.getContext("2d");

body.classList.add("loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("hidden");
    body.classList.remove("loading");
  }, 750);
});

document.getElementById("year").textContent = new Date().getFullYear();

const closeMenu = () => {
  menuToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

let lenis;

if (window.Lenis) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.88
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };

  requestAnimationFrame(raf);
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    ".hero .reveal-item",
    { y: 34, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: "power3.out", delay: 0.45 }
  );

  gsap.utils.toArray(".reveal-item").filter((item) => !item.closest(".hero")).forEach((item) => {
    gsap.fromTo(
      item,
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 84%"
        }
      }
    );
  });

  gsap.utils.toArray("[data-speed]").forEach((item) => {
    gsap.to(item, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
} else {
  const revealItems = document.querySelectorAll(".reveal-item");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const roles = ["Frontend Developer", "Fullstack Developer", "UI-focused Engineer"];
const typedRole = document.getElementById("typed-role");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

const typeRole = () => {
  const current = roles[roleIndex];
  typedRole.textContent = deleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1);
  charIndex += deleting ? -1 : 1;

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeRole, 1200);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  setTimeout(typeRole, deleting ? 42 : 76);
};

typeRole();

const sections = document.querySelectorAll("main section[id]");
const navItems = navLinks.querySelectorAll("a");

const setActiveNav = () => {
  const scrollPosition = window.scrollY + 180;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < bottom) {
      navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
};

const handleHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 32);
  setActiveNav();
};

window.addEventListener("scroll", handleHeader, { passive: true });
handleHeader();

const projectRail = document.getElementById("project-rail");
const prevButton = document.getElementById("project-prev");
const nextButton = document.getElementById("project-next");

const scrollProjects = (direction) => {
  const distance = Math.min(projectRail.clientWidth * 0.82, 620);
  projectRail.scrollBy({ left: direction * distance, behavior: "smooth" });
};

prevButton.addEventListener("click", () => scrollProjects(-1));
nextButton.addEventListener("click", () => scrollProjects(1));

const projectData = {
  nova: {
    label: "Featured Dashboard",
    title: "Nova Analytics",
    description: "Dashboard bisnis dengan visual data, filter interaktif, layout gelap premium, dan informasi utama yang mudah dipindai oleh stakeholder.",
    stack: ["React", "Tailwind", "Supabase", "Data UI"]
  },
  launchpad: {
    label: "Startup Site",
    title: "LaunchPad",
    description: "Website company profile untuk startup teknologi dengan storytelling, CTA jelas, struktur section yang cinematic, dan responsive presentation.",
    stack: ["HTML", "CSS", "JavaScript", "UX Writing"]
  },
  meraki: {
    label: "Commerce Prototype",
    title: "Meraki Commerce",
    description: "Prototype e-commerce responsif dengan katalog produk, state keranjang, dan checkout flow yang ringkas untuk pengalaman belanja cepat.",
    stack: ["PHP", "MySQL", "CSS Grid", "Interaction"]
  },
  focusflow: {
    label: "Productivity App",
    title: "FocusFlow",
    description: "Task manager minimal dengan micro-interaction, status progress, penyimpanan lokal, dan pengalaman mobile yang ringan.",
    stack: ["JavaScript", "LocalStorage", "Mobile UI", "Motion"]
  }
};

const modal = document.getElementById("project-modal");
const modalClose = document.getElementById("modal-close");
const modalLabel = document.getElementById("modal-label");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalStack = document.getElementById("modal-stack");

const openProjectModal = (key) => {
  const project = projectData[key];
  if (!project) return;

  modalLabel.textContent = project.label;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalStack.innerHTML = project.stack.map((item) => `<span>${item}</span>`).join("");
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
};

const closeProjectModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
};

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".project-card");
    openProjectModal(card.dataset.project);
  });
});

modalClose.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeProjectModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeProjectModal();
});

const skillMeter = document.querySelector(".skill-meter span");
const skillMeterLabel = document.querySelector(".skill-meter small");

document.querySelectorAll(".tech-pill").forEach((pill, index) => {
  pill.addEventListener("mouseenter", () => {
    document.querySelectorAll(".tech-pill").forEach((item) => item.classList.remove("is-active"));
    pill.classList.add("is-active");
    skillMeter.textContent = pill.dataset.score || String(86 + (index % 7));
    skillMeterLabel.textContent = pill.dataset.focus;
  });
});

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, .project-card, .tech-pill").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 7}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

document.querySelector(".contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  const originalText = button.textContent;

  button.textContent = "Message Ready";
  setTimeout(() => {
    button.textContent = originalText;
    event.currentTarget.reset();
  }, 1400);
});

let particles = [];
let width = 0;
let height = 0;
let animationFrame;

const createParticles = () => {
  const count = Math.min(Math.floor((width * height) / 22000), 72);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.6 + 0.4,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.28 + 0.12
  }));
};

const resizeCanvas = () => {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
};

const drawParticles = () => {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 205, 255, ${particle.alpha})`;
    ctx.fill();

    for (let i = index + 1; i < particles.length; i += 1) {
      const other = particles[i];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 96) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(105, 167, 255, ${0.11 * (1 - distance / 96)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  animationFrame = requestAnimationFrame(drawParticles);
};

resizeCanvas();
drawParticles();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", () => cancelAnimationFrame(animationFrame));
>>>>>>> 1237b73cce8687e3df71e0cf5f6cc304d537a641
