// NotePad++ Clone - Main Application JavaScript

// Global Variables
let currentFile = null;
let isModified = false;
let undoStack = [];
let redoStack = [];
let wordWrapEnabled = true;
let statusBarVisible = true;
let zoomLevel = 1;
let findIndex = -1;
let lastFindText = '';
let currentLanguage = 'plain';
let currentTheme = 'default';

// DOM Elements
const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('line-numbers');
const statusBar = document.getElementById('status-bar');
const lineCount = document.getElementById('line-count');
const columnCount = document.getElementById('column-count');
const charCount = document.getElementById('char-count');
const fileInfo = document.getElementById('file-info');
const languageInfo = document.getElementById('language');

// Initialize the application
function init() {
    updateLineNumbers();
    updateStatusBar();
    
    // Set up event listeners
    editor.addEventListener('scroll', syncScroll);
    editor.addEventListener('input', handleInput);
    editor.addEventListener('keydown', handleKeyDown);
    editor.addEventListener('mouseup', updateSelectionInfo);
    editor.addEventListener('keyup', updateSelectionInfo);
    
    // Close menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('menu-button') && 
            !e.target.classList.contains('menu-item')) {
            hideAllMenus();
        }
    });
    
    // Load from localStorage if available
    const savedContent = localStorage.getItem('notepad-content');
    const savedFile = localStorage.getItem('notepad-file');
    const savedTheme = localStorage.getItem('notepad-theme');
    const savedLanguage = localStorage.getItem('notepad-language');
    
    if (savedContent) {
        editor.value = savedContent;
    }
    
    if (savedFile) {
        currentFile = savedFile;
        fileInfo.textContent = savedFile;
    }
    
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
    
    updateLineNumbers();
    updateStatusBar();
}

// Menu Functions
function showMenu(menuName) {
    hideAllMenus();
    const menu = document.getElementById(menuName + '-menu');
    if (menu) {
        menu.classList.add('show');
    }
}

function hideAllMenus() {
    const menus = document.querySelectorAll('.menu-dropdown');
    menus.forEach(menu => {
        menu.classList.remove('show');
    });
}

// File Operations
function newFile() {
    if (isModified) {
        const confirmNew = confirm('You have unsaved changes. Create new file anyway?');
        if (!confirmNew) return;
    }
    
    editor.value = '';
    currentFile = null;
    isModified = false;
    fileInfo.textContent = 'Untitled';
    updateLineNumbers();
    updateStatusBar();
    hideAllMenus();
}

function openFile() {
    document.getElementById('file-input').click();
    hideAllMenus();
}

function handleFileOpen(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        editor.value = e.target.result;
        currentFile = file.name;
        isModified = false;
        fileInfo.textContent = file.name;
        
        // Detect language from file extension
        const detectedLanguage = detectLanguage(file.name);
        if (detectedLanguage) {
            setLanguage(detectedLanguage);
        }
        
        updateLineNumbers();
        updateStatusBar();
        
        // Save to localStorage
        localStorage.setItem('notepad-content', editor.value);
        localStorage.setItem('notepad-file', file.name);
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function saveFile() {
    if (!currentFile) {
        saveFileAs();
        return;
    }
    
    // In a real browser environment, we'd use the File System Access API
    // For this demo, we'll save to localStorage
    localStorage.setItem('notepad-content', editor.value);
    localStorage.setItem('notepad-file', currentFile);
    localStorage.setItem('notepad-theme', currentTheme);
    localStorage.setItem('notepad-language', currentLanguage);
    isModified = false;
    updateStatusBar();
    hideAllMenus();
    
    // Show saved notification
    showNotification('File saved: ' + currentFile);
}

function saveFileAs() {
    // In a real implementation, this would trigger a save dialog
    // For this demo, we'll prompt for a filename
    const fileName = prompt('Save file as:', currentFile || 'untitled.txt');
    if (!fileName) return;
    
    currentFile = fileName;
    fileInfo.textContent = fileName;
    saveFile();
    hideAllMenus();
}

function printFile() {
    // Print the current content
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write('<pre>' + escapeHtml(editor.value) + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    hideAllMenus();
}

function exitApp() {
    if (isModified) {
        const confirmExit = confirm('You have unsaved changes. Exit anyway?');
        if (!confirmExit) return;
    }
    
    // Save state before closing
    localStorage.setItem('notepad-content', editor.value);
    localStorage.setItem('notepad-file', currentFile || '');
    localStorage.setItem('notepad-theme', currentTheme);
    localStorage.setItem('notepad-language', currentLanguage);
    
    // In a real app, this would close the window
    // For this demo, we'll just clear the editor
    window.close();
}

// Edit Operations
function undo() {
    if (undoStack.length > 0) {
        const currentState = editor.value;
        redoStack.push(currentState);
        editor.value = undoStack.pop();
        updateLineNumbers();
        updateStatusBar();
    }
    hideAllMenus();
}

function redo() {
    if (redoStack.length > 0) {
        const currentState = editor.value;
        undoStack.push(currentState);
        editor.value = redoStack.pop();
        updateLineNumbers();
        updateStatusBar();
    }
    hideAllMenus();
}

function cut() {
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    if (selection) {
        navigator.clipboard.writeText(selection);
        const newText = editor.value.substring(0, editor.selectionStart) + 
                       editor.value.substring(editor.selectionEnd);
        saveToUndoStack(editor.value);
        editor.value = newText;
        updateLineNumbers();
        updateStatusBar();
    }
    hideAllMenus();
}

function copy() {
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    if (selection) {
        navigator.clipboard.writeText(selection);
    }
    hideAllMenus();
}

function paste() {
    navigator.clipboard.readText().then(text => {
        if (text) {
            saveToUndoStack(editor.value);
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + text + editor.value.substring(end);
            editor.selectionStart = start + text.length;
            editor.selectionEnd = start + text.length;
            updateLineNumbers();
            updateStatusBar();
        }
    });
    hideAllMenus();
}

function deleteText() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    if (start !== end) {
        saveToUndoStack(editor.value);
        editor.value = editor.value.substring(0, start) + editor.value.substring(end);
        editor.selectionStart = start;
        editor.selectionEnd = start;
        updateLineNumbers();
        updateStatusBar();
    }
    hideAllMenus();
}

function selectAll() {
    editor.select();
    updateSelectionInfo();
    hideAllMenus();
}

// View Operations
function toggleStatusBar() {
    statusBarVisible = !statusBarVisible;
    statusBar.style.display = statusBarVisible ? 'flex' : 'none';
    hideAllMenus();
}

function toggleWordWrap() {
    wordWrapEnabled = !wordWrapEnabled;
    editor.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
    editor.style.wordWrap = wordWrapEnabled ? 'break-word' : 'normal';
    editor.style.overflowX = wordWrapEnabled ? 'hidden' : 'auto';
    updateLineNumbers();
    hideAllMenus();
}

function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 3);
    editor.style.fontSize = (14 * zoomLevel) + 'px';
    lineNumbers.style.fontSize = (14 * zoomLevel) + 'px';
    updateLineNumbers();
    hideAllMenus();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    editor.style.fontSize = (14 * zoomLevel) + 'px';
    lineNumbers.style.fontSize = (14 * zoomLevel) + 'px';
    updateLineNumbers();
    hideAllMenus();
}

function resetZoom() {
    zoomLevel = 1;
    editor.style.fontSize = '14px';
    lineNumbers.style.fontSize = '14px';
    updateLineNumbers();
    hideAllMenus();
}

// Theme Operations
function showThemeSelector() {
    document.getElementById('theme-selector').classList.add('show');
    hideAllMenus();
}

function closeThemeSelector() {
    document.getElementById('theme-selector').classList.remove('show');
}

function setTheme(theme) {
    // Remove all theme classes
    document.body.className = '';
    
    // Add the selected theme class
    if (theme !== 'default') {
        document.body.className = theme + '-theme';
    }
    
    currentTheme = theme;
    localStorage.setItem('notepad-theme', theme);
    
    // Update theme options UI
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('onclick').includes(`'${theme}'`)) {
            option.classList.add('active');
        }
    });
    
    closeThemeSelector();
}

// Language Operations
function setLanguage(language) {
    currentLanguage = language;
    
    // Update language display
    const languageNames = {
        'plain': 'Plain Text',
        'javascript': 'JavaScript',
        'html': 'HTML',
        'css': 'CSS',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++'
    };
    
    languageInfo.textContent = languageNames[language] || language;
    localStorage.setItem('notepad-language', language);
    hideAllMenus();
    
    // In a real implementation, we would apply syntax highlighting here
    // For now, we'll just store the language preference
}

// Format Operations
function setFont() {
    // In a real implementation, this would show a font dialog
    const font = prompt('Enter font family:', editor.style.fontFamily || 'Consolas');
    if (font) {
        editor.style.fontFamily = font;
        lineNumbers.style.fontFamily = font;
    }
    hideAllMenus();
}

// Find and Replace
function findText() {
    document.getElementById('find-dialog').style.display = 'block';
    document.getElementById('find-text').focus();
    hideAllMenus();
}

function findNext() {
    const findText = document.getElementById('find-text').value;
    const caseSensitive = document.getElementById('find-case-sensitive').checked;
    const wholeWord = document.getElementById('find-whole-word').checked;
    const useRegex = document.getElementById('find-regex').checked;
    
    if (!findText) return;
    
    const text = editor.value;
    let searchText = findText;
    let content = text;
    
    if (!caseSensitive) {
        searchText = findText.toLowerCase();
        content = text.toLowerCase();
    }
    
    let startIndex = editor.selectionEnd;
    let foundIndex = -1;
    
    if (useRegex) {
        try {
            const regex = new RegExp(searchText, caseSensitive ? 'g' : 'gi');
            const matches = [...content.matchAll(regex)];
            
            for (const match of matches) {
                if (match.index >= startIndex) {
                    foundIndex = match.index;
                    break;
                }
            }
            
            if (foundIndex === -1 && matches.length > 0) {
                foundIndex = matches[0].index;
            }
        } catch (e) {
            alert('Invalid regular expression: ' + e.message);
            return;
        }
    } else if (wholeWord) {
        // Whole word search
        const words = content.split(/\s+/);
        const currentWordStart = text.lastIndexOf(' ', startIndex - 1) + 1;
        
        for (let i = 0; i < words.length; i++) {
            const wordStart = text.indexOf(words[i], currentWordStart);
            if (wordStart !== -1 && wordStart < startIndex) {
                continue;
            }
            if (words[i] === searchText) {
                foundIndex = wordStart;
                break;
            }
        }
    } else {
        // Normal search
        foundIndex = content.indexOf(searchText, startIndex);
    }
    
    if (foundIndex !== -1) {
        editor.selectionStart = foundIndex;
        editor.selectionEnd = foundIndex + findText.length;
        editor.focus();
        editor.scrollTop = (foundIndex / text.length) * editor.scrollHeight;
        findIndex = foundIndex;
        lastFindText = findText;
    } else {
        alert('Text not found: ' + findText);
    }
}

function findPrevious() {
    const findText = document.getElementById('find-text').value;
    const caseSensitive = document.getElementById('find-case-sensitive').checked;
    const wholeWord = document.getElementById('find-whole-word').checked;
    const useRegex = document.getElementById('find-regex').checked;
    
    if (!findText) return;
    
    const text = editor.value;
    let searchText = findText;
    let content = text;
    
    if (!caseSensitive) {
        searchText = findText.toLowerCase();
        content = text.toLowerCase();
    }
    
    let startIndex = editor.selectionStart - findText.length;
    if (startIndex < 0) startIndex = 0;
    
    let foundIndex = -1;
    
    if (useRegex) {
        try {
            const regex = new RegExp(searchText, caseSensitive ? 'g' : 'gi');
            const matches = [...content.matchAll(regex)];
            
            for (let i = matches.length - 1; i >= 0; i--) {
                if (matches[i].index <= startIndex) {
                    foundIndex = matches[i].index;
                    break;
                }
            }
            
            if (foundIndex === -1 && matches.length > 0) {
                foundIndex = matches[matches.length - 1].index;
            }
        } catch (e) {
            alert('Invalid regular expression: ' + e.message);
            return;
        }
    } else if (wholeWord) {
        // Whole word search backwards
        const words = content.split(/\s+/);
        const currentWordEnd = text.indexOf(' ', startIndex);
        
        for (let i = words.length - 1; i >= 0; i--) {
            const wordStart = text.lastIndexOf(words[i], startIndex);
            if (wordStart !== -1 && wordStart + words[i].length > startIndex) {
                continue;
            }
            if (words[i] === searchText) {
                foundIndex = wordStart;
                break;
            }
        }
    } else {
        // Normal search backwards
        foundIndex = content.lastIndexOf(searchText, startIndex);
    }
    
    if (foundIndex !== -1) {
        editor.selectionStart = foundIndex;
        editor.selectionEnd = foundIndex + findText.length;
        editor.focus();
        editor.scrollTop = (foundIndex / text.length) * editor.scrollHeight;
        findIndex = foundIndex;
        lastFindText = findText;
    } else {
        alert('Text not found: ' + findText);
    }
}

function closeFindDialog() {
    document.getElementById('find-dialog').style.display = 'none';
}

function replaceText() {
    document.getElementById('replace-dialog').style.display = 'block';
    document.getElementById('replace-find').focus();
    hideAllMenus();
}

function replaceNext() {
    const findText = document.getElementById('replace-find').value;
    const replaceWith = document.getElementById('replace-with').value;
    
    if (!findText) return;
    
    // First find the text
    const originalSelectionStart = editor.selectionStart;
    const originalSelectionEnd = editor.selectionEnd;
    
    // Use the find functionality
    document.getElementById('find-text').value = findText;
    document.getElementById('find-case-sensitive').checked = 
        document.getElementById('replace-case-sensitive').checked;
    document.getElementById('find-whole-word').checked = 
        document.getElementById('replace-whole-word').checked;
    document.getElementById('find-regex').checked = 
        document.getElementById('replace-regex').checked;
    
    findNext();
    
    // If we found something, replace it
    if (editor.selectionStart !== originalSelectionStart || 
        editor.selectionEnd !== originalSelectionEnd) {
        
        saveToUndoStack(editor.value);
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + replaceWith + editor.value.substring(end);
        editor.selectionStart = start + replaceWith.length;
        editor.selectionEnd = start + replaceWith.length;
        updateLineNumbers();
        updateStatusBar();
    }
}

function replaceAll() {
    const findText = document.getElementById('replace-find').value;
    const replaceWith = document.getElementById('replace-with').value;
    const caseSensitive = document.getElementById('replace-case-sensitive').checked;
    const useRegex = document.getElementById('replace-regex').checked;
    
    if (!findText) return;
    
    const text = editor.value;
    let searchText = findText;
    let content = text;
    
    if (!caseSensitive && !useRegex) {
        searchText = findText.toLowerCase();
        content = text.toLowerCase();
    }
    
    let count = 0;
    let newText = text;
    
    if (useRegex) {
        try {
            const regex = new RegExp(searchText, caseSensitive ? 'g' : 'gi');
            newText = newText.replace(regex, replaceWith);
            count = (text.match(regex) || []).length;
        } catch (e) {
            alert('Invalid regular expression: ' + e.message);
            return;
        }
    } else {
        let index = 0;
        while (true) {
            const foundIndex = content.indexOf(searchText, index);
            if (foundIndex === -1) break;
            
            count++;
            newText = newText.substring(0, foundIndex) + replaceWith + newText.substring(foundIndex + findText.length);
            index = foundIndex + replaceWith.length;
            content = newText.toLowerCase();
        }
    }
    
    if (count > 0) {
        saveToUndoStack(editor.value);
        editor.value = newText;
        updateLineNumbers();
        updateStatusBar();
        alert(`Replaced ${count} occurrences of "${findText}"`);
    } else {
        alert('No occurrences found: ' + findText);
    }
}

function closeReplaceDialog() {
    document.getElementById('replace-dialog').style.display = 'none';
}

// Help Operations
function showAbout() {
    document.getElementById('about-dialog').style.display = 'block';
    hideAllMenus();
}

function closeAboutDialog() {
    document.getElementById('about-dialog').style.display = 'none';
}

// Utility Functions
function updateLineNumbers() {
    const lines = editor.value.split('\n');
    const lineCount = lines.length;
    
    let lineNumbersHtml = '';
    for (let i = 1; i <= lineCount; i++) {
        lineNumbersHtml += i + '\n';
    }
    
    lineNumbers.textContent = lineNumbersHtml;
    
    // Sync scroll position
    syncScroll();
}

function syncScroll() {
    lineNumbers.scrollTop = editor.scrollTop;
}

function updateStatusBar() {
    const text = editor.value;
    const lines = text.split('\n');
    const lineCount = lines.length;
    
    // Get cursor position
    const cursorPos = editor.selectionStart;
    let currentLine = 1;
    let currentColumn = 1;
    let charIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const lineLength = lines[i].length + 1; // +1 for newline
        if (charIndex + lineLength > cursorPos) {
            currentLine = i + 1;
            currentColumn = cursorPos - charIndex + 1;
            break;
        }
        charIndex += lineLength;
    }
    
    // Update status bar
    lineCount.textContent = `Line: ${currentLine}`;
    columnCount.textContent = `Column: ${currentColumn}`;
    charCount.textContent = `Characters: ${text.length}`;
    
    // Mark as modified if content changed
    if (text !== localStorage.getItem('notepad-content')) {
        isModified = true;
    } else {
        isModified = false;
    }
    
    // Update file info
    if (isModified) {
        fileInfo.textContent = (currentFile || 'Untitled') + ' *';
    } else {
        fileInfo.textContent = currentFile || 'Untitled';
    }
}

function updateSelectionInfo() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    
    // Update status bar with selection info
    if (start !== end) {
        const lines = editor.value.substring(0, start).split('\n');
        const startLine = lines.length;
        const startColumn = lines[lines.length - 1].length + 1;
        
        const endLines = editor.value.substring(0, end).split('\n');
        const endLine = endLines.length;
        const endColumn = endLines[endLines.length - 1].length + 1;
        
        lineCount.textContent = `Sel: ${end - start} chars`;
        columnCount.textContent = `From: ${startLine}:${startColumn}`;
        charCount.textContent = `To: ${endLine}:${endColumn}`;
    } else {
        updateStatusBar();
    }
}

function handleInput() {
    // Save to undo stack
    saveToUndoStack(editor.value);
    
    // Clear redo stack when new input
    redoStack = [];
    
    updateLineNumbers();
    updateStatusBar();
    
    // Save to localStorage
    localStorage.setItem('notepad-content', editor.value);
}

function saveToUndoStack(state) {
    // Limit undo stack size
    if (undoStack.length > 100) {
        undoStack.shift();
    }
    undoStack.push(state);
}

function handleKeyDown(event) {
    // Handle common keyboard shortcuts
    if (event.ctrlKey) {
        switch (event.key) {
            case 's':
                event.preventDefault();
                saveFile();
                break;
            case 'o':
                event.preventDefault();
                openFile();
                break;
            case 'n':
                event.preventDefault();
                newFile();
                break;
            case 'z':
                event.preventDefault();
                undo();
                break;
            case 'y':
                event.preventDefault();
                redo();
                break;
            case 'x':
                event.preventDefault();
                cut();
                break;
            case 'c':
                event.preventDefault();
                copy();
                break;
            case 'v':
                event.preventDefault();
                paste();
                break;
            case 'a':
                event.preventDefault();
                selectAll();
                break;
            case 'f':
                event.preventDefault();
                findText();
                break;
            case 'h':
                event.preventDefault();
                replaceText();
                break;
            case 'p':
                event.preventDefault();
                printFile();
                break;
        }
    }
    
    // Handle tab key
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const spaces = '    '; // 4 spaces for tab
        
        saveToUndoStack(editor.value);
        editor.value = editor.value.substring(0, start) + spaces + editor.value.substring(end);
        editor.selectionStart = start + spaces.length;
        editor.selectionEnd = start + spaces.length;
        updateLineNumbers();
        updateStatusBar();
    }
    
    // Handle auto-indent for new lines
    if (event.key === 'Enter') {
        const start = editor.selectionStart;
        const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
        const lineText = editor.value.substring(lineStart, start);
        const leadingSpaces = lineText.match(/^\s*/)[0];
        
        // Insert newline and preserve indentation
        setTimeout(() => {
            const newStart = editor.selectionStart;
            saveToUndoStack(editor.value);
            editor.value = editor.value.substring(0, newStart) + leadingSpaces + editor.value.substring(newStart);
            editor.selectionStart = newStart + leadingSpaces.length;
            editor.selectionEnd = newStart + leadingSpaces.length;
            updateLineNumbers();
            updateStatusBar();
        }, 0);
    }
    
    updateSelectionInfo();
}

function showNotification(message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Escape HTML special characters
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;');
}

// Initialize the application when the page loads
window.onload = init;

// Save content before page unload
window.onbeforeunload = function() {
    if (isModified) {
        localStorage.setItem('notepad-content', editor.value);
        localStorage.setItem('notepad-file', currentFile || '');
        localStorage.setItem('notepad-theme', currentTheme);
        localStorage.setItem('notepad-language', currentLanguage);
    }
};
