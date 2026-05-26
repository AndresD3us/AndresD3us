const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const reviewLimits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;
  const entry = reviewLimits.get(ip) || { count: 0, start: now };

  if (now - entry.start > windowMs) {
    reviewLimits.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  reviewLimits.set(ip, entry);
  return true;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const snapshot = await db
        .collection("reviews")
        .orderBy("date", "desc")
        .get();
      const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener las reseñas." });
    }
  }

  if (req.method === "POST") {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    if (!rateLimit(ip)) {
      return res
        .status(429)
        .json({ error: "Demasiadas solicitudes. Intenta en 15 minutos." });
    }

    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: "Faltan campos requeridos." });
    }

    const r = parseInt(rating);
    if (isNaN(r) || r < 1 || r > 5) {
      return res
        .status(400)
        .json({ error: "La calificación debe ser entre 1 y 5." });
    }

    const entry = {
      name: escapeHtml(name.trim().substring(0, 50)),
      rating: r,
      comment: escapeHtml(comment.trim().substring(0, 300)),
      date: Date.now(),
    };

    try {
      const doc = await db.collection("reviews").add(entry);
      return res.status(201).json({ id: doc.id, ...entry });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al guardar la reseña." });
    }
  }

  return res.status(405).json({ error: "Método no permitido." });
};
