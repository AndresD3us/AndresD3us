/* ── APP.JS ── */

// Nav shrink on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.padding = window.scrollY > 50 ? '0.7rem 4rem' : '';
});

// Stars selector
const stars = document.querySelectorAll('.star');
let selectedRating = 0;
stars.forEach(star => {
  star.addEventListener('mouseenter', () => {
    const val = +star.dataset.v;
    stars.forEach(s => s.classList.toggle('active', +s.dataset.v <= val));
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach(s => s.classList.toggle('active', +s.dataset.v <= selectedRating));
  });
  star.addEventListener('click', () => {
    selectedRating = +star.dataset.v;
    document.getElementById('r-rating').value = selectedRating;
    stars.forEach(s => s.classList.toggle('active', +s.dataset.v <= selectedRating));
  });
});

// Render reviews
function starsHTML(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderReviews(reviews) {
  const grid = document.getElementById('reviews-grid');
  // Update hero stat
  document.getElementById('stat-reviews').textContent = reviews.length;

  if (reviews.length === 0) {
    grid.innerHTML = '<p class="no-reviews">Aún no hay reseñas. ¡Sé el primero!</p>';
    return;
  }
  grid.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-author">
          <strong>${escapeHTML(r.name)}</strong>
          <span>${r.date}</span>
        </div>
        <div class="review-stars">${starsHTML(r.rating)}</div>
      </div>
      <p class="review-comment">"${escapeHTML(r.comment)}"</p>
      <div class="review-service">Servicio: <span>${escapeHTML(r.service)}</span></div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function loadReviews() {
  try {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    renderReviews(data);
  } catch {
    document.getElementById('reviews-grid').innerHTML = '<p class="no-reviews">Error al cargar reseñas.</p>';
  }
}

// Submit review
document.getElementById('submit-review').addEventListener('click', async () => {
  const name = document.getElementById('r-name').value.trim();
  const service = document.getElementById('r-service').value.trim();
  const comment = document.getElementById('r-comment').value.trim();
  const rating = +document.getElementById('r-rating').value;
  const msg = document.getElementById('form-msg');

  if (!name || !service || !comment || rating === 0) {
    msg.style.color = '#c0392b';
    msg.textContent = 'Por favor completa todos los campos y selecciona una calificación.';
    return;
  }

  const btn = document.getElementById('submit-review');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  msg.textContent = '';

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, service, comment, rating })
    });
    if (!res.ok) throw new Error();
    msg.style.color = 'var(--accent)';
    msg.textContent = '¡Reseña enviada! Gracias.';
    document.getElementById('r-name').value = '';
    document.getElementById('r-service').value = '';
    document.getElementById('r-comment').value = '';
    document.getElementById('r-rating').value = 0;
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    loadReviews();
  } catch {
    msg.style.color = '#c0392b';
    msg.textContent = 'Error al enviar. Intenta de nuevo.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enviar Reseña';
  }
});

// Init
loadReviews();

// Intersection observer for section animations
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(s => {
  if (s.id !== 'hero') {
    s.style.opacity = '0';
    s.style.transform = 'translateY(24px)';
    s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(s);
  }
});
