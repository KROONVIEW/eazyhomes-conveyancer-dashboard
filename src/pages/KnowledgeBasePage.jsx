import React, { useState } from 'react';
import ArticleList from '../components/KnowledgeBase/ArticleList';

const mockCategories = [
  'All',
  'SOPs',
  'FAQs',
  'Templates',
  'Guides',
];

const mockArticles = [
  { id: 1, title: 'How to Verify FICA Documents', category: 'SOPs', summary: 'Step-by-step for FICA verification.', content: 'Full SOP for FICA verification goes here...' },
  { id: 2, title: 'Offer to Purchase Template', category: 'Templates', summary: 'Downloadable OTP template.', content: 'Here is your Offer to Purchase template...' },
  { id: 3, title: 'What is a Sectional Title?', category: 'FAQs', summary: 'Explains sectional title properties.', content: 'A sectional title is a property divided into sections and common property. Owners have exclusive rights to their section and shared rights to common property.' },
  { id: 4, title: 'Bond Registration Guide', category: 'Guides', summary: 'Guide to registering a bond.', content: 'To register a bond, follow these steps: 1. Obtain approval, 2. Sign documents, 3. Lodge at Deeds Office, 4. Registration.' },
  { id: 5, title: 'How to Upload Documents', category: 'SOPs', summary: 'Uploading documents to the portal.', content: 'Go to Documents > Upload. Select your file and link to a matter.' },
  { id: 6, title: 'Power of Attorney Template', category: 'Templates', summary: 'Standard POA template.', content: 'This is a standard Power of Attorney template for conveyancing matters.' },
  { id: 7, title: 'What is FICA?', category: 'FAQs', summary: 'FICA explained for clients.', content: 'FICA is the Financial Intelligence Centre Act, requiring proof of identity and address for property transactions.' },
  { id: 8, title: 'Transfer Duty Guide', category: 'Guides', summary: 'Understanding transfer duty.', content: 'Transfer duty is a tax paid on property transfers. See SARS for rates and exemptions.' },
  { id: 9, title: 'Matter Opening SOP', category: 'SOPs', summary: 'How to open a new matter.', content: 'Navigate to Matters > New Matter. Complete all required fields and assign a team member.' },
  { id: 10, title: 'Deeds Office FAQ', category: 'FAQs', summary: 'Common Deeds Office questions.', content: 'Q: How long does registration take? A: 7-10 working days after lodgement.' },
  { id: 11, title: 'Mandate Letter Template', category: 'Templates', summary: 'Template for client mandates.', content: 'This is a sample mandate letter for instructing conveyancers.' },
  { id: 12, title: 'Rates Clearance Guide', category: 'Guides', summary: 'Obtaining rates clearance.', content: 'Request rates clearance from the municipality. Upload the certificate to the matter.' },
];

export default function KnowledgeBasePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = mockArticles.filter(a =>
    (selectedCategory === 'All' || a.category === selectedCategory) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[70vh] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r p-4">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          {mockCategories.map(cat => (
            <li key={cat}>
              <button
                className={`w-full text-left px-3 py-2 rounded transition-colors font-medium ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                onClick={() => { setSelectedCategory(cat); setSelectedArticle(null); }}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {!selectedArticle ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
              <ArticleList
                articles={filteredArticles}
                onSelect={setSelectedArticle}
                selectedId={selectedArticle?.id}
              />
            </div>
          ) : (
            <div>
              <button className="mb-4 text-blue-600 hover:underline text-sm" onClick={() => setSelectedArticle(null)}>&larr; Back to list</button>
              <h1 className="text-2xl font-bold mb-2">{selectedArticle.title}</h1>
              <div className="text-xs text-blue-600 font-medium mb-4">{selectedArticle.category}</div>
              <div className="prose max-w-none text-gray-800">{selectedArticle.content}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 