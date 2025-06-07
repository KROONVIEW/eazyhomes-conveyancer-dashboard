const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function resizeOversizedImages() {
  console.log('🖼️ Starting image resizing optimization...');
  
  const maxWidth = 1920;  // Max width for login/signup images
  const maxHeight = 1080; // Max height for login/signup images
  const avatarSize = 400; // Max size for avatar images
  
  const directories = [
    { path: 'public/images/Signin', maxWidth, maxHeight, name: 'Signin' },
    { path: 'public/images/Signup', maxWidth, maxHeight, name: 'Signup' },
    { path: 'public/images/avatars', maxWidth: avatarSize, maxHeight: avatarSize, name: 'Avatars' }
  ];
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let filesProcessed = 0;
  
  for (const dir of directories) {
    console.log(`\n📁 Processing ${dir.name} directory...`);
    
    if (!fs.existsSync(dir.path)) {
      console.log(`⚠️ Directory ${dir.path} does not exist, skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(dir.path);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(dir.path, file);
        const outputPath = path.join(dir.path, `optimized_${file}`);
        
        try {
          // Get original file size
          const originalStats = fs.statSync(inputPath);
          const originalSize = originalStats.size;
          totalOriginalSize += originalSize;
          
          // Resize and optimize
          await sharp(inputPath)
            .resize(dir.maxWidth, dir.maxHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ 
              quality: 80, 
              progressive: true,
              mozjpeg: true 
            })
            .toFile(outputPath);
          
          // Get optimized file size
          const optimizedStats = fs.statSync(outputPath);
          const optimizedSize = optimizedStats.size;
          totalOptimizedSize += optimizedSize;
          
          const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
          
          console.log(`✅ ${file}: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (${savings}% smaller)`);
          
          // Replace original with optimized version
          fs.unlinkSync(inputPath);
          fs.renameSync(outputPath, inputPath);
          
          filesProcessed++;
          
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
        }
      }
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n🎉 Image optimization complete!`);
  console.log(`📊 Summary:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`   Optimized size: ${formatBytes(totalOptimizedSize)}`);
  console.log(`   Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${totalSavings}%)`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the optimization
resizeOversizedImages().catch(console.error); 