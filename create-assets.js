const fs = require('fs');
const path = require('path');

// Create minimal PNG files
const createPNG = (width, height, color = '#667eea') => {
  // Minimal PNG header + IDAT chunk for solid color
  const png = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, width, // Width
    0x00, 0x00, 0x00, height, // Height
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x00, 0x00, 0x00, 0x00, // CRC placeholder
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  return png;
};

// Create assets
const assetsDir = path.join(__dirname, 'assets');

try {
  fs.writeFileSync(path.join(assetsDir, 'icon.png'), createPNG(64, 64));
  fs.writeFileSync(path.join(assetsDir, 'splash.png'), createPNG(200, 200));
  fs.writeFileSync(path.join(assetsDir, 'favicon.png'), createPNG(32, 32));
  fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), createPNG(108, 108));
  
  console.log('✅ Assets created successfully!');
} catch (error) {
  console.error('❌ Error creating assets:', error);
}