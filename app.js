// NotePad++ Clone - Main Application JavaScript with Multiple Tabs and Syntax Highlighting

// Global Variables
let tabs = []; // Array of tab objects
let currentTabIndex = 0;
let wordWrapEnabled = true;
let statusBarVisible = true;
let zoomLevel = 1;
let currentTheme = 'default';

// Tab object structure
function createTabObject() {
    return {
        id: generateId(),
        filename: 'Untitled',
        content: '',
        isModified: false,
        language: 'plain',
        undoStack: [],
        redoStack: [],
        cursorPosition: 0,
        scrollPosition: 0
    };
}

// Generate unique ID
function generateId() {
    return 'tab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// DOM Elements
const tabContainer = document.getElementById('tab-container');
const editorTabsContainer = document.getElementById('editor-tabs-container');
const statusBar = document.getElementById('status-bar');
const lineCount = document.getElementById('line-count');
const columnCount = document.getElementById('column-count');
const charCount = document.getElementById('char-count');
const fileInfo = document.getElementById('file-info');
const languageInfo = document.getElementById('language');
const tabContextMenu = document.getElementById('tab-context-menu');

// Initialize the application
function init() {
    // Create first tab
    newFile();
    
    // Set up event listeners for the tab bar
    tabContainer.addEventListener('click', handleTabClick);
    tabContainer.addEventListener('contextmenu', showTabContextMenu);
    
    // Close menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('menu-button') && 
            !e.target.classList.contains('menu-item')) {
            hideAllMenus();
        }
        
        // Hide context menu when clicking elsewhere
        if (!e.target.closest('#tab-context-menu') && 
            !e.target.classList.contains('tab')) {
            hideContextMenu();
        }
    });
    
    // Load from localStorage if available
    const savedTabs = localStorage.getItem('notepad-tabs');
    const savedTheme = localStorage.getItem('notepad-theme');
    
    if (savedTabs) {
        try {
            const tabsData = JSON.parse(savedTabs);
            tabsData.forEach((tabData, index) => {
                if (index === 0) return; // Skip first tab (already created)
                addNewTab(tabData);
            });
        } catch (e) {
            console.error('Error loading tabs:', e);
        }
    }
    
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    updateStatusBar();
}

// Tab Management Functions
function addNewTab(tabData = null) {
    const tabObj = tabData || createTabObject();
    
    // Add to tabs array
    tabs.push(tabObj);
    
    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.dataset.id = tabObj.id;
    tabElement.innerHTML = `
        <span class="tab-title">${escapeHtml(tabObj.filename)}</span>
        <button class="tab-close" onclick="closeTab('${tabObj.id}')">\u00d7</button>
    `;
    
    // Add to tab container
    tabContainer.insertBefore(tabElement, tabContainer.lastChild);
    
    // Create editor tab
    const editorTab = document.createElement('div');
    editorTab.className = 'editor-tab';
    editorTab.dataset.id = tabObj.id;
    
    // Create line numbers
    const lineNumbers = document.createElement('div');
    lineNumbers.className = 'line-numbers';
    lineNumbers.id = `line-numbers-${tabObj.id}`;
    
    // Create editor container for highlighting
    const editorWrapper = document.createElement('div');
    editorWrapper.className = 'editor-wrapper';
    editorWrapper.style.position = 'relative';
    editorWrapper.style.flex = '1';
    editorWrapper.style.overflow = 'hidden';
    
    // Create the actual textarea editor
    const editor = document.createElement('textarea');
    editor.className = 'editor';
    editor.id = `editor-${tabObj.id}`;
    editor.spellcheck = false;
    editor.value = tabObj.content || '';
    editor.dataset.id = tabObj.id;
    editor.style.position = 'absolute';
    editor.style.top = '0';
    editor.style.left = '0';
    editor.style.width = '100%';
    editor.style.height = '100%';
    editor.style.backgroundColor = 'transparent';
    editor.style.color = 'transparent';
    editor.style.caretColor = '#ffffff';
    editor.style.zIndex = '2';
    
    // Create highlighted display div
    const highlightedDiv = document.createElement('pre');
    highlightedDiv.className = 'editor-highlighted';
    highlightedDiv.id = `highlighted-${tabObj.id}`;
    highlightedDiv.style.position = 'absolute';
    highlightedDiv.style.top = '0';
    highlightedDiv.style.left = '0';
    highlightedDiv.style.width = '100%';
    highlightedDiv.style.height = '100%';
    highlightedDiv.style.overflow = 'auto';
    highlightedDiv.style.pointerEvents = 'none';
    highlightedDiv.style.whiteSpace = 'pre-wrap';
    highlightedDiv.style.wordWrap = 'break-word';
    highlightedDiv.style.margin = '0';
    highlightedDiv.style.padding = '8px';
    highlightedDiv.style.fontFamily = 'Consolas, Courier New, monospace';
    highlightedDiv.style.fontSize = '14px';
    highlightedDiv.style.lineHeight = '1.5';
    highlightedDiv.style.zIndex = '1';
    
    // Set up editor event listeners
    editor.addEventListener('input', () => handleInput(tabObj.id));
    editor.addEventListener('scroll', () => syncScroll(tabObj.id));
    editor.addEventListener('keydown', (e) => handleKeyDown(e, tabObj.id));
    editor.addEventListener('mouseup', () => updateSelectionInfo(tabObj.id));
    editor.addEventListener('keyup', () => updateSelectionInfo(tabObj.id));
    editor.addEventListener('focus', () => updateSyntaxHighlighting(tabObj.id));
    
    // Add elements to wrapper
    editorWrapper.appendChild(highlightedDiv);
    editorWrapper.appendChild(editor);
    
    editorTab.appendChild(lineNumbers);
    editorTab.appendChild(editorWrapper);
    editorTabsContainer.appendChild(editorTab);
    
    // Switch to new tab
    switchToTab(tabObj.id);
    
    // Update line numbers
    updateLineNumbers(tabObj.id);
    
    // Initial syntax highlighting
    updateSyntaxHighlighting(tabObj.id);
    
    // Restore cursor and scroll position if available
    if (tabObj.cursorPosition) {
        editor.selectionStart = tabObj.cursorPosition;
        editor.selectionEnd = tabObj.cursorPosition;
    }
    if (tabObj.scrollPosition) {
        editor.scrollTop = tabObj.scrollPosition;
    }
    
    return tabObj.id;
}

function closeTab(tabId) {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // Check if tab is modified
    if (tabs[tabIndex].isModified) {
        const confirmClose = confirm(`You have unsaved changes in ${tabs[tabIndex].filename}. Close anyway?`);
        if (!confirmClose) return;
    }
    
    // Remove tab from array
    tabs.splice(tabIndex, 1);
    
    // Remove tab element
    const tabElement = document.querySelector(`.tab[data-id="${tabId}"]`);
    if (tabElement) {
        tabElement.remove();
    }
    
    // Remove editor tab
    const editorTab = document.querySelector(`.editor-tab[data-id="${tabId}"]`);
    if (editorTab) {
        editorTab.remove();
    }
    
    // Switch to previous tab or first tab
    if (currentTabIndex >= tabs.length) {
        currentTabIndex = Math.max(0, tabs.length - 1);
    }
    
    if (tabs.length > 0) {
        switchToTab(tabs[currentTabIndex].id);
    } else {
        // No tabs left, create a new one
        newFile();
    }
    
    saveTabsToLocalStorage();
}

function closeCurrentTab() {
    if (tabs.length <= 1) {
        // Don't close the last tab
        newFile();
        return;
    }
    
    const currentTab = tabs[currentTabIndex];
    closeTab(currentTab.id);
}

function closeOtherTabs() {
    const currentTab = tabs[currentTabIndex];
    const tabsToClose = tabs.filter(tab => tab.id !== currentTab.id);
    
    // Close all other tabs
    tabsToClose.forEach(tab => {
        const tabElement = document.querySelector(`.tab[data-id="${tab.id}"]`);
        if (tabElement) {
            tabElement.remove();
        }
        
        const editorTab = document.querySelector(`.editor-tab[data-id="${tab.id}"]`);
        if (editorTab) {
            editorTab.remove();
        }
    });
    
    // Keep only current tab
    tabs = [currentTab];
    currentTabIndex = 0;
    
    // Update tab elements
    const tabElements = document.querySelectorAll('.tab');
    tabElements.forEach(tab => {
        if (tab.dataset.id !== currentTab.id) {
            tab.remove();
        }
    });
    
    // Update editor tabs
    const editorTabs = document.querySelectorAll('.editor-tab');
    editorTabs.forEach(tab => {
        if (tab.dataset.id !== currentTab.id) {
            tab.remove();
        }
    });
    
    switchToTab(currentTab.id);
    saveTabsToLocalStorage();
}

function closeAllTabs() {
    if (tabs.length === 0) return;
    
    // Check for unsaved changes
    const hasUnsaved = tabs.some(tab => tab.isModified);
    if (hasUnsaved) {
        const confirmClose = confirm('You have unsaved changes. Close all tabs anyway?');
        if (!confirmClose) return;
    }
    
    // Remove all tabs
    tabs = [];
    tabContainer.innerHTML = '';
    editorTabsContainer.innerHTML = '';
    
    // Create a new tab
    newFile();
    saveTabsToLocalStorage();
}

function switchToTab(tabId) {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // Update current tab index
    currentTabIndex = tabIndex;
    
    // Update tab appearance
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-id="${tabId}"]`).classList.add('active');
    
    // Update editor tabs
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.editor-tab[data-id="${tabId}"]`).classList.add('active');
    
    // Update status bar
    updateStatusBar();
    
    // Save current scroll and cursor position
    const currentTab = tabs[currentTabIndex];
    const editor = document.getElementById(`editor-${tabId}`);
    if (editor) {
        currentTab.cursorPosition = editor.selectionStart;
        currentTab.scrollPosition = editor.scrollTop;
    }
    
    // Update syntax highlighting for the new tab
    updateSyntaxHighlighting(tabId);
    
    saveTabsToLocalStorage();
}

function handleTabClick(e) {
    if (e.target.classList.contains('tab-close')) {
        return; // Let the close button handle it
    }
    
    const tab = e.target.closest('.tab');
    if (tab) {
        switchToTab(tab.dataset.id);
    }
}

function showTabContextMenu(e) {
    e.preventDefault();
    
    const tab = e.target.closest('.tab');
    if (tab) {
        // Store which tab was right-clicked
        tabContextMenu.dataset.tabId = tab.dataset.id;
        
        // Position context menu
        tabContextMenu.style.left = e.clientX + 'px';
        tabContextMenu.style.top = e.clientY + 'px';
        tabContextMenu.classList.add('show');
    }
}

function hideContextMenu() {
    tabContextMenu.classList.remove('show');
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
    addNewTab();
    hideAllMenus();
}

function openFile() {
    document.getElementById('file-input').click();
    hideAllMenus();
}

function handleFileOpen(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            
            // Create new tab for this file
            const tabId = addNewTab({
                filename: file.name,
                content: content,
                isModified: false
            });
            
            // Detect language from file extension
            const tab = tabs.find(t => t.id === tabId);
            if (tab) {
                const detectedLanguage = detectLanguage(file.name);
                if (detectedLanguage) {
                    tab.language = detectedLanguage;
                    // Update language display
                    const languageNames = {
                        'plain': 'Plain Text',
                        'javascript': 'JavaScript',
                        'html': 'HTML',
                        'css': 'CSS',
                        'python': 'Python',
                        'java': 'Java',
                        'cpp': 'C++',
                        'markdown': 'Markdown'
                    };
                    languageInfo.textContent = languageNames[detectedLanguage] || detectedLanguage;
                }
            }
            
            updateStatusBar();
        };
        
        reader.readAsText(file);
    }
    
    // Reset file input
    event.target.value = '';
}

function saveFile() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    // Update tab content
    currentTab.content = editor.value;
    
    // In a real browser environment, we'd use the File System Access API
    // For this demo, we'll save to localStorage
    saveTabsToLocalStorage();
    currentTab.isModified = false;
    updateStatusBar();
    hideAllMenus();
    
    // Show saved notification
    showNotification(`File saved: ${currentTab.filename}`);
}

function saveFileAs() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    // In a real implementation, this would trigger a save dialog
    // For this demo, we'll prompt for a filename
    const fileName = prompt('Save file as:', currentTab.filename);
    if (!fileName) return;
    
    currentTab.filename = fileName;
    currentTab.content = editor.value;
    currentTab.isModified = false;
    
    // Update tab title
    const tabElement = document.querySelector(`.tab[data-id="${currentTab.id}"] .tab-title`);
    if (tabElement) {
        tabElement.textContent = escapeHtml(fileName);
    }
    
    saveTabsToLocalStorage();
    updateStatusBar();
    hideAllMenus();
}

function saveAllFiles() {
    // Save all modified tabs
    tabs.forEach(tab => {
        const editor = document.getElementById(`editor-${tab.id}`);
        if (editor) {
            tab.content = editor.value;
            tab.isModified = false;
        }
    });
    
    saveTabsToLocalStorage();
    updateStatusBar();
    hideAllMenus();
    
    showNotification(`All ${tabs.length} files saved`);
}

function printFile() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
    // Check for unsaved changes
    const hasUnsaved = tabs.some(tab => tab.isModified);
    if (hasUnsaved) {
        const confirmExit = confirm('You have unsaved changes. Exit anyway?');
        if (!confirmExit) return;
    }
    
    // Save state before closing
    saveTabsToLocalStorage();
    localStorage.setItem('notepad-theme', currentTheme);
    
    // In a real app, this would close the window
    window.close();
}

// Edit Operations
function undo() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    if (currentTab.undoStack.length > 0) {
        const currentState = editor.value;
        currentTab.redoStack.push(currentState);
        editor.value = currentTab.undoStack.pop();
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
        updateStatusBar();
    }
    hideAllMenus();
}

function redo() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    if (currentTab.redoStack.length > 0) {
        const currentState = editor.value;
        currentTab.undoStack.push(currentState);
        editor.value = currentTab.redoStack.pop();
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
        updateStatusBar();
    }
    hideAllMenus();
}

function cut() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    if (selection) {
        navigator.clipboard.writeText(selection);
        const newText = editor.value.substring(0, editor.selectionStart) + 
                       editor.value.substring(editor.selectionEnd);
        currentTab.undoStack.push(editor.value);
        editor.value = newText;
        currentTab.isModified = true;
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
        updateStatusBar();
    }
    hideAllMenus();
}

function copy() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    const selection = editor.value.substring(editor.selectionStart, editor.selectionEnd);
    if (selection) {
        navigator.clipboard.writeText(selection);
    }
    hideAllMenus();
}

function paste() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    navigator.clipboard.readText().then(text => {
        if (text) {
            currentTab.undoStack.push(editor.value);
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + text + editor.value.substring(end);
            editor.selectionStart = start + text.length;
            editor.selectionEnd = start + text.length;
            currentTab.isModified = true;
            updateLineNumbers(currentTab.id);
            updateSyntaxHighlighting(currentTab.id);
            updateStatusBar();
        }
    });
    hideAllMenus();
}

function deleteText() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    if (start !== end) {
        currentTab.undoStack.push(editor.value);
        editor.value = editor.value.substring(0, start) + editor.value.substring(end);
        editor.selectionStart = start;
        editor.selectionEnd = start;
        currentTab.isModified = true;
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
        updateStatusBar();
    }
    hideAllMenus();
}

function selectAll() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
    editor.select();
    updateSelectionInfo(currentTab.id);
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
    document.querySelectorAll('.editor').forEach(editor => {
        editor.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
        editor.style.wordWrap = wordWrapEnabled ? 'break-word' : 'normal';
        editor.style.overflowX = wordWrapEnabled ? 'hidden' : 'auto';
    });
    
    document.querySelectorAll('.editor-highlighted').forEach(highlighted => {
        highlighted.style.whiteSpace = wordWrapEnabled ? 'pre-wrap' : 'pre';
        highlighted.style.wordWrap = wordWrapEnabled ? 'break-word' : 'normal';
        highlighted.style.overflowX = wordWrapEnabled ? 'hidden' : 'auto';
    });
    
    // Update line numbers for all tabs
    tabs.forEach(tab => {
        updateLineNumbers(tab.id);
    });
    
    hideAllMenus();
}

function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 3);
    document.querySelectorAll('.editor').forEach(editor => {
        editor.style.fontSize = (14 * zoomLevel) + 'px';
    });
    document.querySelectorAll('.line-numbers').forEach(lineNumbers => {
        lineNumbers.style.fontSize = (14 * zoomLevel) + 'px';
    });
    document.querySelectorAll('.editor-highlighted').forEach(highlighted => {
        highlighted.style.fontSize = (14 * zoomLevel) + 'px';
    });
    
    tabs.forEach(tab => {
        updateLineNumbers(tab.id);
        updateSyntaxHighlighting(tab.id);
    });
    
    hideAllMenus();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    document.querySelectorAll('.editor').forEach(editor => {
        editor.style.fontSize = (14 * zoomLevel) + 'px';
    });
    document.querySelectorAll('.line-numbers').forEach(lineNumbers => {
        lineNumbers.style.fontSize = (14 * zoomLevel) + 'px';
    });
    document.querySelectorAll('.editor-highlighted').forEach(highlighted => {
        highlighted.style.fontSize = (14 * zoomLevel) + 'px';
    });
    
    tabs.forEach(tab => {
        updateLineNumbers(tab.id);
        updateSyntaxHighlighting(tab.id);
    });
    
    hideAllMenus();
}

function resetZoom() {
    zoomLevel = 1;
    document.querySelectorAll('.editor').forEach(editor => {
        editor.style.fontSize = '14px';
    });
    document.querySelectorAll('.line-numbers').forEach(lineNumbers => {
        lineNumbers.style.fontSize = '14px';
    });
    document.querySelectorAll('.editor-highlighted').forEach(highlighted => {
        highlighted.style.fontSize = '14px';
    });
    
    tabs.forEach(tab => {
        updateLineNumbers(tab.id);
        updateSyntaxHighlighting(tab.id);
    });
    
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
    
    // Re-apply syntax highlighting for all tabs with new theme
    tabs.forEach(tab => {
        updateSyntaxHighlighting(tab.id);
    });
    
    closeThemeSelector();
}

// Language Operations
function setLanguage(language) {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    currentTab.language = language;
    
    // Update language display
    const languageNames = {
        'plain': 'Plain Text',
        'javascript': 'JavaScript',
        'html': 'HTML',
        'css': 'CSS',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'markdown': 'Markdown'
    };
    
    languageInfo.textContent = languageNames[language] || language;
    saveTabsToLocalStorage();
    hideAllMenus();
    
    // Update syntax highlighting for current tab
    updateSyntaxHighlighting(currentTab.id);
}

// Format Operations
function setFont() {
    // In a real implementation, this would show a font dialog
    const font = prompt('Enter font family:', 'Consolas');
    if (font) {
        document.querySelectorAll('.editor').forEach(editor => {
            editor.style.fontFamily = font;
        });
        document.querySelectorAll('.line-numbers').forEach(lineNumbers => {
            lineNumbers.style.fontFamily = font;
        });
        document.querySelectorAll('.editor-highlighted').forEach(highlighted => {
            highlighted.style.fontFamily = font;
        });
        
        tabs.forEach(tab => {
            updateSyntaxHighlighting(tab.id);
        });
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
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
    } else {
        alert('Text not found: ' + findText);
    }
}

function findPrevious() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
        
        currentTab.undoStack.push(editor.value);
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + replaceWith + editor.value.substring(end);
        editor.selectionStart = start + replaceWith.length;
        editor.selectionEnd = start + replaceWith.length;
        currentTab.isModified = true;
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
        updateStatusBar();
    }
}

function replaceAll() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
        currentTab.undoStack.push(editor.value);
        editor.value = newText;
        currentTab.isModified = true;
        updateLineNumbers(currentTab.id);
        updateSyntaxHighlighting(currentTab.id);
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

// Syntax Highlighting Functions
function updateSyntaxHighlighting(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    const editor = document.getElementById(`editor-${tabId}`);
    const highlightedDiv = document.getElementById(`highlighted-${tabId}`);
    
    if (!editor || !highlightedDiv) return;
    
    const text = editor.value;
    const language = tab.language || 'plain';
    
    if (language === 'plain') {
        highlightedDiv.innerHTML = escapeHtml(text);
    } else {
        highlightedDiv.innerHTML = applySyntaxHighlighting(text, language);
    }
    
    // Sync scroll position
    highlightedDiv.scrollTop = editor.scrollTop;
    highlightedDiv.scrollLeft = editor.scrollLeft;
}

function syncScroll(tabId) {
    const editor = document.getElementById(`editor-${tabId}`);
    const lineNumbers = document.getElementById(`line-numbers-${tabId}`);
    const highlightedDiv = document.getElementById(`highlighted-${tabId}`);
    
    if (editor && lineNumbers) {
        lineNumbers.scrollTop = editor.scrollTop;
    }
    
    if (editor && highlightedDiv) {
        highlightedDiv.scrollTop = editor.scrollTop;
        highlightedDiv.scrollLeft = editor.scrollLeft;
    }
}

// Utility Functions
function updateLineNumbers(tabId) {
    const editor = document.getElementById(`editor-${tabId}`);
    if (!editor) return;
    
    const lineNumbers = document.getElementById(`line-numbers-${tabId}`);
    if (!lineNumbers) return;
    
    const lines = editor.value.split('\n');
    const lineCount = lines.length;
    
    let lineNumbersHtml = '';
    for (let i = 1; i <= lineCount; i++) {
        lineNumbersHtml += i + '\n';
    }
    
    lineNumbers.textContent = lineNumbersHtml;
    
    // Sync scroll position
    syncScroll(tabId);
}

function updateStatusBar() {
    const currentTab = tabs[currentTabIndex];
    if (!currentTab) return;
    
    const editor = document.getElementById(`editor-${currentTab.id}`);
    if (!editor) return;
    
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
    
    // Update language info
    const languageNames = {
        'plain': 'Plain Text',
        'javascript': 'JavaScript',
        'html': 'HTML',
        'css': 'CSS',
        'python': 'Python',
        'java': 'Java',
        'cpp': 'C++',
        'markdown': 'Markdown'
    };
    languageInfo.textContent = languageNames[currentTab.language] || currentTab.language;
    
    // Update file info
    fileInfo.textContent = currentTab.filename + (currentTab.isModified ? ' *' : '');
}

function updateSelectionInfo(tabId) {
    const editor = document.getElementById(`editor-${tabId}`);
    if (!editor) return;
    
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    
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

function handleInput(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    const editor = document.getElementById(`editor-${tabId}`);
    if (!editor) return;
    
    // Save to undo stack
    if (tab.undoStack.length > 0 && tab.undoStack[tab.undoStack.length - 1] === editor.value) {
        // Don't save if same as last state
    } else {
        saveToUndoStack(tab, editor.value);
    }
    
    // Clear redo stack when new input
    tab.redoStack = [];
    
    // Mark as modified
    tab.isModified = true;
    
    updateLineNumbers(tabId);
    updateSyntaxHighlighting(tabId);
    updateStatusBar();
    
    // Save to localStorage
    saveTabsToLocalStorage();
}

function saveToUndoStack(tab, state) {
    // Limit undo stack size
    if (tab.undoStack.length > 100) {
        tab.undoStack.shift();
    }
    tab.undoStack.push(state);
}

function handleKeyDown(event, tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    const editor = document.getElementById(`editor-${tabId}`);
    if (!editor) return;
    
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
            case 'Tab':
                event.preventDefault();
                // Switch to next tab
                if (event.shiftKey) {
                    // Previous tab
                    const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
                    switchToTab(tabs[prevIndex].id);
                } else {
                    // Next tab
                    const nextIndex = (currentTabIndex + 1) % tabs.length;
                    switchToTab(tabs[nextIndex].id);
                }
                break;
            case 'w':
                event.preventDefault();
                closeCurrentTab();
                break;
        }
    }
    
    // Handle tab key (when not using Ctrl+Tab)
    if (event.key === 'Tab' && !event.ctrlKey) {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const spaces = '    '; // 4 spaces for tab
        
        saveToUndoStack(tab, editor.value);
        editor.value = editor.value.substring(0, start) + spaces + editor.value.substring(end);
        editor.selectionStart = start + spaces.length;
        editor.selectionEnd = start + spaces.length;
        tab.isModified = true;
        updateLineNumbers(tabId);
        updateSyntaxHighlighting(tabId);
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
            saveToUndoStack(tab, editor.value);
            editor.value = editor.value.substring(0, newStart) + leadingSpaces + editor.value.substring(newStart);
            editor.selectionStart = newStart + leadingSpaces.length;
            editor.selectionEnd = newStart + leadingSpaces.length;
            tab.isModified = true;
            updateLineNumbers(tabId);
            updateSyntaxHighlighting(tabId);
            updateStatusBar();
        }, 0);
    }
    
    updateSelectionInfo(tabId);
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

// Save all tabs to localStorage
function saveTabsToLocalStorage() {
    const tabsData = tabs.map(tab => ({
        filename: tab.filename,
        content: tab.content || document.getElementById(`editor-${tab.id}`)?.value || '',
        isModified: tab.isModified,
        language: tab.language
    }));
    
    localStorage.setItem('notepad-tabs', JSON.stringify(tabsData));
    localStorage.setItem('notepad-theme', currentTheme);
}

// Escape HTML special characters
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/\"/g, '&quot;')
               .replace(/'/g, '&#39;');
}

// Initialize the application when the page loads
window.onload = init;

// Save content before page unload
window.onbeforeunload = function() {
    saveTabsToLocalStorage();
};
