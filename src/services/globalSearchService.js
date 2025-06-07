// Global Search Service - Integrates with all existing services
import matterService from './matterService';
import documentService from './documentService';
import communicationService from './communicationService';

class GlobalSearchService {
  constructor() {
    this.searchCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    this.maxHistoryItems = 10;
    this.searchIndex = {
      matters: [],
      clients: [],
      documents: [],
      messages: [],
      tasks: []
    };
    this.lastIndexUpdate = null;
    this.indexUpdateInterval = 30 * 1000; // 30 seconds
  }

  // Build search index from all data sources
  async buildSearchIndex() {
    try {
      console.log('🔍 Building global search index...');
      
      // Get all matters
      const matters = await matterService.getAllMatters();
      this.searchIndex.matters = matters.map(matter => ({
        id: matter.id || matter.firebaseId,
        title: matter.address || matter.title,
        subtitle: matter.client,
        type: 'matters',
        data: matter,
        searchText: `${matter.address || matter.title} ${matter.client} ${matter.type} ${matter.assignedTo} ${matter.status}`.toLowerCase(),
        priority: this.calculateMatterPriority(matter),
        updatedAt: matter.updatedAt
      }));

      // Extract clients from matters
      const clientsSet = new Set();
      matters.forEach(matter => {
        if (matter.client) {
          clientsSet.add(JSON.stringify({
            name: matter.client,
            matterId: matter.id || matter.firebaseId,
            matterAddress: matter.address || matter.title
          }));
        }
        // Also extract from detailed client data if available
        if (matter.clients && Array.isArray(matter.clients)) {
          matter.clients.forEach(client => {
            clientsSet.add(JSON.stringify({
              name: client.name,
              idNumber: client.idNumber,
              email: client.email,
              phone: client.phone,
              matterId: matter.id || matter.firebaseId,
              matterAddress: matter.address || matter.title
            }));
          });
        }
      });

      this.searchIndex.clients = Array.from(clientsSet).map((clientStr, index) => {
        const client = JSON.parse(clientStr);
        return {
          id: `client_${index}`,
          title: client.name,
          subtitle: client.matterAddress,
          type: 'clients',
          data: client,
          searchText: `${client.name} ${client.idNumber || ''} ${client.email || ''} ${client.phone || ''}`.toLowerCase(),
          priority: 2,
          updatedAt: new Date().toISOString()
        };
      });

      // Get documents from matters
      const documentsArray = [];
      matters.forEach(matter => {
        if (matter.documents && Array.isArray(matter.documents)) {
          matter.documents.forEach(doc => {
            documentsArray.push({
              ...doc,
              matterId: matter.id || matter.firebaseId,
              matterAddress: matter.address || matter.title
            });
          });
        }
      });

      this.searchIndex.documents = documentsArray.map(doc => ({
        id: doc.id,
        title: doc.fileName || doc.type || 'Document',
        subtitle: doc.matterAddress,
        type: 'documents',
        data: doc,
        searchText: `${doc.fileName || ''} ${doc.type || ''} ${doc.matterAddress}`.toLowerCase(),
        priority: 1,
        updatedAt: doc.uploadedAt || doc.createdAt
      }));

      // Build tasks from matter assignments and templates
      const tasksArray = [];
      matters.forEach(matter => {
        if (matter.assignment && matter.assignment.staff) {
          matter.assignment.staff.forEach(staffId => {
            tasksArray.push({
              id: `task_${matter.id}_${staffId}`,
              title: `Assigned to matter: ${matter.address || matter.title}`,
              subtitle: `Staff: ${staffId}`,
              type: 'tasks',
              matterId: matter.id || matter.firebaseId,
              staffId: staffId,
              status: matter.status,
              priority: matter.urgent ? 'high' : 'normal'
            });
          });
        }
      });

      this.searchIndex.tasks = tasksArray.map(task => ({
        id: task.id,
        title: task.title,
        subtitle: task.subtitle,
        type: 'tasks',
        data: task,
        searchText: `${task.title} ${task.subtitle} ${task.status}`.toLowerCase(),
        priority: task.priority === 'high' ? 3 : 1,
        updatedAt: new Date().toISOString()
      }));

      this.lastIndexUpdate = Date.now();
      console.log('✅ Search index built successfully:', {
        matters: this.searchIndex.matters.length,
        clients: this.searchIndex.clients.length,
        documents: this.searchIndex.documents.length,
        tasks: this.searchIndex.tasks.length
      });

    } catch (error) {
      console.error('❌ Error building search index:', error);
      // Fallback to empty index
      this.searchIndex = { matters: [], clients: [], documents: [], messages: [], tasks: [] };
    }
  }

  // Calculate matter priority for search ranking
  calculateMatterPriority(matter) {
    let priority = 1;
    
    // Urgent matters get higher priority
    if (matter.urgent) priority += 2;
    
    // Recent matters get higher priority
    const daysSinceUpdate = (Date.now() - new Date(matter.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 1) priority += 2;
    else if (daysSinceUpdate < 7) priority += 1;
    
    // Active status gets higher priority
    if (matter.status === 'In Progress' || matter.status === 'Active') priority += 1;
    
    return priority;
  }

  // Check if index needs updating
  shouldUpdateIndex() {
    return !this.lastIndexUpdate || 
           (Date.now() - this.lastIndexUpdate) > this.indexUpdateInterval;
  }

  // Perform global search
  async search(query, options = {}) {
    const {
      limit = 20,
      categories = ['matters', 'clients', 'documents', 'tasks'],
      includeRecent = true
    } = options;

    // Return empty results for very short queries
    if (!query || query.trim().length < 2) {
      return this.getRecentSearchResults(includeRecent);
    }

    const searchKey = `${query}_${categories.join(',')}_${limit}`;
    
    // Check cache first
    if (this.searchCache.has(searchKey)) {
      const cached = this.searchCache.get(searchKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('🎯 Returning cached search results');
        return cached.results;
      }
    }

    // Update index if needed
    if (this.shouldUpdateIndex()) {
      await this.buildSearchIndex();
    }

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);
    
    console.log('🔍 Performing global search for:', query);

    const results = {
      matters: [],
      clients: [],
      documents: [],
      tasks: [],
      messages: []
    };

    // Search each category
    categories.forEach(category => {
      if (this.searchIndex[category]) {
        const categoryResults = this.searchIndex[category]
          .map(item => ({
            ...item,
            relevanceScore: this.calculateRelevanceScore(item, normalizedQuery, queryWords)
          }))
          .filter(item => item.relevanceScore > 0)
          .sort((a, b) => {
            // Sort by relevance score first, then priority, then recency
            if (b.relevanceScore !== a.relevanceScore) {
              return b.relevanceScore - a.relevanceScore;
            }
            if (b.priority !== a.priority) {
              return b.priority - a.priority;
            }
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          })
          .slice(0, Math.ceil(limit / categories.length))
          .map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            type: item.type,
            data: item.data,
            highlight: this.generateHighlight(item.title, normalizedQuery),
            relevanceScore: item.relevanceScore
          }));

        results[category] = categoryResults;
      }
    });

    // Add to search history
    this.addToSearchHistory(query);

    // Cache results
    this.searchCache.set(searchKey, {
      results,
      timestamp: Date.now()
    });

    // Clean old cache entries
    this.cleanCache();

    console.log('✅ Search completed:', {
      query,
      totalResults: Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    });

    return results;
  }

  // Calculate relevance score for search ranking
  calculateRelevanceScore(item, query, queryWords) {
    let score = 0;
    const searchText = item.searchText;
    const title = item.title.toLowerCase();

    // Exact title match gets highest score
    if (title === query) {
      score += 100;
    }
    // Title starts with query
    else if (title.startsWith(query)) {
      score += 80;
    }
    // Title contains query
    else if (title.includes(query)) {
      score += 60;
    }

    // Check for word matches
    queryWords.forEach(word => {
      if (word.length < 2) return;
      
      // Title word match
      if (title.includes(word)) {
        score += 30;
      }
      // Search text word match
      else if (searchText.includes(word)) {
        score += 10;
      }
    });

    // Boost score based on item priority
    score += item.priority * 5;

    // Boost recent items
    const daysSinceUpdate = (Date.now() - new Date(item.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 1) score += 10;
    else if (daysSinceUpdate < 7) score += 5;

    return score;
  }

  // Generate highlight for search results
  generateHighlight(text, query) {
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return query.split(' ')[0];
    return text.substring(index, index + query.length);
  }

  // Get recent search results for empty queries
  getRecentSearchResults(includeRecent) {
    if (!includeRecent) {
      return { matters: [], clients: [], documents: [], tasks: [], messages: [] };
    }

    // Return recent items from each category
    const recentResults = {
      matters: this.searchIndex.matters
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          type: item.type,
          data: item.data,
          highlight: ''
        })),
      clients: this.searchIndex.clients.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        type: item.type,
        data: item.data,
        highlight: ''
      })),
      documents: this.searchIndex.documents
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 2)
        .map(item => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          type: item.type,
          data: item.data,
          highlight: ''
        })),
      tasks: this.searchIndex.tasks.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        type: item.type,
        data: item.data,
        highlight: ''
      })),
      messages: []
    };

    return recentResults;
  }

  // Add search to history
  addToSearchHistory(query) {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    // Remove if already exists
    this.searchHistory = this.searchHistory.filter(item => item !== trimmedQuery);
    
    // Add to beginning
    this.searchHistory.unshift(trimmedQuery);
    
    // Limit history size
    this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    
    // Save to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  // Get search history
  getSearchHistory() {
    return this.searchHistory;
  }

  // Clean old cache entries
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.searchCache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        this.searchCache.delete(key);
      }
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query) {
    if (!query || query.length < 2) {
      return this.searchHistory.slice(0, 5);
    }

    const suggestions = new Set();
    const normalizedQuery = query.toLowerCase();

    // Add matching items from search index
    Object.values(this.searchIndex).flat().forEach(item => {
      if (item.title.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(item.title);
      }
    });

    // Add matching search history
    this.searchHistory.forEach(historyItem => {
      if (historyItem.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(historyItem);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }

  // Initialize the service
  async initialize() {
    console.log('🚀 Initializing Global Search Service...');
    await this.buildSearchIndex();
    console.log('✅ Global Search Service ready');
  }
}

// Create and export singleton instance
const globalSearchService = new GlobalSearchService();

export default globalSearchService; 