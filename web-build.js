// Desktop-specific configurations
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for desktop...');

// Build web version
execSync('expo build:web', { stdio: 'inherit' });

// Create desktop launcher
const desktopLauncher = `
<!DOCTYPE html>
<html>
<head>
    <title>Cognitive Study Monitor</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .desktop-frame { 
            width: 100vw; 
            height: 100vh; 
            border: none; 
            background: #667eea;
        }
    </style>
</head>
<body>
    <iframe src="./index.html" class="desktop-frame"></iframe>
    <script>
        // Desktop-specific features
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            // Add desktop-specific functionality
        }
    </script>
</body>
</html>
`;

// Write desktop launcher
fs.writeFileSync(path.join(__dirname, 'web-build', 'desktop.html'), desktopLauncher);

console.log('Desktop build complete!');
console.log('Run: npm run web');
console.log('Desktop version available at: web-build/desktop.html');