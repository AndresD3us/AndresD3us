const i18n = {
  es: {
    "nav.skills": "Skills",
    "nav.projects": "Proyectos",
    "nav.about": "About",
    "nav.reviews": "Reviews",
    "hero.eyebrow": "Desarrollador Web",
    "hero.tagline": "Construyo experiencias web que van más allá del código. Apasionado por el desarrollo, el diseño y crear cosas que importen.",
    "hero.cta.projects": "Ver Proyectos",
    "skills.label": "Tecnologías",
    "projects.label": "Portafolio",
    "projects.title.em": "Proyectos",
    "projects.title.suffix": "recientes",
    "projects.oticbot.desc": "Bot multifuncional para Discord construido en Python con comandos personalizados, sistema de economía y moderación automatizada.",
    "projects.distribuidora.desc": "Aplicación de gestión para una distribuidora de gaseosas. Incluye módulo de contabilidad, sistema de pedidos y control de ventas en tiempo real.",
    "projects.neptune.desc": "Neptune Network es un servidor HCF en Minecraft Bedrock, donde fui desarrollador principal. El proyecto depende completamente de mí, lo que me ha ayudado a crecer mucho como desarrollador.",
    "about.label": "Sobre mí",
    "about.p1": "Soy <strong>AndresD3us</strong>, desarrollador web apasionado por construir cosas reales con código. Llevo tiempo en este mundo y cada proyecto me enseña algo nuevo.",
    "about.p2": "Me muevo entre el <strong>frontend y el backend</strong>, trabajo con Node.js, Python y PHP. Me gusta que las cosas funcionen bien y se vean mejor.",
    "about.p3": "Cuando no estoy construyendo, estoy aprendiendo. Siempre hay algo nuevo que explorar — nuevas herramientas, frameworks, ideas.",
    "about.github": "Ver GitHub",
    "about.stat.projects": "Proyectos",
    "about.stat.tech": "Tecnologías",
    "about.stat.reviews": "Reviews",
    "about.stat.rating": "Calificación",
    "reviews.label": "Clientes",
    "reviews.empty": "Aún no hay reseñas. ¡Sé el primero en calificar!",
    "reviews.form.title": "Deja tu reseña",
    "reviews.form.name": "Tu nombre",
    "reviews.form.name_placeholder": "Ej: Carlos M.",
    "reviews.form.rating": "Calificación",
    "reviews.form.comment": "Comentario",
    "reviews.form.comment_placeholder": "Cuéntanos tu experiencia...",
    "reviews.form.submit": "Publicar reseña",
    "reviews.success": "¡Reseña publicada con éxito!",
    "reviews.error.fields": "Por favor completa todos los campos y selecciona una calificación.",
    "reviews.error.send": "Error al enviar la reseña. Intenta de nuevo.",
    "reviews.count_singular": "reseña",
    "reviews.count_plural": "reseñas",
    "footer.copy": "© 2025 AndresD3us · Todos los derechos reservados"
  },
  en: {
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.reviews": "Reviews",
    "hero.eyebrow": "Web Developer",
    "hero.tagline": "I build web experiences that go beyond the code. Passionate about development, design, and creating things that matter.",
    "hero.cta.projects": "View Projects",
    "skills.label": "Technologies",
    "projects.label": "Portfolio",
    "projects.title.em": "Projects",
    "projects.title.suffix": "recent",
    "projects.oticbot.desc": "Multifunctional Discord bot built in Python with custom commands, economy system and automated moderation.",
    "projects.distribuidora.desc": "Management app for a beverage distributor. Includes accounting module, order system and real-time sales tracking.",
    "projects.neptune.desc": "Neptune Network is an HCF server at Minecraft Bedrock, where I was a lead developer. The project is completely up to me, which has helped me grow a lot as a developer.",
    "about.label": "About me",
    "about.p1": "I'm <strong>AndresD3us</strong>, a web developer passionate about building real things with code. I've been in this world for a while and every project teaches me something new.",
    "about.p2": "I work across <strong>frontend and backend</strong>, with Node.js, Python and PHP. I like things to work well and look even better.",
    "about.p3": "When I'm not building, I'm learning. There's always something new to explore — new tools, frameworks, ideas.",
    "about.github": "View GitHub",
    "about.stat.projects": "Projects",
    "about.stat.tech": "Technologies",
    "about.stat.reviews": "Reviews",
    "about.stat.rating": "Rating",
    "reviews.label": "Clients",
    "reviews.empty": "No reviews yet. Be the first to rate!",
    "reviews.form.title": "Leave your review",
    "reviews.form.name": "Your name",
    "reviews.form.name_placeholder": "e.g. Carlos M.",
    "reviews.form.rating": "Rating",
    "reviews.form.comment": "Comment",
    "reviews.form.comment_placeholder": "Tell us about your experience...",
    "reviews.form.submit": "Post review",
    "reviews.success": "Review posted successfully!",
    "reviews.error.fields": "Please fill in all fields and select a rating.",
    "reviews.error.send": "Failed to submit review. Please try again.",
    "reviews.count_singular": "review",
    "reviews.count_plural": "reviews",
    "footer.copy": "© 2025 AndresD3us · All rights reserved"
  }
};

const userLang = (navigator.language || navigator.userLanguage || "en")
  .toLowerCase()
  .startsWith("es") ? "es" : "en";

let currentLang = localStorage.getItem("lang") || userLang;
let allReviews = [];

function t(key) {
  return i18n[currentLang][key] || i18n["es"][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyLang();
}

function applyLang() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (el.tagName === "A" && el.querySelector("svg")) {
      const svg = el.querySelector("svg").outerHTML;
      el.innerHTML = svg + " " + val;
    } else {
      el.innerHTML = val;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.getElementById("btn-es").classList.toggle("active", currentLang === "es");
  document.getElementById("btn-en").classList.toggle("active", currentLang === "en");

  renderReviews();
}

function starsHTML(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

function formatDate(timestamp) {
  const locale = currentLang === "es" ? "es-ES" : "en-US";
  return new Date(timestamp).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function createReviewCard(r) {
  const card = document.createElement("div");
  card.className = "review-card";

  const stars = document.createElement("div");
  stars.className = "review-stars";
  stars.textContent = starsHTML(r.rating);

  const comment = document.createElement("p");
  comment.className = "review-comment";
  comment.textContent = `"${r.comment}"`;

  const author = document.createElement("div");
  author.className = "review-author";
  author.textContent = r.name;

  const date = document.createElement("div");
  date.className = "review-date";
  date.textContent = formatDate(r.date);

  card.appendChild(stars);
  card.appendChild(comment);
  card.appendChild(author);
  card.appendChild(date);

  return card;
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  const avgDisplay = document.getElementById("avg-display");
  const statCount = document.getElementById("stat-reviews-count");
  const statAvg = document.getElementById("stat-avg-score");

  statCount.textContent = allReviews.length;

  if (allReviews.length === 0) {
    container.innerHTML = `<div class="no-reviews">${t("reviews.empty")}</div>`;
    avgDisplay.style.display = "none";
    statAvg.textContent = "—";
    return;
  }

  const avg = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;
  const avgRounded = Math.round(avg * 10) / 10;
  const countWord = allReviews.length === 1
    ? t("reviews.count_singular")
    : t("reviews.count_plural");

  document.getElementById("avg-num").textContent = avgRounded.toFixed(1);
  document.getElementById("avg-stars").textContent = starsHTML(Math.round(avg));
  document.getElementById("avg-count").textContent = `${allReviews.length} ${countWord}`;
  avgDisplay.style.display = "flex";
  statAvg.textContent = avgRounded.toFixed(1);

  const grid = document.createElement("div");
  grid.className = "reviews-grid";
  allReviews.forEach(r => grid.appendChild(createReviewCard(r)));

  container.innerHTML = "";
  container.appendChild(grid);
}

async function loadReviews() {
  try {
    const res = await fetch("/api/reviews");
    if (!res.ok) {
      console.error("Error cargando reseñas: HTTP", res.status);
      allReviews = [];
      renderReviews();
      return;
    }
    const data = await res.json();
    allReviews = Array.isArray(data) ? data : [];
    renderReviews();
  } catch (e) {
    console.error("Error cargando reseñas:", e);
    allReviews = [];
    renderReviews();
  }
}

async function submitReview() {
  const name = document.getElementById("inp-name").value.trim();
  const comment = document.getElementById("inp-comment").value.trim();
  const ratingEl = document.querySelector("input[name='rating']:checked");

  if (!name || !comment || !ratingEl) {
    showMsg(t("reviews.error.fields"), "error");
    return;
  }

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating: parseInt(ratingEl.value), comment })
    });

    if (!res.ok) throw new Error();

    showMsg(t("reviews.success"), "success");
    document.getElementById("inp-name").value = "";
    document.getElementById("inp-comment").value = "";
    ratingEl.checked = false;
    loadReviews();
  } catch {
    showMsg(t("reviews.error.send"), "error");
  }
}

function showMsg(text, type) {
  const msg = document.getElementById("form-msg");
  msg.textContent = text;
  msg.className = "form-msg " + type;
  msg.style.display = "block";
  setTimeout(() => { msg.style.display = "none"; }, 4000);
}

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

const hamburger = document.getElementById("nav-hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

function closeMenu() {
  navLinks.classList.remove("open");
  hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", e => {
  if (
    navLinks.classList.contains("open") &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

applyLang();
loadReviews();
