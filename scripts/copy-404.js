
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

try {
    if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log('✅ Success: Copied index.html to 404.html for GitHub Pages routing.');
    } else {
        console.error('❌ Error: dist/index.html does not exist. Build may have failed.');
        process.exit(1);
    }
} catch (error) {
    console.error('❌ Error copying file:', error);
    process.exit(1);
}
