/*
  Firebase Function scaffold: `chatApi`

  - POST /chat  { question: string }
  - Reads some context documents from Firestore (collection `documents`) and
    returns a combined context and placeholder answer.

  To wire to Google Gemini or another LLM, replace the placeholder section
  below with a call to the Generative AI API and stream/return the model output.

  Deployment:
    - Set function runtime env vars (if needed) via `firebase functions:config:set`
    - Deploy with `firebase deploy --only functions`
    - Hosting rewrite for `/api/chat` is configured in `firebase.json`.
*/

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const question = req.body?.question;
    if (!question) return res.status(400).json({ error: 'Missing question' });

    // Simple retrieval: fetch up to 5 recent documents as context.
    const snap = await db.collection('documents').orderBy('createdAt', 'desc').limit(5).get();
    const docs = [];
    snap.forEach(d => docs.push({ id: d.id, ...d.data() }));

    const contextText = docs.map((d, i) => `SOURCE ${i + 1}: ${d.metadata?.fileName || ''}\n${d.content}`).join('\n\n---\n\n');

    // Placeholder LLM call — integrate Gemini or Vercel AI SDK here.
    // If you have a server-side Google API key / service account and want
    // to call Gemini, replace this section with the appropriate client call.

    const simulatedAnswer = `(SIMULATED) Jawaban atas: "${question}"\n---\nContext includes ${docs.length} documents.`;

    return res.json({ answer: simulatedAnswer, context: contextText });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Internal error', details: err.message });
  }
});

exports.chatApi = functions.https.onRequest(app);
