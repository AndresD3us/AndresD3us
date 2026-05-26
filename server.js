const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Error: FIREBASE_SERVICE_ACCOUNT no está definida.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  )
});

const db = admin.firestore();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const reviewLimits = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;
  const entry = reviewLimits.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    reviewLimits.set(ip, { count: 1, start: now });
    return next();
  }

  if (entry.count >= maxRequests) {
    return res.status(429).json({ error: "Demasiadas solicitudes. Intenta en 15 minutos." });
  }

  entry.count++;
  reviewLimits.set(ip, entry);
  next();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

app.get("/api/reviews", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews").orderBy("date", "desc").get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener las reseñas:", error);
    // Return empty array so the frontend doesn't crash with .reduce()
    res.json([]);
  }
});

app.post("/api/reviews", rateLimit, async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const r = parseInt(rating);

    if (isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: "La calificación debe ser entre 1 y 5." });
    }

    const entry = {
      name: escapeHtml(name.trim().substring(0, 50)),
      rating: r,
      comment: escapeHtml(comment.trim().substring(0, 300)),
      date: Date.now()
    };

    const doc = await db.collection("reviews").add(entry);
    res.status(201).json({ id: doc.id, ...entry });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la reseña." });
  }
});

app.get("*path", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
