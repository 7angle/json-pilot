# JSON Pilot ✈️

![JSON Pilot](cover.png)

A powerful browser extension for viewing, formatting, and exploring JSON content in your browser. Transform raw JSON data into an interactive, beautifully formatted tree view with powerful exploration features.

## ✨ Features

- 🎨 **Beautiful Interface**: Clean, modern design with intuitive controls
- 🌗 **Theme Support**: Switch between light and dark themes
- 🔍 **Interactive Exploration**: 
  - Expand/collapse nodes
  - Click to select nodes
  - Copy JSON paths
  - Copy selected values
- 🎯 **Path Navigation**: Visual path display for selected nodes
- 🚀 **Performance Optimized**: Handles large JSON files with ease
- 💡 **Smart Detection**: Automatically detects and formats JSON content
- 🛡️ **Privacy Focused**: All processing happens locally in your browser
- 🔒 **Secure**: No external servers, no data collection

## 🚀 Quick Start

### Chrome Installation
1. Download the latest release from [GitHub Releases](https://github.com/7angle/json-pilot/releases)
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

### Firefox Installation
1. Download the latest release from [GitHub Releases](https://github.com/7angle/json-pilot/releases)
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on" and select the `manifest.json` file

## 💻 Development

### Prerequisites
- Node.js 16.x or higher
- npm 7.x or higher
- Modern web browser (Chrome 88+ or Firefox 109+)

### Setup
```bash
# Clone the repository
git clone https://github.com/7angle/json-pilot.git

# Navigate to project directory
cd json-pilot

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
json-pilot/
├── src/                # Source code
│   ├── App.vue        # Main application component
│   ├── components/    # Vue components
│   └── main.js        # Application entry point
├── public/            # Static assets
├── manifest.json      # Extension manifest
├── background.js      # Background script
├── content.js         # Content script
└── vite.config.js     # Vite configuration
```

## 🎯 Usage

1. **View JSON**: Navigate to any URL that returns JSON content
   - The extension automatically detects and formats JSON
   - Raw JSON text is also transformed into the viewer

2. **Interact with JSON**:
   - Click the expand/collapse icons to explore nested objects
   - Click on any value to select it
   - Use the copy button to copy selected JSON
   - Toggle between light and dark themes

3. **Navigation**:
   - Use the path display to understand your location in the JSON structure
   - Click the expand/collapse all button to quickly view or hide all nodes

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy

JSON Pilot takes your privacy seriously. All JSON processing happens locally in your browser - no data is ever sent to external servers. Read our [Privacy Policy](PRIVACY.md) for more details.

## 📞 Support

- 📧 Email: hello@7angle.com
- 🐛 Issues: [GitHub Issues](https://github.com/7angle/json-pilot/issues)
- 📦 Releases: [GitHub Releases](https://github.com/7angle/json-pilot/releases)

## ⭐ Show Your Support

If you find JSON Pilot helpful, please consider:
- Starring the repository
- Sharing it with others
- [Reporting issues](https://github.com/7angle/json-pilot/issues) if you find any
- Contributing to the project

---
Made with ❤️ by [7 Angle](https://7angle.com) 