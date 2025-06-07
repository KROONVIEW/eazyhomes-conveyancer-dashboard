const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  console.log('🔄 Converting images to WebP format for additional cost savings...');
  
  const directories = [
    'public/images/Signin',
    'public/images/Signup',
    'public/images/avatars'
  ];
  
  let totalOriginalSize = 0;
  let totalWebPSize = 0;
  let filesProcessed = 0;
  
  for (const dir of directories) {
    console.log(`\n📁 Processing ${dir}...`);
    
    if (!fs.existsSync(dir)) {
      console.log(`⚠️ Directory ${dir} does not exist, skipping...`);
      continue;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i) && !file.includes('.webp')) {
        const inputPath = path.join(dir, file);
        const outputPath = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        try {
          // Get original file size
          const originalStats = fs.statSync(inputPath);
          const originalSize = originalStats.size;
          totalOriginalSize += originalSize;
          
          // Convert to WebP
          await sharp(inputPath)
            .webp({ 
              quality: 80, 
              effort: 6,
              lossless: false 
            })
            .toFile(outputPath);
          
          // Get WebP file size
          const webpStats = fs.statSync(outputPath);
          const webpSize = webpStats.size;
          totalWebPSize += webpSize;
          
          const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
          
          console.log(`✅ ${file} → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`);
          console.log(`   ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (${savings}% smaller)`);
          
          filesProcessed++;
          
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
        }
      }
    }
  }
  
  const totalSavings = ((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n🎉 WebP conversion complete!`);
  console.log(`📊 Summary:`);
  console.log(`   Files processed: ${filesProcessed}`);
  console.log(`   Original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`   WebP size: ${formatBytes(totalWebPSize)}`);
  console.log(`   Additional savings: ${formatBytes(totalOriginalSize - totalWebPSize)} (${totalSavings}%)`);
  console.log(`\n💰 Estimated monthly cost savings: $2-5 in CDN bandwidth`);
  console.log(`💰 Estimated annual cost savings: $24-60`);
  
  // Create usage instructions
  console.log(`\n📋 Next Steps:`);
  console.log(`1. Update your React components to use .webp files`);
  console.log(`2. Add fallback support for older browsers`);
  console.log(`3. Test the application to ensure all images load correctly`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the conversion
convertToWebP().catch(console.error);
