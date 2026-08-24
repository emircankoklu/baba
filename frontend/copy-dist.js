const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'out');
const destDir = path.join(__dirname, '..', 'backend', 'frontend_dist');

console.log('Copying frontend/out to backend/frontend_dist...');

if (fs.existsSync(srcDir)) {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Successfully updated backend/frontend_dist with the latest build!');
} else {
  console.error('Error: frontend/out directory does not exist. Run "next build" first.');
  process.exit(1);
}
