// Knowledge base versioning system
import { promises as fs } from 'fs';
import path from 'path';

const KNOWLEDGE_BASE_DIR = path.join(process.cwd(), 'data', 'chatbot', 'knowledge-base');
const CHUNKS_FILE = path.join(KNOWLEDGE_BASE_DIR, 'chunks.json');
const VERSIONS_DIR = path.join(KNOWLEDGE_BASE_DIR, 'versions');

interface Chunk {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  source?: string;
  competencies?: string[];
}

interface Version {
  id: string;
  timestamp: string;
  chunks: Chunk[];
  description?: string;
  createdBy?: string;
}

/**
 * Ensure versions directory exists
 */
async function ensureVersionsDir() {
  try {
    await fs.mkdir(VERSIONS_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create versions directory:', error);
  }
}

/**
 * Create a version snapshot of the current knowledge base
 */
export async function createVersion(description?: string, createdBy?: string): Promise<Version> {
  await ensureVersionsDir();
  
  try {
    const chunksData = await fs.readFile(CHUNKS_FILE, 'utf8');
    const chunks: Chunk[] = JSON.parse(chunksData);
    
    const version: Version = {
      id: `v_${Date.now()}`,
      timestamp: new Date().toISOString(),
      chunks: JSON.parse(JSON.stringify(chunks)), // Deep copy
      description,
      createdBy,
    };

    const versionFile = path.join(VERSIONS_DIR, `${version.id}.json`);
    await fs.writeFile(versionFile, JSON.stringify(version, null, 2), 'utf8');

    // Keep only last 50 versions
    const versionFiles = await fs.readdir(VERSIONS_DIR);
    if (versionFiles.length > 50) {
      const sorted = versionFiles.sort().slice(0, versionFiles.length - 50);
      for (const file of sorted) {
        await fs.unlink(path.join(VERSIONS_DIR, file));
      }
    }

    return version;
  } catch (error) {
    console.error('Failed to create version:', error);
    throw error;
  }
}

/**
 * List all versions
 */
export async function listVersions(): Promise<Version[]> {
  await ensureVersionsDir();
  
  try {
    const files = await fs.readdir(VERSIONS_DIR);
    const versions: Version[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(VERSIONS_DIR, file), 'utf8');
        versions.push(JSON.parse(content));
      }
    }

    return versions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Failed to list versions:', error);
    return [];
  }
}

/**
 * Restore a version (rollback)
 */
export async function restoreVersion(versionId: string): Promise<void> {
  await ensureVersionsDir();
  
  try {
    const versionFile = path.join(VERSIONS_DIR, `${versionId}.json`);
    const content = await fs.readFile(versionFile, 'utf8');
    const version: Version = JSON.parse(content);

    // Create backup of current before restoring
    await createVersion(`Backup before restoring ${versionId}`);

    // Restore chunks
    await fs.writeFile(CHUNKS_FILE, JSON.stringify(version.chunks, null, 2), 'utf8');

    console.log(`✅ Restored knowledge base to version ${versionId}`);
  } catch (error) {
    console.error('Failed to restore version:', error);
    throw error;
  }
}

/**
 * Get version details
 */
export async function getVersion(versionId: string): Promise<Version | null> {
  await ensureVersionsDir();
  
  try {
    const versionFile = path.join(VERSIONS_DIR, `${versionId}.json`);
    const content = await fs.readFile(versionFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to get version:', error);
    return null;
  }
}
