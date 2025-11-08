import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Firebase Admin init ----
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

// ---- Helpers ----
const collegeRef = (id) => db.collection("colleges").doc(id);
const examsRef = (collegeId) => collegeRef(collegeId).collection("exams");

// ---- Health ----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ================= COLLEGES =================

// List colleges (basic header list for the table)
app.get("/api/colleges", async (_req, res) => {
  try {
    const snap = await db.collection("colleges").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create a college
app.post("/api/colleges", async (req, res) => {
  try {
    const { id, name, state, zipCode, acceptsExams = true } = req.body || {};
    if (!id || !name)
      return res.status(400).json({ error: "id and name required" });
    const payload = {
      name,
      state: state ?? "",
      zipCode: zipCode ?? "",
      acceptsExams,
      lastUpdated: FieldValue.serverTimestamp(),
    };
    await collegeRef(id).set(payload, { merge: true });
    const doc = await collegeRef(id).get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get single college (with exams)
app.get("/api/colleges/:collegeId", async (req, res) => {
  try {
    const { collegeId } = req.params;
    const doc = await collegeRef(collegeId).get();
    if (!doc.exists) return res.status(404).json({ error: "college not found" });

    const examsSnap = await examsRef(collegeId).orderBy("examName").get();
    const exams = examsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ id: doc.id, ...doc.data(), exams });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update college meta
app.patch("/api/colleges/:collegeId", async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { name, state, zipCode, acceptsExams } = req.body || {};
    const payload = {
      ...(name !== undefined ? { name } : {}),
      ...(state !== undefined ? { state } : {}),
      ...(zipCode !== undefined ? { zipCode } : {}),
      ...(acceptsExams !== undefined ? { acceptsExams } : {}),
      lastUpdated: FieldValue.serverTimestamp(),
    };
    await collegeRef(collegeId).set(payload, { merge: true });
    const doc = await collegeRef(collegeId).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete college (and all exams)
app.delete("/api/colleges/:collegeId", async (req, res) => {
  try {
    const { collegeId } = req.params;
    // delete exams in batches
    const exSnap = await examsRef(collegeId).get();
    const batch = db.batch();
    exSnap.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    await collegeRef(collegeId).delete();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= EXAMS (under a college) =================

// List exams only
app.get("/api/colleges/:collegeId/exams", async (req, res) => {
  try {
    const { collegeId } = req.params;
    const snap = await examsRef(collegeId).orderBy("examName").get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create / upsert an exam
app.post("/api/colleges/:collegeId/exams", async (req, res) => {
  try {
    const { collegeId } = req.params;
    const {
      examName,
      minScore = 50,
      credits = 3,
      transcriptChargeCents = 0,
      id,
    } = req.body || {};
    if (!examName) return res.status(400).json({ error: "examName required" });

    const data = {
      examName,
      minScore: Number(minScore),
      credits: Number(credits),
      transcriptChargeCents: Number(transcriptChargeCents),
      flagged: Number(0),
      lastModified: FieldValue.serverTimestamp(),
    };

    const ref = id
      ? examsRef(collegeId).doc(id)
      : examsRef(collegeId).doc(examName.replaceAll(" ", ""));
    await ref.set(data, { merge: true });

    const doc = await ref.get();
    res.status(201).json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update an exam
app.patch("/api/colleges/:collegeId/exams/:examId", async (req, res) => {
  try {
    const { collegeId, examId } = req.params;
    const { examName, minScore, credits, transcriptChargeCents } =
      req.body || {};
    const payload = {
      ...(examName !== undefined ? { examName } : {}),
      ...(minScore !== undefined ? { minScore: Number(minScore) } : {}),
      ...(credits !== undefined ? { credits: Number(credits) } : {}),
      ...(transcriptChargeCents !== undefined
        ? { transcriptChargeCents: Number(transcriptChargeCents) }
        : {}),
      lastModified: FieldValue.serverTimestamp(),
    };
    await examsRef(collegeId).doc(examId).set(payload, { merge: true });
    const doc = await examsRef(collegeId).doc(examId).get();
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete an exam
app.delete("/api/colleges/:collegeId/exams/:examId", async (req, res) => {
  try {
    const { collegeId, examId } = req.params;
    await examsRef(collegeId).doc(examId).delete();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= FLAGS (per exam; keep all reasons) =================

// Create a new flag entry and increment counter
app.post("/api/colleges/:collegeId/exams/:examId/flags", async (req, res) => {
  try {
    const { collegeId, examId } = req.params;
    const { reason, contact } = req.body || {};
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "reason is required" });
    }

    const examDoc = examsRef(collegeId).doc(examId);
    const flagsCol = examDoc.collection("flags");

    const batch = db.batch();
    const flagDoc = flagsCol.doc();

    batch.set(flagDoc, {
      reason: reason.trim(),
      contact: contact?.trim() || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    batch.set(
      examDoc,
      {
        flagged: FieldValue.increment(1),
        lastFlagReason: reason.trim(),
        lastFlaggedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();

    const snap = await examDoc.get();
    res.json({ ok: true, flagged: snap.get("flagged") ?? 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// List flags for an exam (recent first)
app.get("/api/colleges/:collegeId/exams/:examId/flags", async (req, res) => {
  try {
    const { collegeId, examId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 20, 200);

    const snap = await examsRef(collegeId)
      .doc(examId)
      .collection("flags")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ---- Start ----
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`🚀 API listening on http://localhost:${port}`)
);
