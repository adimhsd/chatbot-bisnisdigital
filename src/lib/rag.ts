import { admin } from './firebase-admin';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';

/**
 * Converts a user query to a vector embedding using Google Gemini
 */
export async function queryToEmbedding(query: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel('text-embedding-004'),
      value: query,
    });
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding for query');
  }
}

/**
 * Retrieves relevant documents from Firestore based on vector similarity
 * For now, this performs a basic text search. In production, you'd use Firestore Vector Search.
 */
export async function retrieveRelevantDocuments(
  userQuery: string,
  topK: number = 5
): Promise<
  Array<{
    id: string;
    content: string;
    source: string;
    similarity?: number;
  }>
> {
  try {
    // Get the embedding for the user query
    const queryEmbedding = await queryToEmbedding(userQuery);

    // Query Firestore documents collection using Admin SDK
    const db = admin.firestore();
    const docsRef = db.collection('documents');

    // Note: Admin SDK doesn't support limit() in the same way as Client SDK v9 modular
    // It uses chaining: collection().limit().get()
    const querySnapshot = await docsRef.limit(topK * 2).get();

    const documents: Array<{
      id: string;
      content: string;
      source: string;
      embedding?: number[];
      similarity?: number;
    }> = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        content: doc.data().content,
        source: doc.data().source,
        embedding: doc.data().embedding,
      });
    });

    // Calculate similarity scores (simple cosine similarity)
    documents.forEach((doc) => {
      if (doc.embedding) {
        doc.similarity = cosineSimilarity(queryEmbedding, doc.embedding);
      }
    });

    // Sort by similarity and return top K
    return documents
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, topK)
      .map(({ embedding, ...rest }) => rest);
  } catch (error) {
    console.error('Error retrieving documents:', error);
    throw new Error('Failed to retrieve relevant documents');
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Build context from retrieved documents for the LLM prompt
 */
export function buildRAGContext(documents: any[]): string {
  if (documents.length === 0) {
    return 'Tidak ada dokumen relevan ditemukan.';
  }

  const context = documents
    .map(
      (doc, index) =>
        `Dokumen ${index + 1} (Sumber: ${doc.source}):\n${doc.content}`
    )
    .join('\n\n---\n\n');

  return context;
}
