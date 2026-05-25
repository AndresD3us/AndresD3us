const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readReviews() {
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8')); }
  catch { return []; }
}
function writeReviews(reviews) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

app.get('/api/reviews', (req, res) => res.json(readReviews()));

app.post('/api/reviews', (req, res) => {
  const { name, rating, comment } = req.body;
  if (!name || !rating || !comment) return res.status(400).json({ error: 'Missing fields' });
  const r = parseInt(rating);
  if (r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  const reviews = readReviews();
  const entry = { id: Date.now(), name: name.trim().substring(0,50), rating: r, comment: comment.trim().substring(0,300), date: new Date().toISOString() };
  reviews.unshift(entry);
  writeReviews(reviews);
  res.status(201).json(entry);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
