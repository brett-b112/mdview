# Markdown Viewer (mdview)

A simple, browser-based markdown viewer that launches from your terminal. View and edit markdown files with live preview, supporting common markdown syntax.

Jupyter for Markdown 


## Installation

```bash
# Clone the repository
git clone https://github.com/brett-b112/mdview.git

# Navigate to the project directory
cd mdview

# Install dependencies
npm install

# Build the project
npm run build

# Install globally
npm link
```

## Usage

```bash
# View markdown files in current directory
mdview

# View markdown files in a specific directory
mdview /path/to/directory
```

### Keyboard Shortcuts

- Click "Edit" to modify content
- Click "Save" to save changes
- Click "Preview" to view rendered markdown

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Supported Markdown Syntax

### Headers

```markdown
# H1 Header
## H2 Header
### H3 Header
```

### Lists

```markdown
- Unordered list item
  - Nested item
* Another item
1. Ordered list item
2. Second item
```

### Code Blocks

````markdown
```javascript
console.log("Hello, World!");
```
````

### Blockquotes

```markdown
> This is a blockquote
```

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Task Lists

```markdown
- [ ] Unchecked task
- [x] Checked task
```

### Horizontal Rules

```markdown
---
```

### Emphasis

```markdown
**Bold text**
*Italic text*
***Bold and italic***
```

## Dependencies

- React
- Express
- TailwindCSS
- Lucide Icons

## License

MIT License
