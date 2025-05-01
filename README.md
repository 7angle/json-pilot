# JSON Viewer Browser Extension

A powerful browser extension for viewing, formatting, and exploring JSON content in your browser. Works with both Chrome and Firefox.

## Features

- 🎨 Automatic JSON detection and formatting
- 🌳 Collapsible and expandable JSON tree view
- 🔍 Search within JSON content
- 📋 Copy JSON paths and values
- 🎭 Light/Dark theme support
- 🗺️ Optional minimap for navigation
- 🔧 Customizable initial expansion depth
- ⚡ Performance optimized for large JSON files

## Installation

### Chrome
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

### Firefox
1. Clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on" and select the `manifest.json` file

## Development

### Prerequisites
- Modern web browser (Chrome 88+ or Firefox 109+)
- Basic understanding of web technologies

### Project Structure
```
json-viewer/
├── manifest.json      # Extension manifest
├── background.js     # Background script
├── content.js        # Content script
├── viewer.html       # JSON viewer interface
├── viewer.css        # Styles for the viewer
├── viewer.js         # Viewer functionality
└── icons/           # Extension icons
```

### Building
No build step required! The extension can be loaded directly into browsers in development mode.

## Usage

1. Navigate to any URL that returns JSON content
2. The extension will automatically detect and format the JSON
3. Use the toolbar to:
   - Expand/collapse nodes
   - Search within the JSON
   - Copy JSON paths
   - Toggle dark/light theme
   - Show/hide minimap
4. Click on any value to copy it
5. Hover over objects to see their full path

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 