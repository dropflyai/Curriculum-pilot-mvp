# Dataset Folder Structure

This directory contains image datasets for the AI Classifier curriculum.

## School Supplies Dataset
- **Location**: `/datasets/school-supplies/`
- **Labels**: pencil, eraser, marker
- **Size**: ~50 images per label
- **Resolution**: 256x256 pixels recommended
- **Requirements**: School-safe images, no faces/logos, consistent lighting

## Recycle Audit Dataset  
- **Location**: `/datasets/recycle-audit/`
- **Labels**: plastic, paper, metal
- **Size**: ~50 images per label
- **Resolution**: 256x256 pixels recommended
- **Requirements**: Various materials, different lighting conditions, real-world scenarios

## Image Requirements
- File formats: PNG, JPG, JPEG, WEBP
- No faces or copyrighted material
- Classroom-appropriate content
- Diverse lighting, angles, and backgrounds for each label
- File naming: descriptive but simple (e.g., `pencil_001.jpg`)

## To Populate Datasets
1. Add ~50 images to each label folder
2. Ensure balanced representation across labels
3. Include variety in lighting, angles, and object positioning
4. Test with API endpoint: `/api/list?dataset=school-supplies&label=pencil`