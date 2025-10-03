import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile, readdir, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));
app.use(express.json());

// API endpoint to get markdown files from a directory
app.get('/api/files', async (req, res) => {
  const dir = req.query.dir || process.cwd();
  try {
    const files = await readdir(dir, { withFileTypes: true });
    const markdownFiles = [];
    
    for (const file of files) {
      if (file.isFile() && file.name.endsWith('.md')) {
        const content = await readFile(join(dir, file.name), 'utf-8');
        markdownFiles.push({
          name: file.name,
          path: join(dir, file.name),
          content
        });
      }
    }
    
    res.json(markdownFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to save a markdown file
app.post('/api/files/save', async (req, res) => {
  const { path, content } = req.body;
  try {
    await writeFile(path, content, 'utf-8');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
