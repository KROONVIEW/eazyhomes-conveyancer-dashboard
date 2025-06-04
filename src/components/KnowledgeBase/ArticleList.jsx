import React from 'react';

export default function ArticleList({ articles, onSelect, selectedId }) {
  return (
    <ul className="space-y-4">
      {articles.map(article => (
        <li
          key={article.id}
          className={`bg-white rounded shadow p-4 cursor-pointer transition-colors ${selectedId === article.id ? 'ring-2 ring-blue-500' : 'hover:bg-blue-50'}`}
          onClick={() => onSelect(article)}
        >
          <h3 className="text-lg font-semibold mb-1">{article.title}</h3>
          <div className="text-xs text-blue-600 font-medium mb-1">{article.category}</div>
          <p className="text-gray-600 text-sm">{article.summary}</p>
        </li>
      ))}
      {articles.length === 0 && (
        <li className="text-gray-400 text-center py-8">No articles found.</li>
      )}
    </ul>
  );
} 