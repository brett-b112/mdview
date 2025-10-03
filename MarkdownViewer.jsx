import React, { useState, useEffect } from 'react';
import { Eye, Edit, FileText } from 'lucide-react';

const FileTreeNode = ({ name, node, level = 0, currentIndex, setCurrentIndex, setMode }) => {
  const [expanded, setExpanded] = useState(true);
  const isFolder = Object.keys(node).some(k => k !== '_files');
  const files = node._files || [];

  return (
    <div>
      {isFolder && (
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          <span className="text-gray-500">{expanded ? '▼' : '▶'}</span>
          <span className="text-gray-700 dark:text-gray-300">{name}/</span>
        </div>
      )}
      {expanded && (
        <>
          {files.map((file) => (
            <div
              key={file.index}
              onClick={() => {
                setCurrentIndex(file.index);
                setMode('view');
              }}
              className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm ${
                currentIndex === file.index ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
              }`}
              style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{file.name}</span>
            </div>
          ))}
          {isFolder &&
            Object.keys(node)
              .filter(k => k !== '_files')
              .map(key => (
                <FileTreeNode 
                  key={key} 
                  name={key} 
                  node={node[key]} 
                  level={level + 1}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  setMode={setMode}
                />
              ))}
        </>
      )}
    </div>
  );
};

export default function MarkdownViewer() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('view');
  const [loading, setLoading] = useState(true);

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

  const renderMarkdown = (md) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/```(\w+)?\n([\s\S]+?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded my-3 overflow-x-auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
      .replace(/^\- \[ \] (.*)$/gim, '<div class="flex items-start gap-2 my-1"><input type="checkbox" disabled class="mt-1"><span>$1</span></div>')
      .replace(/^\- \[x\] (.*)$/gim, '<div class="flex items-start gap-2 my-1"><input type="checkbox" disabled checked class="mt-1"><span class="line-through text-gray-500">$1</span></div>')
      .replace(/^\- (.*)$/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*)$/gim, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      .replace(/\n\n/g, '</p><p class="my-3">')
      .replace(/\n/g, '<br>');

    return `<div class="markdown-content"><p class="my-3">${html}</p></div>`;
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {files[currentIndex]?.name || 'No file selected'}
          </h2>
          {files.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  mode === 'edit'
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {mode === 'edit' ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{mode === 'edit' ? 'Preview' : 'Edit'}</span>
              </button>
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
            <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
