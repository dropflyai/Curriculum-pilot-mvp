# AI Classifier Datasets

This directory contains image datasets for the CodeFly AI Classifier curriculum.

## 📁 Available Datasets:

### 1. School Supplies (`school-supplies/`)
**Purpose**: Train students to classify common school items
- **pencil/**: Wooden pencils, mechanical pencils, colored pencils
- **eraser/**: Pink erasers, white erasers, kneaded erasers  
- **marker/**: Sharpie markers, colored markers, whiteboard markers

### 2. Recycle Audit (`recycle-audit/`)
**Purpose**: Environmental education through material classification
- **plastic/**: Bottles, containers, bags, cups
- **paper/**: Newspapers, cardboard, notebooks, paper bags
- **metal/**: Aluminum cans, tin cans, metal containers, foil

## 🎯 How to Populate Datasets:

1. **Choose a dataset** and navigate to its folder
2. **Read the label README** files for specific requirements
3. **Add ~50 images** per label for balanced training
4. **Follow naming conventions**: `label_001.jpg`, `label_002.png`, etc.
5. **Test in the curriculum**: Visit `/lesson/week-01` to see your images

## 📊 Image Requirements:
- **Formats**: PNG, JPG, JPEG, WEBP
- **Size**: 256x256px recommended (auto-resized)
- **Content**: School-appropriate, no faces/logos
- **Variety**: Different angles, lighting, conditions

## 🚀 Quick Start:
```bash
# Add images to any label folder, then test:
npm run dev
# Navigate to: http://localhost:3000/lesson/week-01
```

## ✅ Dataset Status:
- [ ] school-supplies: Add pencil, eraser, marker images
- [ ] recycle-audit: Add plastic, paper, metal images

The AI Classifier will automatically detect and use any images you add to these folders!
