#!/usr/bin/env node

/**
 * Local Dataset Creator for AI Classifier
 * Creates educational dataset structure with metadata files
 * Ready for users to add their own images
 * 
 * Usage: node scripts/create-local-dataset.js
 */

const fs = require('fs');
const path = require('path');

const TARGET_IMAGES_PER_LABEL = 50;
const DATASETS_DIR = path.join(__dirname, '..', 'public', 'datasets');

// Dataset configurations with detailed metadata
const DATASETS = {
  'school-supplies': {
    name: 'School Supplies Classification',
    description: 'Common school supplies for 9th grade students',
    labels: {
      'pencil': {
        name: 'Pencil',
        description: 'Various types of pencils (wooden, mechanical, colored)',
        examples: ['#2 HB pencil', 'Wooden pencil', 'Graphite pencil', 'Yellow school pencil'],
        tips: 'Include different angles, lighting, and pencil types for variety'
      },
      'eraser': {
        name: 'Eraser', 
        description: 'Different eraser types and colors',
        examples: ['Pink eraser', 'White eraser', 'Kneaded eraser', 'Rubber eraser'],
        tips: 'Show erasers in various states (new, used, different sizes)'
      },
      'marker': {
        name: 'Marker',
        description: 'Felt-tip markers and permanent markers',
        examples: ['Sharpie marker', 'Colored marker', 'Fine tip marker', 'Whiteboard marker'],
        tips: 'Include different colors and brands, caps on/off'
      }
    }
  },
  'recycle-audit': {
    name: 'Recycling Material Classification',
    description: 'Common recyclable materials for environmental education',
    labels: {
      'plastic': {
        name: 'Plastic',
        description: 'Plastic containers and items',
        examples: ['Water bottle', 'Plastic container', 'Plastic bag', 'Plastic cup'],
        tips: 'Include different plastic types and conditions (clear, colored, crushed)'
      },
      'paper': {
        name: 'Paper',
        description: 'Paper products and cardboard',
        examples: ['Newspaper', 'Cardboard box', 'Paper bag', 'Notebook paper'],
        tips: 'Show various paper types, conditions, and sizes'
      },
      'metal': {
        name: 'Metal',
        description: 'Metal containers and items',
        examples: ['Aluminum can', 'Tin can', 'Metal container', 'Foil'],
        tips: 'Include different metals and states (shiny, dull, dented)'
      }
    }
  }
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

function createReadmeFile(dataset, label, labelConfig) {
  const readmeContent = `# ${labelConfig.name} Images

## Description
${labelConfig.description}

## Target: ${TARGET_IMAGES_PER_LABEL} images

## Examples to Include:
${labelConfig.examples.map(example => `- ${example}`).join('\n')}

## Photography Tips:
${labelConfig.tips}

## File Requirements:
- **Formats**: PNG, JPG, JPEG, WEBP
- **Resolution**: 256x256 pixels recommended (will be resized automatically)
- **Naming**: descriptive names like \`${label}_001.jpg\`, \`${label}_wooden_002.png\`
- **Content**: School-appropriate, no faces or logos, varied lighting and angles

## Current Status:
- [ ] 0-10 images: Getting started
- [ ] 11-25 images: Good progress  
- [ ] 26-40 images: Almost there
- [ ] 41-50+ images: Ready for training! ✅

Add your ${label} images to this folder and they'll automatically appear in the AI Classifier training interface.
`;

  const readmePath = path.join(DATASETS_DIR, dataset, label, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`📝 Created README for ${dataset}/${label}`);
}

function createDatasetInfo(datasetName, datasetConfig) {
  const infoContent = `# ${datasetConfig.name}

${datasetConfig.description}

## Labels in this Dataset:
${Object.entries(datasetConfig.labels).map(([key, label]) => 
  `- **${label.name}**: ${label.description}`
).join('\n')}

## Usage in AI Classifier:
1. Students load this dataset in the training interface
2. They can view images from each label category  
3. Train a classifier to distinguish between the labels
4. Analyze metrics like accuracy and confusion matrix
5. Flag low-quality images and retrain for better performance

## Educational Standards:
- SC.912.ET.2.2: Describe major branches of AI
- SC.912.ET.2.3: Evaluate the application of algorithms to AI  
- SC.912.ET.2.5: Describe major applications of AI & ML across fields

## Getting Started:
Add ~50 images to each label folder to enable realistic AI training with this dataset.
`;

  const infoPath = path.join(DATASETS_DIR, datasetName, 'dataset-info.md');
  fs.writeFileSync(infoPath, infoContent);
  console.log(`📊 Created dataset info for ${datasetName}`);
}

function createPlaceholderImage(filePath, label, index) {
  // Create a simple text-based "image" file that explains what should go here
  const placeholderContent = `<!-- Placeholder for ${label} image ${index} -->
<!-- 
Replace this file with an actual image of a ${label}:
- File formats: PNG, JPG, JPEG, WEBP
- Recommended size: 256x256 pixels
- File name: ${label}_${String(index).padStart(3, '0')}.jpg (or .png)

This placeholder will be replaced when real images are added.
-->`;

  fs.writeFileSync(filePath + '.placeholder.md', placeholderContent);
}

function setupDatasetStructure() {
  console.log('🏗️  Setting up AI Classifier dataset structure...\n');
  
  // Ensure base datasets directory exists
  ensureDirectoryExists(DATASETS_DIR);
  
  const summary = {};
  
  for (const [datasetName, datasetConfig] of Object.entries(DATASETS)) {
    console.log(`📚 Setting up dataset: ${datasetName}`);
    summary[datasetName] = {};
    
    // Create dataset info file
    createDatasetInfo(datasetName, datasetConfig);
    
    for (const [labelKey, labelConfig] of Object.entries(datasetConfig.labels)) {
      // Create label directory
      const labelDir = path.join(DATASETS_DIR, datasetName, labelKey);
      ensureDirectoryExists(labelDir);
      
      // Create README for this label
      createReadmeFile(datasetName, labelKey, labelConfig);
      
      // Create a few placeholder references
      for (let i = 1; i <= 3; i++) {
        const placeholderPath = path.join(labelDir, `${labelKey}_${String(i).padStart(3, '0')}`);
        createPlaceholderImage(placeholderPath, labelKey, i);
      }
      
      summary[datasetName][labelKey] = 'Ready for images';
    }
    
    console.log(''); // Empty line between datasets
  }
  
  return summary;
}

function createMasterReadme() {
  const readmeContent = `# AI Classifier Datasets

This directory contains image datasets for the CodeFly AI Classifier curriculum.

## 📁 Available Datasets:

### 1. School Supplies (\`school-supplies/\`)
**Purpose**: Train students to classify common school items
- **pencil/**: Wooden pencils, mechanical pencils, colored pencils
- **eraser/**: Pink erasers, white erasers, kneaded erasers  
- **marker/**: Sharpie markers, colored markers, whiteboard markers

### 2. Recycle Audit (\`recycle-audit/\`)
**Purpose**: Environmental education through material classification
- **plastic/**: Bottles, containers, bags, cups
- **paper/**: Newspapers, cardboard, notebooks, paper bags
- **metal/**: Aluminum cans, tin cans, metal containers, foil

## 🎯 How to Populate Datasets:

1. **Choose a dataset** and navigate to its folder
2. **Read the label README** files for specific requirements
3. **Add ~50 images** per label for balanced training
4. **Follow naming conventions**: \`label_001.jpg\`, \`label_002.png\`, etc.
5. **Test in the curriculum**: Visit \`/lesson/week-01\` to see your images

## 📊 Image Requirements:
- **Formats**: PNG, JPG, JPEG, WEBP
- **Size**: 256x256px recommended (auto-resized)
- **Content**: School-appropriate, no faces/logos
- **Variety**: Different angles, lighting, conditions

## 🚀 Quick Start:
\`\`\`bash
# Add images to any label folder, then test:
npm run dev
# Navigate to: http://localhost:3000/lesson/week-01
\`\`\`

## ✅ Dataset Status:
- [ ] school-supplies: Add pencil, eraser, marker images
- [ ] recycle-audit: Add plastic, paper, metal images

The AI Classifier will automatically detect and use any images you add to these folders!
`;

  const readmePath = path.join(DATASETS_DIR, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  console.log('📖 Created master README.md');
}

function printInstructions(summary) {
  console.log('📋 Dataset Setup Complete!');
  console.log('=========================\n');
  
  console.log('📁 Structure Created:');
  for (const [datasetName, labels] of Object.entries(summary)) {
    console.log(`   ${datasetName}/`);
    for (const labelName of Object.keys(labels)) {
      console.log(`   ├── ${labelName}/ (ready for images)`);
    }
    console.log('');
  }
  
  console.log('🎯 Next Steps:');
  console.log('1. 📸 Add ~50 images to each label folder');
  console.log('2. 📝 Follow the README guides in each folder');
  console.log('3. 🚀 Test with: npm run dev → /lesson/week-01');
  console.log('4. ✅ Train real AI classifiers with your data!');
  
  console.log('\n✈️ CodeFly AI Classifier datasets ready for education!');
}

async function main() {
  console.log('🚀 CodeFly Dataset Structure Creator');
  console.log('====================================\n');
  
  try {
    // Set up the complete dataset structure
    const summary = setupDatasetStructure();
    
    // Create master documentation
    createMasterReadme();
    
    // Print instructions
    printInstructions(summary);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { setupDatasetStructure, createDatasetInfo };