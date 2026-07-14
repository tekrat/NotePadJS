# NotePadJS Clone

A comprehensive text editor clone inspired by NotePad++, built entirely with HTML, CSS, and JavaScript.

## Features

### Core Features
- **File Operations**: New, Open, Save, Save As, Print, Exit
- **Edit Operations**: Undo, Redo, Cut, Copy, Paste, Delete, Select All
- **Find & Replace**: Advanced search with regex support, case sensitivity, whole word matching
- **View Options**: Toggle status bar, word wrap, zoom in/out, reset zoom
- **Multiple Themes**: Default (Dark), Light, Solarized Dark, Solarized Light, Monokai, Dracula
- **Syntax Highlighting**: Support for JavaScript, HTML, CSS, Python, Java, C++

### User Interface
- **Menu Bar**: Traditional menu system with dropdown menus
- **Toolbar**: Quick access to common operations with icons
- **Line Numbers**: Display line numbers with sync scrolling
- **Status Bar**: Shows current line, column, character count, file info, encoding, and EOL type
- **Dialogs**: Find, Replace, About, and Theme selector dialogs

### Keyboard Shortcuts
- `Ctrl+S`: Save
- `Ctrl+O`: Open
- `Ctrl+N`: New
- `Ctrl+Z`: Undo
- `Ctrl+Y`: Redo
- `Ctrl+X`: Cut
- `Ctrl+C`: Copy
- `Ctrl+V`: Paste
- `Ctrl+A`: Select All
- `Ctrl+F`: Find
- `Ctrl+H`: Replace
- `Ctrl+P`: Print

## Usage

### Local Usage
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start editing!

### Web Server
For best results, serve the files using a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
NotePadJS/
├── index.html      # Main HTML file
├── styles.css      # Main stylesheet
├── themes.css      # Theme definitions
├── app.js          # Main application logic
├── syntax.js       # Syntax highlighting module
└── README.md       # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Edge
- Safari (limited clipboard functionality)

## Features in Detail

### Syntax Highlighting
The editor supports syntax highlighting for multiple programming languages:
- JavaScript
- HTML
- CSS
- Python
- Java
- C++

Language is automatically detected based on file extension, or can be manually set from the Language menu.

### Themes
Choose from multiple color themes:
- **Default (Dark)**: Dark theme with blue accents
- **Light**: Light theme for better readability in bright environments
- **Solarized Dark**: Popular Solarized color scheme (dark variant)
- **Solarized Light**: Solarized color scheme (light variant)
- **Monokai**: Popular Monokai color scheme
- **Dracula**: Popular Dracula color scheme

### Find & Replace
- **Find Next/Previous**: Navigate through search results
- **Match Case**: Case-sensitive search
- **Whole Word**: Match whole words only
- **Regular Expressions**: Use regex patterns for advanced searching
- **Replace**: Replace individual occurrences
- **Replace All**: Replace all occurrences at once

### Status Bar
The status bar displays:
- Current line number
- Current column number
- Total character count
- Current language
- File name (with * for unsaved changes)
- Encoding (UTF-8)
- End-of-line type (Windows CR LF)

### Persistence
- Content is automatically saved to localStorage
- Theme and language preferences are preserved
- File name is remembered between sessions

## Customization

### Adding New Themes
1. Add a new theme class in `themes.css`
2. Add the theme option to the theme selector in `index.html`
3. Add the theme to the `setTheme` function in `app.js`

### Adding New Languages
1. Add the language definition to `syntax.js`
2. Add the language option to the language menu in `index.html`
3. Add the language to the `setLanguage` function in `app.js`

## Limitations

- **File System Access**: Due to browser security restrictions, file operations are limited to localStorage. In a real application, you would need to use the File System Access API or run as a desktop application.
- **Clipboard**: Some browsers may restrict clipboard access without user interaction.
- **Printing**: Basic printing functionality is provided, but advanced print options are not available.

## Future Enhancements

- [ ] Multiple tabs for editing multiple files
- [ ] Split view for comparing files
- [ ] Code folding
- [ ] Auto-completion
- [ ] Snippets
- [ ] Plugins/Extensions
- [ ] Settings dialog for customization
- [ ] Session management
- [ ] File browser sidebar

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Inspired by NotePad++ (https://notepad-plus-plus.org/)

Built with pure HTML, CSS, and JavaScript - no external dependencies.
