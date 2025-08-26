# Zip With Path
<img src="logo.png" alt="Logo" width="256">

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/kakha13.zip-with-path.svg)](https://marketplace.visualstudio.com/items?itemName=kakha13.vscode-zip-path)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/kakha13.zip-with-path.svg)](https://marketplace.visualstudio.com/items?itemName=kakha13.vscode-zip-path)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/kakha13.zip-with-path.svg)](https://marketplace.visualstudio.com/items?itemName=kakha13.vscode-zip-path)

Zip files and folders directly from VS Code explorer with full path preservation or simplified structure options.

## Features

### 🎯 Smart Context Menu
Right-click any file or folder in VS Code Explorer to access **Zip With Path** submenu with intelligent options:

![Context Menu Demo](demo-context-menu.png)

### 📁 Two Zipping Modes

#### **With Full Path** 
Preserves complete folder hierarchy from workspace root:
```
Workspace: /my-project/
File: /my-project/src/components/Button.tsx
Result: Button.zip contains → src/components/Button.tsx
```

#### **Files Only** 
Creates clean zip with just the files/folders:
```
Workspace: /my-project/
File: /my-project/src/components/Button.tsx  
Result: Button.zip contains → Button.tsx
```

### 🔄 Multiple Selection Support
Select multiple files and folders (Ctrl+Click) for batch zipping:

![Multiple Selection](demo-context-menu.png)

### ⚡ Features at a Glance

| Feature | Description |
|---------|-------------|
| **Smart Naming** | Automatically handles file conflicts with `file(1).zip`, `file(2).zip` |
| **Progress Tracking** | Real-time progress notifications during zip creation |
| **Workspace Safety** | Only operates within workspace boundaries for security |
| **Cross-Platform** | Works on Windows, macOS, and Linux |
| **No Overwriting** | Never overwrites existing files without confirmation |
| **Size Display** | Shows compressed file size after creation |

## Usage Examples

### Single File
1. Right-click any file in Explorer
2. Select **Zip With Path** → **With full path** or **Files only**
3. Zip created in same directory

### Single Folder  
1. Right-click any folder in Explorer
2. Choose **Zip With Path** → **With full path** or **Folder only**
3. Complete folder structure preserved or simplified

### Multiple Items
1. Select multiple files/folders (Ctrl+Click)
2. Right-click selection → **Zip With Path**
3. Choose path preservation option
4. All items combined into single zip

### Workspace
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Zip workspace"
3. Select workspace folder to compress

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "Zip With Path"
4. Click **Install**

### From Marketplace Website
[**Download from VS Code Marketplace**](https://marketplace.visualstudio.com/items?itemName=kakha13.vscode-zip-path)

### Manual Installation
1. Download the `.vsix` file from [Releases](https://github.com/kakha13/zip-with-path/releases)
2. In VS Code: `Ctrl+Shift+P` → "Extensions: Install from VSIX..."
3. Select the downloaded file

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| Zip File (Full Path) | Right-click file | Preserve full workspace path |
| Zip File (Files Only) | Right-click file | File name only |
| Zip Folder (Full Path) | Right-click folder | Preserve folder hierarchy |  
| Zip Folder (Folder Only) | Right-click folder | Just folder contents |
| Zip Selected (Full Path) | Right-click selection | Multiple items with paths |
| Zip Selected (Files Only) | Right-click selection | Multiple items, names only |
| Zip Workspace | Command Palette | Entire workspace folder |

## Configuration

No configuration required! The extension works out of the box with intelligent defaults.

## Examples

### Example 1: Component File
```
Project structure:
my-app/
├── src/
│   └── components/
│       └── Button.tsx
└── package.json

Right-click Button.tsx:
• "With full path" → Button.zip contains: src/components/Button.tsx
• "Files only" → Button.zip contains: Button.tsx
```

### Example 2: Multiple Files
```
Select: Header.tsx, Footer.tsx, Button.tsx

Right-click selection:
• "With full path" → selected_files.zip contains:
  - src/components/Header.tsx
  - src/components/Footer.tsx  
  - src/components/Button.tsx
• "Files only" → selected_files.zip contains:
  - Header.tsx
  - Footer.tsx
  - Button.tsx
```

### Example 3: Entire Folder
```
Right-click src/ folder:
• "With full path" → src.zip contains: src/components/..., src/utils/...
• "Folder only" → src.zip contains: components/..., utils/...
```

## Requirements

- VS Code 1.74.0 or higher
- Node.js (for development)

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/kakha13/zip-with-path/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/kakha13/zip-with-path/discussions)
- ⭐ **Rate & Review**: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=kakha13.vscode-zip-path)

## Release Notes

### 0.0.1
- Initial release
- Context menu integration
- Full path and files-only zipping modes
- Multiple file selection support
- Progress notifications
- Cross-platform compatibility

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Enjoy zipping! 🎉**

Made with ❤️ for the VS Code community