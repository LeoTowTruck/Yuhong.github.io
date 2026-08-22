import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback route handling HTML files or index.html
app.get('*', (req, res) => {
  let filePath = path.join(__dirname, req.path);
  
  // If request doesn't have an extension and doesn't end with /, try adding .html
  if (!path.extname(req.path) && !req.path.endsWith('/')) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
