/**
 * BisDig Buddy - Data Ingestion Script
 * Mengkonversi PDF/dokumen text menjadi embeddings dan menyimpannya di Firestore
 *
 * Usage:
 *   node ingest.js --file path/to/file.pdf --source "Buku Pedoman 2025"
 *   node ingest.js --dir path/to/documents --source "SOP Akademik"
 */

import * as fs from 'fs';
import * as path from 'path';
import admin from 'firebase-admin';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath =
  process.env.FIREBASE_ADMIN_SDK_KEY || './firebase-service-account.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    `Firebase service account file not found at: ${serviceAccountPath}`
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Split text into chunks of roughly equal size
 */
function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  const words = text.split(/\s+/);

  let currentChunk = [];
  let currentLength = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentLength += word.length + 1;

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(' '));

      // Keep last few words for overlap
      const overlapWords = Math.ceil(overlap / 5);
      currentChunk = currentChunk.slice(-overlapWords);
      currentLength = currentChunk.reduce((sum, w) => sum + w.length, 0);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

/**
 * Generate embedding for a text chunk using OpenAI
 */
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Process a single document and save embeddings to Firestore
 */
async function processDocument(filePath, source, batchSize = 10) {
  console.log(`Processing file: ${filePath}`);
  console.log(`Source: ${source}`);

  // Read file content
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    return;
  }

  // Clean up text
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  // Split into chunks
  console.log('Creating text chunks...');
  const chunks = chunkText(content);
  console.log(`Created ${chunks.length} chunks`);

  // Process chunks in batches
  const batch = db.batch();
  let batchCount = 0;
  let processedCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Generate embedding
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);
    let embedding;
    try {
      embedding = await generateEmbedding(chunk);
    } catch (error) {
      console.error(`Failed to generate embedding for chunk ${i + 1}:`, error);
      continue;
    }

    // Add to batch
    const docRef = db.collection('documents').doc();
    batch.set(docRef, {
      content: chunk,
      source: source,
      embedding: embedding,
      chunkIndex: i,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        fileName: path.basename(filePath),
        totalChunks: chunks.length,
        textLength: chunk.length,
      },
    });

    batchCount++;
    processedCount++;

    // Commit batch every 10 documents
    if (batchCount >= batchSize) {
      try {
        await batch.commit();
        console.log(`✓ Saved ${batchCount} documents to Firestore`);
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }

      // Reset batch
      batchCount = 0;
    }

    // Rate limiting to avoid hitting API limits
    if (i < chunks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Commit remaining documents
  if (batchCount > 0) {
    try {
      await batch.commit();
      console.log(`✓ Saved ${batchCount} remaining documents to Firestore`);
    } catch (error) {
      console.error('Error saving remaining documents:', error);
    }
  }

  console.log(`✓ Completed processing ${processedCount} chunks`);
}

/**
 * Process all documents in a directory
 */
async function processDirectory(dirPath, source, extensions = ['.txt', '.md', '.pdf']) {
  console.log(`Processing directory: ${dirPath}`);

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (extensions.includes(ext)) {
          await processDocument(filePath, source);
          console.log('---');
        }
      }
    }
  } catch (error) {
    console.error('Error processing directory:', error);
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  let filePath = null;
  let dirPath = null;
  let source = 'BisDig Knowledge Base';

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && i + 1 < args.length) {
      filePath = args[i + 1];
      i++;
    } else if (args[i] === '--dir' && i + 1 < args.length) {
      dirPath = args[i + 1];
      i++;
    } else if (args[i] === '--source' && i + 1 < args.length) {
      source = args[i + 1];
      i++;
    }
  }

  if (!filePath && !dirPath) {
    console.log('BisDig Buddy - Data Ingestion Script');
    console.log('');
    console.log('Usage:');
    console.log(
      '  node ingest.js --file path/to/file.txt --source "Source Name"'
    );
    console.log(
      '  node ingest.js --dir path/to/documents --source "Source Name"'
    );
    console.log('');
    console.log('Example:');
    console.log(
      '  node ingest.js --file docs/handbook.txt --source "Buku Pedoman 2025"'
    );
    console.log(
      '  node ingest.js --dir docs/sop --source "SOP Akademik"'
    );
    process.exit(0);
  }

  try {
    console.log('Starting data ingestion...\n');

    if (filePath) {
      await processDocument(filePath, source);
    } else if (dirPath) {
      await processDirectory(dirPath, source);
    }

    console.log('\n✓ Data ingestion completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during ingestion:', error);
    process.exit(1);
  }
}

main();
