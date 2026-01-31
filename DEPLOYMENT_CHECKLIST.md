# ✅ BisDig Buddy - Pre-Deployment Checklist

**Use this checklist before deploying to production**

---

## 🔧 Configuration & Secrets

- [ ] `.env.local` file created with all variables
- [ ] `NEXT_PUBLIC_GOOGLE_API_KEY` is valid
- [ ] `OPENAI_API_KEY` is valid
- [ ] Firebase credentials all filled in
- [ ] `firebase-service-account.json` created and protected (in .gitignore)
- [ ] No hardcoded secrets in code files

---

## 🚀 Build & Dependencies

- [ ] Run `npm install` successfully
- [ ] Run `npm run build` without errors
- [ ] No TypeScript errors
- [ ] All imports resolve correctly
- [ ] No console warnings in build output

---

## 📦 Firebase Setup

- [ ] Firebase project created
- [ ] Firestore database initialized (Production mode)
- [ ] Service Account Key generated
- [ ] Project ID matches `.env.local`
- [ ] Firestore security rules reviewed

---

## 📚 Knowledge Base

- [ ] Document preparation complete
  - [ ] PDF files converted to TXT
  - [ ] Buku Pedoman 2025 available
  - [ ] SOP documents collected
  - [ ] All files in `docs/` folder
- [ ] Data ingestion tested: `node ingest.js --dir docs`
- [ ] Firestore has "documents" collection with data
- [ ] At least 5 sample chunks verified in Firebase Console
- [ ] Embeddings are properly stored (1536 dimensions)

---

## 🧪 Local Testing

- [ ] Dev server runs: `npm run dev`
- [ ] Home page loads at http://localhost:3000
- [ ] Chat interface displays correctly
- [ ] Dark mode toggle works
- [ ] Mobile responsive (test with DevTools)
- [ ] Send test message works
- [ ] AI responds with relevant information
- [ ] Error messages display properly
- [ ] No console errors (F12 → Console tab)

---

## 🔍 API Testing

- [ ] GET `/api/health` returns 200
- [ ] POST `/api/chat` with valid message returns response
- [ ] POST `/api/chat` with invalid data returns 400
- [ ] Streaming response shows real-time text

---

## 🔐 Security

- [ ] API keys NOT in any .tsx/.ts files
- [ ] Environment variables properly scoped:
  - [ ] `NEXT_PUBLIC_*` for client-side only
  - [ ] Others for server-side only
- [ ] System prompt configured (prevents off-topic answers)
- [ ] Error messages don't expose sensitive info
- [ ] CORS headers properly set (if needed)

---

## 📱 Mobile & Responsive

- [ ] Test on real phone/tablet if possible
- [ ] Chat input accessible (not cut off)
- [ ] Messages readable on small screens
- [ ] Dark mode works on mobile
- [ ] Navbar renders properly
- [ ] No horizontal scroll

---

## ⚡ Performance

- [ ] Build time < 10 seconds
- [ ] Bundle size reasonable (check: `npm run build`)
- [ ] First Contentful Paint < 3 seconds
- [ ] Chat response time < 5 seconds
- [ ] No memory leaks (open DevTools → Memory tab)

---

## 📊 Firebase Quota Check

- [ ] Review Firebase pricing
- [ ] Estimate monthly costs for:
  - [ ] Firestore reads/writes
  - [ ] Gemini API calls
  - [ ] OpenAI embedding calls
- [ ] Set budget alert in Firebase Console
- [ ] Plan for scaling

---

## 🚢 Firebase Hosting Deployment

### Pre-deployment
- [ ] Firebase CLI installed: `firebase --version`
- [ ] Logged into Firebase: `firebase login`
- [ ] Correct project selected: `firebase projects:list`
- [ ] `firebase.json` configuration reviewed

### Deployment steps
- [ ] Run: `npm run build`
- [ ] Run: `firebase deploy`
- [ ] Check deployment logs: `firebase deploy --debug`
- [ ] Verify live URL loads correctly

### Post-deployment
- [ ] Visit `https://chatbot-bisnisdigitaluniku.web.app`
- [ ] Test chat functionality on live site
- [ ] Test dark mode on live site
- [ ] Check API calls complete without CORS errors
- [ ] Monitor Firebase Console for errors

---

## 📈 Monitoring Setup

- [ ] Firebase Cloud Logging enabled
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Firestore quota monitoring set

---

## 📝 Documentation

- [ ] README.md updated with project info
- [ ] SETUP_GUIDE.md is complete
- [ ] QUICK_START.md for team members
- [ ] Code comments adequate
- [ ] API documentation updated

---

## 🔄 Backup & Recovery

- [ ] Firestore backup strategy documented
- [ ] Regular data export scheduled
- [ ] Disaster recovery plan created
- [ ] Secrets backup (service account key) secure

---

## ✨ Final Checks

- [ ] No `console.log()` in production code (or conditional)
- [ ] No `TODO:` comments remaining
- [ ] Git history clean (if using version control)
- [ ] Team informed of deployment
- [ ] Rollback plan ready

---

## 🎯 Post-Launch

- [ ] Monitor logs for 24 hours
- [ ] Check user feedback
- [ ] Monitor API response times
- [ ] Check Firestore usage
- [ ] Plan next features/improvements

---

## 📞 Emergency Contacts

- Firebase Support: https://firebase.google.com/support
- Google Cloud Support: https://cloud.google.com/support
- OpenAI API Support: https://help.openai.com

---

## 🎉 READY TO DEPLOY!

When all items checked:
1. Run: `npm run build`
2. Run: `firebase deploy`
3. Test live URL
4. Celebrate! 🚀

**Deployment Timestamp:** _____________  
**Deployed By:** _____________  
**Version:** 1.0.0-beta

---

**Keep this checklist for reference!**
