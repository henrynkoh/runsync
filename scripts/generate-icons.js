const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.join(__dirname, '../public/icons/icon-placeholder.svg');
const svgContent = fs.readFileSync(svgPath);

// Generate 192x192 icon
sharp(svgContent)
  .resize(192, 192)
  .png()
  .toFile(path.join(__dirname, '../public/icons/icon-192.png'))
  .then(() => console.log('Generated 192x192 icon'))
  .catch(err => console.error('Error generating 192x192 icon:', err));

// Generate 512x512 icon
sharp(svgContent)
  .resize(512, 512)
  .png()
  .toFile(path.join(__dirname, '../public/icons/icon-512.png'))
  .then(() => console.log('Generated 512x512 icon'))
  .catch(err => console.error('Error generating 512x512 icon:', err)); 