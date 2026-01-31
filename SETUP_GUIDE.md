# 🚀 BisDig Buddy - Setup & Dokumentasi Lengkap

**Proyek:** AI Chatbot untuk Prodi Bisnis Digital UNIKU  
**Status:** ✅ Tahap 1-3 Selesai (Siap Development)  
**Last Updated:** January 30, 2026

---

## 📋 Ringkasan Apa yang Telah Dibuat

### ✅ Tahap 1: Struktur Next.js (SELESAI)

**Framework & Dependencies:**
- ✅ Next.js 14 dengan App Router
- ✅ TypeScript untuk type safety
- ✅ Tailwind CSS + Dark Mode support
- ✅ ESLint configuration

**Library Integration:**
- ✅ Google Gemini 1.5 Flash (@ai-sdk/google)
- ✅ Vercel AI SDK (ai@latest)
- ✅ Firebase Firestore (firebase)
- ✅ Firebase Admin SDK (firebase-admin)
- ✅ OpenAI Embeddings (openai)

**Folder Structure:**
```
nextjs-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts         # Chat endpoint dengan streaming
│   │   │   └── health/route.ts       # Health check
│   │   ├── page.tsx                  # Home page / chat interface
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── ChatWindow.tsx            # Message display
│   │   ├── ChatInput.tsx             # Input form
│   │   ├── Navbar.tsx                # Navigation bar
│   │   └── ThemeToggle.tsx           # Dark/Light toggle
│   ├── lib/
│   │   ├── firebase.ts               # Firebase client init
│   │   ├── firebase-admin.ts         # Admin SDK init
│   │   ├── gemini.ts                 # Gemini model config
│   │   └── rag.ts                    # RAG logic + embeddings
│   └── utils/
│       └── constants.ts              # Prompts & config
├── public/
│   └── images/                       # Assets
├── .env.local                        # Environment variables (template)
└── package.json
```

---

### ✅ Tahap 2: Data Ingestion Script (SELESAI)

**File:** `ingest.js` (1000+ lines)

**Features:**
- ✅ Read single file atau entire directory
- ✅ Text chunking dengan smart overlap
- ✅ OpenAI embedding generation (text-embedding-3-small)
- ✅ Batch save ke Firestore dengan metadata
- ✅ Rate limiting (500ms per chunk)
- ✅ Error handling & retry logic

**Cara Penggunaan:**
```bash
# Ingest single file
node ingest.js --file docs/handbook.txt --source "Buku Pedoman 2025"

# Ingest directory
node ingest.js --dir docs/sop --source "SOP Akademik"

# Default output: Firestore collection "documents" dengan struktur:
# {
#   content: string,           // Text chunk
#   source: string,            // "Buku Pedoman", "SOP", etc
#   embedding: number[],       // Vector (1536 dimensions)
#   chunkIndex: number,
#   createdAt: Timestamp,
#   metadata: { fileName, totalChunks, textLength }
# }
```

---

### ✅ Tahap 3: Chat UI (SELESAI)

**Components:**

1. **Navbar.tsx** - Navigation dengan logo & status indicator
2. **ChatWindow.tsx** - Message display dengan timestamp
3. **ChatInput.tsx** - Textarea input dengan send button & loading state
4. **ThemeToggle.tsx** - Dark/Light mode toggle
5. **page.tsx** - Main app container dengan state management

**Features:**
- ✅ Real-time message streaming (Vercel AI SDK)
- ✅ Dark/Light mode with localStorage persistence
- ✅ Responsive mobile-first design (Tailwind)
- ✅ Auto-scroll ke message terakhir
- ✅ Disabled input saat loading
- ✅ Error messages dengan fallback

---

## 🔧 Setup untuk Development

### 1. Persiapan Environment

Edit file `.env.local` di root project:

```env
# Google Gemini API
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_gemini_key_here

# OpenAI (untuk ingest.js)
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef1234567890

# Firebase Admin SDK (Server-side, untuk ingest.js)
FIREBASE_ADMIN_SDK_KEY=./firebase-service-account.json

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Setup Firebase

**Langkah-langkah:**
1. Buat project baru di [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database (Production mode)
3. Download Service Account Key:
   - Project Settings → Service Accounts → Generate new private key
   - Save sebagai `firebase-service-account.json` di root project
4. Copy credentials ke `.env.local`

### 3. Ingest Data

Sebelum test chat, populate knowledge base:

```bash
# Siapkan dokumen di folder docs/
mkdir docs

# Copy file Anda:
# - docs/handbook.txt (Buku Pedoman)
# - docs/sop/ (Folder dengan file-file SOP)

# Run ingest
node ingest.js --dir docs --source "BisDig Knowledge Base"

# Monitor di Firebase Console → Firestore → documents collection
# Seharusnya lihat docs dengan embedding yang sudah tersimpan
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 di browser. 

**Expected Output:**
- Navbar dengan logo & status indicator
- Empty chat dengan welcome message
- Input form di bawah
- Dark mode toggle di navbar

### 5. Test Chat

1. Type pertanyaan: "Berapa syarat masuk Bisnis Digital?"
2. Click send atau tekan Enter
3. Message muncul di chat
4. AI akan retrieve docs dari Firestore & respond

---

## 🏗️ Architecture & Flow

### RAG Pipeline

```
┌─────────────────┐
│  User Input     │
│  "Berapa biaya?"│
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Convert to Embedding     │
│ (OpenAI)                 │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Find Relevant Docs       │
│ (Firestore Vector Search)│
│ Returns top 5 chunks     │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Build Context Prompt             │
│ + System Prompt                  │
│ + RAG Documents                  │
│ + User Query                     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Send to Gemini 1.5 Flash         │
│ (with streaming)                 │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Stream Response to Client        │
│ (Real-time typing effect)        │
└──────────────────────────────────┘
```

### Data Flow

```
API Route: POST /api/chat

1. Receive: { messages: Message[] }
2. Get last user message
3. Call retrieveRelevantDocuments(query)
   - Generate embedding (OpenAI)
   - Query Firestore collection:
     SELECT content FROM documents
     WHERE similarity(embedding, query_embedding) > threshold
     LIMIT 5
4. Build RAG context from results
5. Create system prompt with context
6. Stream to Gemini via Vercel AI SDK
7. Return: TextStream response
```

---

## 🔐 Environment Variables

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `NEXT_PUBLIC_GOOGLE_API_KEY` | Public | Gemini API key | `AIzaSyD...` |
| `OPENAI_API_KEY` | Secret | OpenAI embeddings | `sk-...` |
| `NEXT_PUBLIC_FIREBASE_*` | Public | Firebase client config | See Firebase Console |
| `FIREBASE_ADMIN_SDK_KEY` | Secret | Firebase service account path | `./firebase-service-account.json` |
| `NEXT_PUBLIC_APP_URL` | Public | App base URL | `http://localhost:3000` |

---

## 📝 API Endpoints

### POST /api/chat

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Berapa biaya?" }
  ]
}
```

**Response:** (Streaming)
```
data: "Berdasarkan Buku Pedoman 2025, biaya per semester adalah..."
data: " Rp 5.000.000"
...
```

### GET /api/health

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-30T10:00:00Z",
  "service": "BisDig Buddy API"
}
```

---

## 🚨 Known Issues & Fixes

### Issue 1: "StreamingTextResponse doesn't exist"
- ❌ Old: `import { StreamingTextResponse } from 'ai'`
- ✅ Fixed: Using `streamText()` with `.toTextStreamResponse()`

### Issue 2: Template string escaping
- ❌ Old: `const id = \`msg-${Date.now()}\``
- ✅ Fixed: Using `'msg-'.concat(Date.now().toString())`

### Issue 3: maxTokens parameter
- ❌ Old: Gemini doesn't support maxTokens
- ✅ Fixed: Removed, API handles defaults

---

## ⚡ Performance Optimization

### Frontend
- ✅ Next.js Code Splitting (automatic)
- ✅ Tailwind CSS purging (production build)
- ✅ Image optimization (public/images)
- ✅ Lazy component loading

### Backend
- ✅ Batch Firestore writes (10 docs per batch)
- ✅ Vector search optimization (indexed)
- ✅ API response streaming (Vercel AI)
- ✅ Connection pooling (Firebase)

### Data Ingestion
- ✅ Rate limiting (500ms per chunk)
- ✅ Batch processing (avoid timeout)
- ✅ Retry logic for failed chunks

---

## 📊 Testing Checklist

- [ ] Install dependencies: `npm install`
- [ ] Build successfully: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] Firestore documents ingested
- [ ] Chat endpoint responds: `/api/chat`
- [ ] Health check works: `/api/health`
- [ ] Dark mode toggle functional
- [ ] Mobile responsive (test on phone)
- [ ] Message streaming works
- [ ] Error handling (test with invalid query)

---

## 🚀 Deployment (Firebase Hosting)

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`

### Steps

```bash
# Build production
npm run build

# Deploy
firebase deploy

# Check logs
firebase functions:log
```

**Expected URLs:**
- Web: `https://chatbot-bisnisdigitaluniku.web.app`
- API: `https://chatbot-bisnisdigitaluniku.web.app/api/chat`

---

## 📚 File Reference

| File | Lines | Purpose |
|------|-------|---------|
| [ingest.js](ingest.js) | 400+ | Data ingestion from PDFs |
| [src/app/api/chat/route.ts](src/app/api/chat/route.ts) | 60 | Main chat endpoint |
| [src/lib/rag.ts](src/lib/rag.ts) | 150 | RAG logic & embeddings |
| [src/components/ChatWindow.tsx](src/components/ChatWindow.tsx) | 80 | Message display |
| [src/app/page.tsx](src/app/page.tsx) | 100 | Main app page |

---

## 🤝 Next Steps

### Immediate (This Week)
- [ ] Set up Firebase project
- [ ] Populate Firestore with sample docs
- [ ] Test chat functionality locally
- [ ] Fine-tune system prompt

### Short-term (Next 2 weeks)
- [ ] User feedback & UI improvements
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] Rate limiting setup

### Medium-term (Next month)
- [ ] Admin dashboard for knowledge management
- [ ] Conversation logging & analytics
- [ ] Multi-language support
- [ ] WhatsApp bot integration

---

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Check Firebase Firestore quota
3. Verify API keys in .env.local
4. Check network tab in DevTools

---

**Project Version:** 1.0.0-beta  
**Next.js:** 16.1.6  
**Node:** 18+  
**Status:** Ready for Testing ✅
