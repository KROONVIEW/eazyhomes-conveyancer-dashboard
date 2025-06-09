#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Technical Debt Cleanup Script');
console.log('==================================\n');

// Configuration
const config = {
  backupPatterns: ['.backup', '.BACKUP', '.bak'],
  excludeDirs: ['node_modules', '.git', 'build', 'dist'],
  maxFileSize: 300, // lines
  maxFunctionSize: 50, // lines
};

// Utility functions
const getAllFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !config.excludeDirs.includes(file)) {
      getAllFiles(filePath, fileList);
    } else if (stat.isFile()) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

const countLines = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
};

const isBackupFile = (filePath) => {
  return config.backupPatterns.some(pattern => 
    filePath.toLowerCase().includes(pattern.toLowerCase())
  );
};

const analyzeFile = (filePath) => {
  const lines = countLines(filePath);
  const isBackup = isBackupFile(filePath);
  const ext = path.extname(filePath);
  
  return {
    path: filePath,
    lines,
    isBackup,
    isLarge: lines > config.maxFileSize,
    isReactComponent: ['.js', '.jsx', '.ts', '.tsx'].includes(ext),
  };
};

// Main analysis
const analyzeProject = () => {
  console.log('📊 Analyzing project structure...\n');
  
  const allFiles = getAllFiles('./src');
  const analysis = allFiles.map(analyzeFile);
  
  // Find backup files
  const backupFiles = analysis.filter(file => file.isBackup);
  console.log(`🗑️  Found ${backupFiles.length} backup files:`);
  backupFiles.forEach(file => {
    console.log(`   - ${file.path}`);
  });
  
  // Find large files
  const largeFiles = analysis.filter(file => 
    file.isReactComponent && file.isLarge && !file.isBackup
  );
  console.log(`\n📏 Found ${largeFiles.length} large files (>${config.maxFileSize} lines):`);
  largeFiles.forEach(file => {
    console.log(`   - ${file.path} (${file.lines} lines)`);
  });
  
  // Summary
  console.log('\n📈 Technical Debt Summary:');
  console.log(`   Total files analyzed: ${analysis.length}`);
  console.log(`   Backup files: ${backupFiles.length}`);
  console.log(`   Large files: ${largeFiles.length}`);
  console.log(`   React components: ${analysis.filter(f => f.isReactComponent).length}`);
  
  return { backupFiles, largeFiles };
};

// Cleanup functions
const cleanupBackupFiles = (backupFiles) => {
  console.log('\n🧹 Cleaning up backup files...');
  
  backupFiles.forEach(file => {
    try {
      fs.unlinkSync(file.path);
      console.log(`   ✅ Deleted: ${file.path}`);
    } catch (error) {
      console.log(`   ❌ Failed to delete: ${file.path} - ${error.message}`);
    }
  });
};

const generateRefactoringPlan = (largeFiles) => {
  console.log('\n📋 Refactoring Plan:');
  console.log('===================');
  
  largeFiles.forEach((file, index) => {
    console.log(`\n${index + 1}. ${file.path} (${file.lines} lines)`);
    console.log('   Recommendations:');
    console.log('   - Break into smaller components');
    console.log('   - Extract custom hooks');
    console.log('   - Separate business logic');
    console.log('   - Consider using composition');
  });
};

// Main execution
const main = () => {
  const { backupFiles, largeFiles } = analyzeProject();
  
  // Ask for cleanup confirmation
  if (backupFiles.length > 0) {
    console.log('\n⚠️  Would you like to delete backup files? (Run with --clean flag)');
    
    if (process.argv.includes('--clean')) {
      cleanupBackupFiles(backupFiles);
    }
  }
  
  if (largeFiles.length > 0) {
    generateRefactoringPlan(largeFiles);
  }
  
  console.log('\n✨ Analysis complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run debt:check (to check code quality)');
  console.log('2. Run: npm run debt:fix (to auto-fix issues)');
  console.log('3. Address large files identified above');
  console.log('4. Set up pre-commit hooks for continuous quality');
};

// Run the script
main(); 