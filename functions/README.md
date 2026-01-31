Firebase Functions scaffold for BisDig Buddy

- Endpoint: POST /chat
  - Request JSON: { "question": "..." }
  - Response JSON: { "answer": "...", "context": "..." }

Notes:
- The current implementation returns a simulated answer. Replace the placeholder
  with calls to Google Gemini (via Google Generative AI SDK) or another LLM.
- Deploy with:
  - `cd functions && npm install`
  - from project root: `firebase deploy --only functions,hosting`
- For production Gemini integration, prefer using a service account or secure
  server-side API key stored in Firebase Functions config.
