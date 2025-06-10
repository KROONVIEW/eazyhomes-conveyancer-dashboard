const fs = require('fs');
const path = require('path');

// Files and their unused variables/imports to clean
const cleanupTasks = [
  {
    file: 'src/pages/MessagesPage.jsx',
    removals: [
      "import broadcastService from '../services/broadcastService';",
      "const avatarList = [",
      "const [lastReadMessages, setLastReadMessages] = useState({});",
      "const hasValidChatData = dynamicChatData[activeConversationId];"
    ]
  },
  {
    file: 'src/services/documentService.js',
    removals: [
      "  collection,",
      "  addDoc,",
      "  updateDoc,", 
      "  doc,",
      "  getDocs,",
      "  query,",
      "  where,",
      "  orderBy,",
      "  serverTimestamp,",
      "  ref,",
      "  uploadBytes,",
      "  getDownloadURL,",
      "const { db, storage } = require('./firebase');"
    ]
  },
  {
    file: 'src/services/globalSearchService.js',
    removals: [
      "import documentService from './documentService';",
      "import communicationService from './communicationService';"
    ]
  },
  {
    file: 'src/services/matterService.js',
    removals: [
      "  deleteDoc,"
    ]
  },
  {
    file: 'src/services/firebase.js',
    removals: [
      "const isDevelopment = process.env.NODE_ENV === 'development';"
    ]
  }
];

function cleanupFile(task) {
  try {
    const fullPath = path.join(__dirname, task.file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    let removedCount = 0;
    
    task.removals.forEach(removal => {
      if (content.includes(removal)) {
        // Handle multi-line removals (like arrays)
        if (removal.includes('[')) {
          const startIndex = content.indexOf(removal);
          if (startIndex !== -1) {
            // Find the closing bracket
            let bracketCount = 0;
            let endIndex = startIndex;
            for (let i = startIndex; i < content.length; i++) {
              if (content[i] === '[') bracketCount++;
              if (content[i] === ']') bracketCount--;
              if (bracketCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
            // Find the end of the statement (semicolon)
            while (endIndex < content.length && content[endIndex] !== ';') {
              endIndex++;
            }
            if (content[endIndex] === ';') endIndex++;
            
            const toRemove = content.substring(startIndex, endIndex);
            content = content.replace(toRemove, '');
            removedCount++;
          }
        } else {
          content = content.replace(removal, '');
          removedCount++;
        }
      }
    });
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/^\s*\n/gm, '');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`✅ ${task.file}: Removed ${removedCount} unused items`);
    
  } catch (error) {
    console.error(`❌ Error processing ${task.file}:`, error.message);
  }
}

console.log('🧹 Starting unused variables/imports cleanup...\n');

cleanupTasks.forEach(cleanupFile);

console.log('\n✨ Unused variables cleanup completed!'); 