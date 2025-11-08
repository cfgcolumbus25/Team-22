// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Firebase Admin init (requires ./serviceAccountKey.json) ---
const keyPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json";
if (!fs.existsSync(keyPath)) {
  console.error("❌ Missing serviceAccountKey.json at", keyPath);
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
console.log("✅ Firebase Admin initialized");

// ---------------------------------
// Health check (for quick sanity)
// ---------------------------------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Keep your earlier test route (reads colleges/collegeId)
app.get("/api/test", async (_req, res) => {
  try {
    const snap = await db.collection("colleges").doc("collegeId").get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------
// Colleges API
// ---------------------------------

// Read a college
app.get("/api/colleges/:id", async (req, res) => {
  try {
    const snap = await db.collection("colleges").doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: "Not found" });
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create/Update a college’s core fields
app.put("/api/colleges/:id", async (req, res) => {
  try {
    const { name, state, zipCode } = req.body;
    const payload = {
      ...(name !== undefined && { name }),
      ...(state !== undefined && { state }),
      ...(zipCode !== undefined && { zipCode }),
      lastUpdated: new Date(),
    };
    await db.collection("colleges").doc(req.params.id).set(payload, { merge: true });
    const snap = await db.collection("colleges").doc(req.params.id).get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------
// Exams subcollection API
// ---------------------------------

// List exams for a college
app.get("/api/colleges/:id/exams", async (req, res) => {
  try {
    const qs = await db
      .collection("colleges")
      .doc(req.params.id)
      .collection("exams")
      .orderBy("name")
      .get();
    res.json(qs.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Upsert a single exam (create or update)
app.put("/api/colleges/:id/exams/:examId", async (req, res) => {
  try {
    const {
      name,               // e.g., "American Government"
      minimumScore,       // e.g., 56
      creditsTranscribed, // e.g., 3.0
      transcriptCharge,   // number or null
      clepUrl,            // optional
      acceptanceLastModified // ISO string (optional)
    } = req.body;

    const payload = {
      ...(name !== undefined && { name }),
      ...(minimumScore !== undefined && { minimumScore }),
      ...(creditsTranscribed !== undefined && { creditsTranscribed }),
      ...(transcriptCharge !== undefined && { transcriptCharge }),
      ...(clepUrl !== undefined && { clepUrl }),
      ...(acceptanceLastModified && {
        acceptanceLastModified: new Date(acceptanceLastModified),
      }),
      lastUpdated: new Date(),
    };

    const ref = db
      .collection("colleges")
      .doc(req.params.id)
      .collection("exams")
      .doc(req.params.examId);

    await ref.set(payload, { merge: true });
    const snap = await ref.get();
    res.json({ id: snap.id, ...snap.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete an exam
app.delete("/api/colleges/:id/exams/:examId", async (req, res) => {
  try {
    await db
      .collection("colleges")
      .doc(req.params.id)
      .collection("exams")
      .doc(req.params.examId)
      .delete();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`🚀 API listening on http://localhost:${port}`)
);
