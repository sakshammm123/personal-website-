'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  description?: string;
  createdBy?: string;
}

export default function KnowledgeBaseAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chunks' | 'versions'>('chunks');
  const [editingChunk, setEditingChunk] = useState<Chunk | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Chunk & { competencies?: string[] }>>({
    title: '',
    content: '',
    tags: [],
    source: 'manual',
    competencies: []
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (status === 'authenticated') {
      loadChunks();
      loadVersions();
    }
  }, [status, router]);

  const loadChunks = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/knowledge-base?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/knowledge-base';
      const res = await fetch(url);
      const data = await res.json();
      setChunks(data.chunks || []);
    } catch (err) {
      console.error('Failed to load chunks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    try {
      const res = await fetch('/api/admin/knowledge-base?action=versions');
      const data = await res.json();
      setVersions(data.versions || []);
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadChunks();
  };

  const handleDelete = async (chunkId: string) => {
    if (!confirm('Delete this chunk? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/knowledge-base?id=${chunkId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadChunks();
        alert('Chunk deleted successfully');
      }
    } catch (err) {
      alert('Failed to delete chunk');
    }
  };

  const handleEdit = (chunk: Chunk) => {
    setEditingChunk(chunk);
    setFormData({
      title: chunk.title,
      content: chunk.content,
      tags: chunk.tags || [],
      source: chunk.source || 'manual',
      competencies: (chunk as any).competencies || []
    });
    setShowCreateForm(true);
  };

  const handleCreate = () => {
    setEditingChunk(null);
    setFormData({
      title: '',
      content: '',
      tags: [],
      source: 'manual',
      competencies: []
    });
    setShowCreateForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }

    try {
      if (editingChunk) {
        // Update existing chunk
        const res = await fetch('/api/admin/knowledge-base', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chunkId: editingChunk.id,
            updates: {
              title: formData.title,
              content: formData.content,
              tags: formData.tags || [],
              source: formData.source || 'manual',
              competencies: formData.competencies || []
            }
          })
        });
        if (res.ok) {
          await loadChunks();
          setShowCreateForm(false);
          setEditingChunk(null);
          alert('Chunk updated successfully');
        } else {
          alert('Failed to update chunk');
        }
      } else {
        // Create new chunk
        const res = await fetch('/api/admin/knowledge-base', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-chunk',
            chunk: {
              title: formData.title,
              content: formData.content,
              tags: formData.tags || [],
              source: formData.source || 'manual',
              competencies: formData.competencies || []
            }
          })
        });
        if (res.ok) {
          await loadChunks();
          setShowCreateForm(false);
          setFormData({
            title: '',
            content: '',
            tags: [],
            source: 'manual',
            competencies: []
          });
          alert('Chunk created successfully');
        } else {
          alert('Failed to create chunk');
        }
      }
    } catch (err) {
      alert('Failed to save chunk');
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm('Restore this version? Current version will be backed up first.')) return;
    
    try {
      const res = await fetch('/api/admin/knowledge-base/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });
      if (res.ok) {
        await loadChunks();
        await loadVersions();
        alert('Version restored successfully');
      }
    } catch (err) {
      alert('Failed to restore version');
    }
  };

  const handleCreateVersion = async () => {
    const description = prompt('Version description (optional):');
    try {
      const res = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-version', description }),
      });
      if (res.ok) {
        await loadVersions();
        alert('Version created successfully');
      }
    } catch (err) {
      alert('Failed to create version');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-brown-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50 text-brown-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-brown-600 hover:text-brown-900 text-sm mb-2 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-semibold text-brown-900 mb-2">📚 Knowledge Base Management</h1>
            <p className="text-brown-600">Manage and version your chatbot knowledge base</p>
          </div>
          <Link
            href="/admin/logout"
            className="px-4 py-2 bg-brown-500 text-cream-50 rounded-md hover:bg-brown-600 transition-colors font-medium"
          >
            Logout
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-brown-200 mb-6">
          <nav className="flex gap-4">
            {(['chunks', 'versions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-brown-900 border-b-2 border-brown-600'
                    : 'text-brown-600 hover:text-brown-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'chunks' && `(${chunks.length})`}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'chunks' ? (
          <>
            {/* Search and Add Button */}
            <div className="mb-6 flex gap-2 items-center">
              <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chunks..."
                  className="flex-1 rounded-md border border-brown-200 bg-cream-50 px-4 py-2 text-brown-900"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700"
                >
                  Search
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      loadChunks();
                    }}
                    className="px-6 py-2 bg-cream-200 text-brown-700 rounded-md hover:bg-cream-300"
                  >
                    Clear
                  </button>
                )}
              </form>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 font-medium whitespace-nowrap"
              >
                + Add Chunk
              </button>
            </div>

            {/* Chunks List */}
            <div className="space-y-4">
              {chunks.length === 0 ? (
                <div className="text-center py-12 text-brown-600">No chunks found</div>
              ) : (
                chunks.map((chunk) => (
                  <div key={chunk.id} className="professional-card">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-brown-900">{chunk.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(chunk)}
                          className="text-brown-600 hover:text-brown-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(chunk.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-brown-700 mb-2 line-clamp-3">{chunk.content}</p>
                    {chunk.tags && chunk.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-brown-600 font-medium">Tags:</span>
                        {chunk.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-brown-100 text-brown-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {chunk.competencies && chunk.competencies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-brown-600 font-medium">Competencies:</span>
                        {chunk.competencies.map((comp) => (
                          <span
                            key={comp}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                    {chunk.source && (
                      <p className="text-xs text-brown-500 mt-2">Source: {chunk.source}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-cream-50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <h2 className="text-2xl font-bold text-brown-900 mb-4">
                    {editingChunk ? 'Edit Chunk' : 'Create New Chunk'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-md border border-brown-200 bg-white px-4 py-2 text-brown-900"
                        placeholder="Enter chunk title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Content *
                      </label>
                      <textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full rounded-md border border-brown-200 bg-white px-4 py-2 text-brown-900"
                        rows={8}
                        placeholder="Enter chunk content"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                        onChange={(e) => {
                          const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          setFormData({ ...formData, tags });
                        }}
                        className="w-full rounded-md border border-brown-200 bg-white px-4 py-2 text-brown-900"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Source
                      </label>
                      <input
                        type="text"
                        value={formData.source || 'manual'}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="w-full rounded-md border border-brown-200 bg-white px-4 py-2 text-brown-900"
                        placeholder="manual, star_stories, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Competencies (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.competencies) ? formData.competencies.join(', ') : ''}
                        onChange={(e) => {
                          const competencies = e.target.value.split(',').map(c => c.trim()).filter(Boolean);
                          setFormData({ ...formData, competencies });
                        }}
                        className="w-full rounded-md border border-brown-200 bg-white px-4 py-2 text-brown-900"
                        placeholder="Decision Making, Communication, etc."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 font-medium"
                    >
                      {editingChunk ? 'Update' : 'Create'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingChunk(null);
                        setFormData({
                          title: '',
                          content: '',
                          tags: [],
                          source: 'manual',
                          competencies: []
                        });
                      }}
                      className="px-6 py-2 bg-cream-200 text-brown-700 rounded-md hover:bg-cream-300 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-brown-900">Version History</h2>
              <button
                onClick={handleCreateVersion}
                className="px-4 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700"
              >
                Create Version
              </button>
            </div>

            <div className="space-y-4">
              {versions.length === 0 ? (
                <div className="text-center py-12 text-brown-600">No versions yet</div>
              ) : (
                versions.map((version) => (
                  <div key={version.id} className="professional-card">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-brown-900">{version.id}</h3>
                        <p className="text-sm text-brown-600">
                          {new Date(version.timestamp).toLocaleString()}
                        </p>
                        {version.description && (
                          <p className="text-sm text-brown-700 mt-1">{version.description}</p>
                        )}
                        {version.createdBy && (
                          <p className="text-xs text-brown-500 mt-1">By: {version.createdBy}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRestore(version.id)}
                        className="px-4 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 text-sm"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
