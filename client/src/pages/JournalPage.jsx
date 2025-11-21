import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, Trash2, Edit, X } from 'react-feather';

const KEY = 'cbt_journal';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export default function JournalPage() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mood, setMood] = useState('neutral');
  const textareaRef = useRef(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem(KEY) || '[]');
    setEntries(savedEntries);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const saveEntry = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const now = new Date().toISOString();
    
    if (editingId) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === editingId 
          ? { ...entry, text: text.trim(), updatedAt: now }
          : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem(KEY, JSON.stringify(updatedEntries));
      setEditingId(null);
    } else {
      // Create new entry
      const newEntry = { 
        id: Date.now(), 
        text: text.trim(), 
        mood,
        createdAt: now,
        updatedAt: now
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem(KEY, JSON.stringify(updatedEntries));
    }
    
    setText('');
    setMood('neutral');
  };

  const editEntry = (entry) => {
    setText(entry.text);
    setMood(entry.mood || 'neutral');
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      localStorage.setItem(KEY, JSON.stringify(updatedEntries));
      if (editingId === id) {
        setEditingId(null);
        setText('');
      }
    }
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindful-journal-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter(entry => 
    entry.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      anxious: 'bg-purple-100 text-purple-800',
      neutral: 'bg-gray-100 text-gray-800',
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mindful Journal</h1>
        <p className="text-gray-600">Reflect on your thoughts and feelings in a safe, private space</p>
      </header>

      <form onSubmit={saveEntry} className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
        <div className="mb-4">
          <label htmlFor="journal-entry" className="block text-sm font-medium text-gray-700 mb-2">
            {editingId ? 'Edit your entry' : 'How are you feeling today?'}
          </label>
          <textarea
            ref={textareaRef}
            id="journal-entry"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts, feelings, or anything on your mind..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200 resize-none min-h-[120px]"
            rows="4"
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Mood:</span>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            >
              <option value="neutral">😐 Neutral</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="angry">😠 Angry</option>
              <option value="anxious">😰 Anxious</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setText('');
                  setMood('neutral');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <X size={16} className="inline mr-1" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center"
              disabled={!text.trim()}
            >
              <Save size={16} className="inline mr-1" />
              {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </div>
      </form>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Journal Entries</h2>
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>

        {entries.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={exportAll}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Download size={14} className="mr-1" />
              Export All
            </button>
          </div>
        )}

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">
              {entries.length === 0 
                ? "No entries yet. Write your first journal entry above!"
                : "No entries match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div 
                key={entry.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
                        {entry.mood === 'happy' && '😊 Happy'}
                        {entry.mood === 'sad' && '😢 Sad'}
                        {entry.mood === 'angry' && '😠 Angry'}
                        {entry.mood === 'anxious' && '😰 Anxious'}
                        {(!entry.mood || entry.mood === 'neutral') && '😐 Neutral'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.updatedAt || entry.createdAt)}
                      {entry.updatedAt !== entry.createdAt && ' (edited)'}
                    </div>
                  </div>
                  <p className="text-gray-800 whitespace-pre-line">{entry.text}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                      onClick={() => editEntry(entry)}
                      className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Edit entry"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}