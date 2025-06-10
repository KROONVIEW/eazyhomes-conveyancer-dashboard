const fs = require('fs');
const path = require('path');

// Files to process
const filesToClean = [
  'src/components/messaging/ChatWindow.jsx',
  'src/components/messaging/MessagesFAB.jsx',
  'src/components/settings/IntegrationSettings.jsx',
  'src/hooks/useFinancialAnalytics.js',
  'src/hooks/useMatterWorkflow.js',
  'src/pages/MattersPage.jsx',
  'src/pages/MessagesPage.jsx',
  'src/services/financialAnalyticsService.js',
  'src/services/firebase.js',
  'src/services/globalSearchService.js',
  'src/services/matterService.js',
  'src/services/messageService.js',
  'src/utils/audioUtils.js'
];

function cleanConsoleStatements(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Count original console statements
    const originalCount = (content.match(/console\.(log|error|warn|info|debug)/g) || []).length;
    
    // Remove console.log statements
    content = content.replace(/\s*console\.log\([^)]*\);\s*/g, '');
    content = content.replace(/\s*console\.log\([^)]*\)\s*$/gm, '');
    
    // Remove console.error statements (replace with comments)
    content = content.replace(/\s*console\.error\([^)]*\);\s*/g, ' // Error logging removed for production\n');
    
    // Remove console.warn statements
    content = content.replace(/\s*console\.warn\([^)]*\);\s*/g, '');
    
    // Remove console.info statements
    content = content.replace(/\s*console\.info\([^)]*\);\s*/g, '');
    
    // Remove console.debug statements
    content = content.replace(/\s*console\.debug\([^)]*\);\s*/g, '');
    
    // Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Count remaining console statements
    const remainingCount = (content.match(/console\.(log|error|warn|info|debug)/g) || []).length;
    
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`✅ ${filePath}: Removed ${originalCount - remainingCount} console statements`);
    
    if (remainingCount > 0) {
      console.log(`⚠️  ${filePath}: ${remainingCount} console statements remaining (may need manual review)`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log('🧹 Starting console statement cleanup...\n');

filesToClean.forEach(cleanConsoleStatements);

console.log('\n✨ Console cleanup completed!');
console.log('\n📝 Next steps:');
console.log('1. Review remaining console statements manually');
console.log('2. Run npm run lint to check progress');
console.log('3. Test application functionality'); 