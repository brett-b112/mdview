import React, { useState, useEffect } from 'react';
import { Eye, Edit, FileText } from 'lucide-react';

const renderMarkdown = (md) => {
  if (!md) return '';
  
  let html = md;
  
  // Horizontal Rules
  html = html.replace(/^[\s]*([-*_]){3,}[\s]*$/gm, '<hr class="my-6 h-0.5 bg-gray-300 dark:bg-gray-700 border-0"/>');
  
  // Headers
  html = html
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');
  
  // Inline formatting
  html = html
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>');
  
  // Code blocks
  html = html
    .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded my-3 overflow-x-auto"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>');
  
  // Lists
  html = html
    .replace(/^\s*[-+*]\s+(.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\s*\d+\.\s+(.*)$/gim, '<li class="ml-4 list-decimal">$1</li>');
  
  // Blockquotes
  html = html
    .replace(/^>\s+(.*)$/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-3 italic">$1</blockquote>');
  
  // Links and Images
  html = html
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
  
  // Paragraphs
  html = html
    .split(/\n\n+/)
    .map(para => {
      if (!para.trim()) return '';
      if (para.startsWith('<')) return para;
      return `<p class="my-3">${para.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
  
  return `<div class="markdown-content prose dark:prose-invert max-w-none">${html}</div>`;
};

export default function MarkdownViewer() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('view');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        if (data.length > 0) {
          setContent(data[0].content);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading files:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (files[currentIndex]) {
      setContent(files[currentIndex].content);
    }
  }, [currentIndex, files]);

  const handleSave = async () => {
    if (!files[currentIndex]) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/files/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: files[currentIndex].path,
          content: content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      const newFiles = [...files];
      newFiles[currentIndex] = {
        ...newFiles[currentIndex],
        content: content
      };
      setFiles(newFiles);
      setMode('view');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Markdown Files</h1>
        </div>
        <div className="py-2">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">No markdown files found</div>
          ) : (
            files.map((file, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setMode('view');
                }}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-sm ${
                  currentIndex === index 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="truncate">{file.name}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {files[currentIndex]?.name || 'No file selected'}
          </h2>
          {files.length > 0 && (
            <div className="flex gap-2">
              {mode === 'edit' ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 disabled:opacity-50"
                  >
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => setMode('view')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setMode('edit')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900">
          {loading ? (
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No markdown files</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Add .md files to this directory to view them here
              </p>
            </div>
          ) : mode === 'edit' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start writing markdown..."
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
