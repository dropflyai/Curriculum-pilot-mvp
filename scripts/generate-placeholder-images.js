#!/usr/bin/env node

/**
 * Enhanced Placeholder Image Generator for AI Classifier
 * Creates varied, realistic placeholder images for educational use
 * 
 * Usage: node scripts/generate-placeholder-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_IMAGES_PER_LABEL = 50;
const DATASETS_DIR = path.join(__dirname, '..', 'public', 'datasets');

// Color schemes for each object type to create variety
const COLOR_SCHEMES = {
  pencil: ['8B4513', 'DAA520', 'CD853F', 'D2691E', 'F4A460', 'DEB887'],
  eraser: ['FFB6C1', 'FF69B4', 'FFC0CB', 'FFFFFF', 'F5F5F5', 'E6E6FA'],
  marker: ['FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF', 'FFA500', '800080'],
  plastic: ['87CEEB', '1E90FF', '00CED1', '48D1CC', '20B2AA', '008B8B'],
  paper: ['F5F5DC', 'FFFACD', 'FAEBD7', 'F0E68C', 'EEE8AA', 'D3D3D3'],
  metal: ['C0C0C0', '708090', '696969', '778899', 'B0C4DE', 'DCDCDC']
};

// Text labels for different styles
const OBJECT_STYLES = {
  pencil: ['#2 HB', 'PENCIL', '✏️', 'WOOD', 'GRAPHITE'],
  eraser: ['PINK', 'WHITE', 'RUBBER', '🧽', 'CLEAN'],
  marker: ['SHARPIE', 'MARKER', 'FINE TIP', 'BOLD', '🖍️'],
  plastic: ['RECYCLE', '♻️', 'PET 1', 'BOTTLE', 'PLASTIC'],
  paper: ['PAPER', 'RECYCLE', '📄', 'CARDBOARD', 'NEWS'],
  metal: ['ALUMINUM', 'TIN', 'STEEL', '🥫', 'METAL']
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function generatePlaceholderUrl(width, height, backgroundColor, textColor, text, seed) {
  // Using a more reliable placeholder service with custom styling
  const bgColor = backgroundColor.replace('#', '');
  const txtColor = textColor.replace('#', '');
  
  // Create variety with different layouts
  const layouts = ['', '/font-size/24', '/font-weight/bold', '/font-size/20'];
  const layout = layouts[seed % layouts.length];
  
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${txtColor}${layout}?text=${encodeURIComponent(text)}`;
}

function downloadImage(url, filePath, retries = 3) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      } else if (retries > 0) {
        // Retry with a slight delay
        setTimeout(() => {
          downloadImage(url, filePath, retries - 1).then(resolve).catch(reject);
        }, 500);
      } else {
        reject(new Error(`HTTP ${response.statusCode} after retries`));
      }
    }).on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          downloadImage(url, filePath, retries - 1).then(resolve).catch(reject);
        }, 500);
      } else {
        reject(err);
      }
    });
  });
}

async function generateImagesForLabel(dataset, label) {
  const labelDir = path.join(DATASETS_DIR, dataset, label);
  ensureDirectoryExists(labelDir);
  
  console.log(`🎨 Generating ${TARGET_IMAGES_PER_LABEL} placeholder images for ${dataset}/${label}...`);
  
  const colors = COLOR_SCHEMES[label] || ['666666', '999999', 'CCCCCC'];
  const styles = OBJECT_STYLES[label] || [label.toUpperCase()];
  let generated = 0;
  
  for (let i = 0; i < TARGET_IMAGES_PER_LABEL; i++) {
    try {
      // Create variety in colors, text, and styling
      const backgroundColor = colors[i % colors.length];
      const textColor = i % 2 === 0 ? 'FFFFFF' : '000000';
      const text = styles[i % styles.length];
      const fileName = `${label}_${String(i + 1).padStart(3, '0')}.png`;
      const filePath = path.join(labelDir, fileName);
      
      // Generate unique placeholder
      const imageUrl = generatePlaceholderUrl(256, 256, backgroundColor, textColor, text, i);
      
      await downloadImage(imageUrl, filePath);
      generated++;
      
      // Progress indicator
      if ((i + 1) % 10 === 0 || i === TARGET_IMAGES_PER_LABEL - 1) {
        console.log(`  ✅ Generated ${i + 1}/${TARGET_IMAGES_PER_LABEL} ${label} images`);
      }
      
      // Small delay to avoid overwhelming the placeholder service
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.log(`  ⚠️  Failed to generate image ${i + 1}: ${error.message}`);
    }
  }
  
  console.log(`✅ Completed ${dataset}/${label}: ${generated} images generated`);
  return generated;
}

async function generateAllDatasets() {
  console.log('🎨 Generating educational placeholder images...\n');
  
  const datasets = {
    'school-supplies': ['pencil', 'eraser', 'marker'],
    'recycle-audit': ['plastic', 'paper', 'metal']
  };
  
  const results = {};
  
  for (const [datasetName, labels] of Object.entries(datasets)) {
    console.log(`📚 Processing dataset: ${datasetName}`);
    results[datasetName] = {};
    
    for (const label of labels) {
      const count = await generateImagesForLabel(datasetName, label);
      results[datasetName][label] = count;
    }
    
    console.log(''); // Empty line between datasets
  }
  
  return results;
}

function printSummary(results) {
  console.log('📊 Generation Summary:');
  console.log('====================');
  
  let totalImages = 0;
  
  for (const [datasetName, datasetResults] of Object.entries(results)) {
    console.log(`\n📁 ${datasetName}:`);
    for (const [label, count] of Object.entries(datasetResults)) {
      console.log(`  • ${label}: ${count} placeholder images`);
      totalImages += count;
    }
  }
  
  console.log(`\n🎯 Total placeholder images: ${totalImages}`);
  console.log('\n✈️ CodeFly AI Classifier datasets ready!');
  console.log('\n📝 Note: These are educational placeholders for demo purposes.');
  console.log('   For production, replace with real object photos.');
}

async function main() {
  console.log('🚀 CodeFly Placeholder Image Generator');
  console.log('======================================\n');
  
  try {
    // Ensure base datasets directory exists
    ensureDirectoryExists(DATASETS_DIR);
    
    // Generate placeholder images for all datasets
    const results = await generateAllDatasets();
    
    // Print summary
    printSummary(results);
    
    console.log('\n🎓 Ready for AI Classifier curriculum!');
    console.log('   Test with: npm run dev');
    console.log('   Navigate to: http://localhost:3000/lesson/week-01');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateImagesForLabel, generateAllDatasets };