#!/usr/bin/env node

/**
 * Automated Dataset Image Download Script
 * Downloads royalty-free educational images for AI Classifier curriculum
 * 
 * Usage: node scripts/download-datasets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const TARGET_IMAGES_PER_LABEL = 50;
const IMAGE_SIZE = 256;
const DATASETS_DIR = path.join(__dirname, '..', 'public', 'datasets');

// Dataset configurations
const DATASETS = {
  'school-supplies': {
    labels: {
      'pencil': ['pencil', 'wooden pencil', 'graphite pencil', 'writing pencil'],
      'eraser': ['eraser', 'rubber eraser', 'pink eraser', 'pencil eraser'],
      'marker': ['marker', 'felt tip marker', 'colored marker', 'writing marker']
    }
  },
  'recycle-audit': {
    labels: {
      'plastic': ['plastic bottle', 'plastic container', 'plastic cup', 'plastic packaging'],
      'paper': ['paper', 'cardboard', 'newspaper', 'paper bag', 'notebook paper'],
      'metal': ['aluminum can', 'metal can', 'tin can', 'metal container']
    }
  }
};

// Free image APIs (no auth required for basic usage)
const IMAGE_SOURCES = [
  {
    name: 'Picsum Photos',
    baseUrl: 'https://picsum.photos',
    getUrl: (width, height, seed) => `https://picsum.photos/${width}/${height}?random=${seed}`,
    needsProcessing: true
  },
  {
    name: 'Lorem Picsum',
    baseUrl: 'https://loremflickr.com',
    getUrl: (width, height, keyword) => `https://loremflickr.com/${width}/${height}/${encodeURIComponent(keyword)}`,
    needsProcessing: false
  }
];

// Utility functions
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadImagesForLabel(dataset, label, keywords) {
  const labelDir = path.join(DATASETS_DIR, dataset, label);
  ensureDirectoryExists(labelDir);
  
  console.log(`🔄 Downloading images for ${dataset}/${label}...`);
  
  let downloaded = 0;
  let attempts = 0;
  const maxAttempts = TARGET_IMAGES_PER_LABEL * 3; // Allow for some failures
  
  while (downloaded < TARGET_IMAGES_PER_LABEL && attempts < maxAttempts) {
    attempts++;
    
    try {
      // Alternate between different keywords and sources
      const keyword = keywords[attempts % keywords.length];
      const source = IMAGE_SOURCES[attempts % IMAGE_SOURCES.length];
      
      let imageUrl;
      if (source.name === 'Picsum Photos') {
        // Use Lorem Picsum with seed for variety
        imageUrl = source.getUrl(IMAGE_SIZE, IMAGE_SIZE, attempts);
      } else {
        // Use LoremFlickr with keyword
        imageUrl = source.getUrl(IMAGE_SIZE, IMAGE_SIZE, keyword);
      }
      
      const fileName = `${label}_${String(downloaded + 1).padStart(3, '0')}.jpg`;
      const filePath = path.join(labelDir, fileName);
      
      await downloadImage(imageUrl, filePath);
      downloaded++;
      
      // Show progress
      if (downloaded % 10 === 0 || downloaded === TARGET_IMAGES_PER_LABEL) {
        console.log(`  ✅ Downloaded ${downloaded}/${TARGET_IMAGES_PER_LABEL} ${label} images`);
      }
      
      // Small delay to be respectful to free APIs
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.log(`  ⚠️  Failed to download image ${attempts}: ${error.message}`);
      // Continue trying with next attempt
    }
  }
  
  console.log(`✅ Completed ${dataset}/${label}: ${downloaded} images downloaded`);
  return downloaded;
}

async function generatePlaceholderImages() {
  console.log('🎨 Generating educational placeholder images...\n');
  
  const results = {};
  
  for (const [datasetName, datasetConfig] of Object.entries(DATASETS)) {
    console.log(`📚 Processing dataset: ${datasetName}`);
    results[datasetName] = {};
    
    for (const [label, keywords] of Object.entries(datasetConfig.labels)) {
      const count = await downloadImagesForLabel(datasetName, label, keywords);
      results[datasetName][label] = count;
    }
    
    console.log(''); // Empty line between datasets
  }
  
  return results;
}

function printSummary(results) {
  console.log('📊 Download Summary:');
  console.log('==================');
  
  let totalImages = 0;
  
  for (const [datasetName, datasetResults] of Object.entries(results)) {
    console.log(`\n📁 ${datasetName}:`);
    for (const [label, count] of Object.entries(datasetResults)) {
      console.log(`  • ${label}: ${count} images`);
      totalImages += count;
    }
  }
  
  console.log(`\n🎯 Total images downloaded: ${totalImages}`);
  console.log('\n✈️ CodeFly AI Classifier datasets ready for training!');
}

async function main() {
  console.log('🚀 CodeFly Dataset Download Script');
  console.log('===================================\n');
  
  try {
    // Ensure base datasets directory exists
    ensureDirectoryExists(DATASETS_DIR);
    
    // Download images for all datasets
    const results = await generatePlaceholderImages();
    
    // Print summary
    printSummary(results);
    
    console.log('\n🎓 Ready for classroom use!');
    console.log('   Run: npm run dev');
    console.log('   Navigate to: /lesson/week-01');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { downloadImagesForLabel, generatePlaceholderImages };