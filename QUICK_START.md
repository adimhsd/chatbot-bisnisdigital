# ⚡ BisDig Buddy - Quick Start Guide

**5 Menit Setup untuk Development**

## Step 1: Environment Variables (2 min)

Edit `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project
# ... (lihat SETUP_GUIDE.md untuk lengkap)
```

## Step 2: Run Dev Server (1 min)

```bash
npm install  # If first time
npm run dev
```

Open http://localhost:3000

## Step 3: Ingest Sample Data (1 min)

```bash
node ingest.js --file sample-docs/handbook.txt --source "Buku Pedoman"
```

## Step 4: Test Chat (1 min)

1. Type: "Berapa syarat masuk?"
2. Click Send
3. Wait for AI response

---

## 🔗 Quick Links

- **Full Setup:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API Docs:** [src/app/api/](src/app/api/)
- **Components:** [src/components/](src/components/)
- **Data Script:** [ingest.js](ingest.js)

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` |
| "API key invalid" | Check `.env.local` |
| "No documents found" | Run `node ingest.js` first |
| "Firestore error" | Check Firebase project setup |

---

**Ready to go!** 🚀
