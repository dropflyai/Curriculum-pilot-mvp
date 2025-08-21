#!/usr/bin/env node

/**
 * Demo Image Creator for AI Classifier
 * Creates simple colored squares with labels for immediate testing
 * No network required - pure local generation
 * 
 * Usage: node scripts/create-demo-images.js
 */

const fs = require('fs');
const path = require('path');

const TARGET_IMAGES_PER_LABEL = 20; // Reduced for quick demo
const DATASETS_DIR = path.join(__dirname, '..', 'public', 'datasets');

// Simple SVG image generator
function createSVGImage(label, color, index, size = 256) {
  const textColor = getContrastColor(color);
  const variations = ['', ' #' + index, ' ' + index, ' IMG'];
  const variation = variations[index % variations.length];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Educational placeholder for ${label} -->
  <rect width="100%" height="100%" fill="#${color}"/>
  <rect x="10" y="10" width="${size-20}" height="${size-20}" fill="none" stroke="#${textColor}" stroke-width="2" opacity="0.3"/>
  
  <!-- Main label -->
  <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="24" font-weight="bold" fill="#${textColor}">${label.toUpperCase()}</text>
  
  <!-- Variation text -->
  <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="16" fill="#${textColor}" opacity="0.8">${variation}</text>
  
  <!-- Small index -->
  <text x="90%" y="15%" text-anchor="middle" font-family="Arial, sans-serif" 
        font-size="12" fill="#${textColor}" opacity="0.6">${index}</text>
</svg>`;
}

function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return black or white for best contrast
  return brightness > 128 ? '000000' : 'FFFFFF';
}

// Color schemes for realistic variety
const COLOR_PALETTES = {
  pencil: ['DAA520', 'CD853F', 'D2691E', 'F4A460', 'DEB887', '8B4513'], // Wood/yellow tones
  eraser: ['FFB6C1', 'FF69B4', 'FFC0CB', 'F5F5F5', 'E6E6FA', 'FFFFFF'], // Pink/white tones
  marker: ['FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF', 'FFA500', '800080'], // Bright colors
  plastic: ['87CEEB', '1E90FF', '00CED1', '48D1CC', '20B2AA', 'FFFFFF'], // Blue/clear tones
  paper: ['F5F5DC', 'FFFACD', 'FAEBD7', 'F0E68C', 'EEE8AA', 'D3D3D3'], // Beige/white tones
  metal: ['C0C0C0', '708090', '696969', 'B0C4DE', 'DCDCDC', 'A9A9A9']  // Silver/gray tones
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function createDemoImagesForLabel(dataset, label) {
  const labelDir = path.join(DATASETS_DIR, dataset, label);
  ensureDirectoryExists(labelDir);
  
  console.log(`🎨 Creating ${TARGET_IMAGES_PER_LABEL} demo images for ${dataset}/${label}...`);
  
  const colors = COLOR_PALETTES[label] || ['666666', '999999', 'CCCCCC'];
  let created = 0;
  
  for (let i = 1; i <= TARGET_IMAGES_PER_LABEL; i++) {
    try {
      const color = colors[(i - 1) % colors.length];
      const fileName = `${label}_${String(i).padStart(3, '0')}.svg`;
      const filePath = path.join(labelDir, fileName);
      
      const svgContent = createSVGImage(label, color, i);
      fs.writeFileSync(filePath, svgContent);
      created++;
      
    } catch (error) {
      console.log(`  ⚠️  Failed to create image ${i}: ${error.message}`);
    }
  }
  
  console.log(`  ✅ Created ${created} demo images`);
  return created;
}

function createAllDemoImages() {
  console.log('🎨 Creating demo images for AI Classifier...\n');
  
  const datasets = {
    'school-supplies': ['pencil', 'eraser', 'marker'],
    'recycle-audit': ['plastic', 'paper', 'metal']
  };
  
  const results = {};
  
  for (const [datasetName, labels] of Object.entries(datasets)) {
    console.log(`📚 Processing dataset: ${datasetName}`);
    results[datasetName] = {};
    
    for (const label of labels) {
      const count = createDemoImagesForLabel(datasetName, label);
      results[datasetName][label] = count;
    }
    
    console.log(''); // Empty line between datasets
  }
  
  return results;
}

function printSummary(results) {
  console.log('📊 Demo Images Created:');
  console.log('======================');
  
  let totalImages = 0;
  
  for (const [datasetName, datasetResults] of Object.entries(results)) {
    console.log(`\n📁 ${datasetName}:`);
    for (const [label, count] of Object.entries(datasetResults)) {
      console.log(`  • ${label}: ${count} SVG demo images`);
      totalImages += count;
    }
  }
  
  console.log(`\n🎯 Total demo images: ${totalImages}`);
  console.log('\n✈️ CodeFly AI Classifier ready for immediate testing!');
  console.log('\n📝 Note: These are colorful demo images for immediate testing.');
  console.log('   Replace with real photos for production use.');
}

async function main() {
  console.log('🚀 CodeFly Demo Image Creator');
  console.log('=============================\n');
  
  try {
    // Create demo images for all datasets
    const results = createAllDemoImages();
    
    // Print summary
    printSummary(results);
    
    console.log('\n🎓 Ready to test AI Classifier!');
    console.log('   Start with: npm run dev');
    console.log('   Navigate to: http://localhost:3000/lesson/week-01');
    console.log('   Click the Code tab to see your demo images');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}