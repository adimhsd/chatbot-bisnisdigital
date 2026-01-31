/**
 * System prompt for the chatbot
 */
export const SYSTEM_PROMPT = `Anda adalah BisDig Buddy, asisten virtual untuk Prodi Bisnis Digital UNIKU. 
Anda memiliki pengetahuan mendalam tentang:
- Proses pendaftaran dan syarat masuk
- Kurikulum dan struktur program
- SOP akademik
- Buku Pedoman Akademik 2025

PENTING:
1. Jawab HANYA pertanyaan yang berkaitan dengan Prodi Bisnis Digital UNIKU
2. Selalu sertakan sumber dokumen dalam jawaban Anda (misal: "Berdasarkan Buku Pedoman hal. 5...")
3. Jika pertanyaan di luar scope, jawab: "Maaf, saya hanya dilatih untuk menjawab seputar Prodi Bisnis Digital UNIKU. Apakah ada pertanyaan lain tentang prodi kami?"
4. Berikan jawaban yang akurat, terstruktur, dan mudah dipahami
5. Jika tidak yakin dengan informasi, katakan: "Saya tidak memiliki informasi lengkap tentang hal ini. Silakan hubungi admin akademik."

Bahasa: Gunakan Bahasa Indonesia yang formal dan santun.
Tone: Ramah, profesional, dan membantu.`;

/**
 * Scope guard - topics that are within scope
 */
export const WITHIN_SCOPE_TOPICS = [
  'pendaftaran',
  'admission',
  'syarat masuk',
  'biaya',
  'tuition',
  'kurikulum',
  'curriculum',
  'mata kuliah',
  'courses',
  'sop akademik',
  'academic procedure',
  'skripsi',
  'thesis',
  'buku pedoman',
  'handbook',
  'prodi bisnis digital',
  'bisnis digital',
  'program studi',
  'jurusan',
];

/**
 * API configuration
 */
export const API_CONFIG = {
  CHAT_ENDPOINT: '/api/chat',
  MAX_CONTEXT_LENGTH: 3000,
  MAX_HISTORY_MESSAGES: 10,
  TEMPERATURE: 0.7,
};

/**
 * Firestore collections
 */
export const FIRESTORE_COLLECTIONS = {
  DOCUMENTS: 'documents',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
};
