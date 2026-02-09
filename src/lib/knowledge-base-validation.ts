// Knowledge base validation and duplicate detection
import { promises as fs } from 'fs';
import path from 'path';

const CHUNKS_FILE = path.join(process.cwd(), 'data', 'chatbot', 'knowledge-base', 'chunks.json');

interface Chunk {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  source?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  duplicates: Array<{ id: string; title: string; similarity: number }>;
}

/**
 * Calculate similarity between two strings (simple word overlap)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Validate knowledge base chunks
 */
export async function validateKnowledgeBase(): Promise<ValidationResult> {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    duplicates: [],
  };

  try {
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    const chunks: Chunk[] = JSON.parse(chunksData);

    // Check for duplicates
    const seen = new Map<string, Chunk>();
    for (const chunk of chunks) {
      // Check for exact duplicates
      if (seen.has(chunk.id)) {
        result.errors.push(`Duplicate ID: ${chunk.id}`);
        result.valid = false;
      }
      seen.set(chunk.id, chunk);

      // Check for similar content (potential duplicates)
      for (const [otherId, otherChunk] of seen.entries()) {
        if (otherId !== chunk.id) {
          const similarity = calculateSimilarity(chunk.content, otherChunk.content);
          if (similarity > 0.8) {
            result.duplicates.push({
              id: chunk.id,
              title: chunk.title,
              similarity: Math.round(similarity * 100),
            });
            result.warnings.push(
              `Chunk "${chunk.title}" is very similar (${Math.round(similarity * 100)}%) to "${otherChunk.title}"`
            );
          }
        }
      }
    }

    // Validate each chunk
    for (const chunk of chunks) {
      if (!chunk.id || !chunk.title || !chunk.content) {
        result.errors.push(`Chunk missing required fields: ${chunk.id || 'unknown'}`);
        result.valid = false;
      }

      if (chunk.content.length < 10) {
        result.warnings.push(`Chunk "${chunk.title}" has very short content (${chunk.content.length} chars)`);
      }

      if (chunk.content.length > 2000) {
        result.warnings.push(`Chunk "${chunk.title}" has very long content (${chunk.content.length} chars)`);
      }
    }

    return result;
  } catch (error: any) {
    result.valid = false;
    result.errors.push(`Failed to validate: ${error.message}`);
    return result;
  }
}

/**
 * Check for duplicate questions before adding
 */
export async function checkDuplicateQuestion(question: string, threshold: number = 0.7): Promise<Chunk | null> {
  try {
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    const chunks: Chunk[] = JSON.parse(chunksData);

    for (const chunk of chunks) {
      const similarity = calculateSimilarity(question, chunk.title);
      if (similarity >= threshold) {
        return chunk;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to check duplicate:', error);
    return null;
  }
}
