// Syntax Highlighting Module for NotePad++ Clone

// Language definitions
const languages = {
    javascript: {
        keywords: ['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 
                  'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 
                  'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 
                  'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'],
        builtins: ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function', 'JSON', 
                  'Math', 'Number', 'Object', 'RangeError', 'ReferenceError', 'RegExp', 
                  'String', 'SyntaxError', 'TypeError', 'URIError'],
        literals: ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'],
        operators: ['+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '>', '<', '>=', '<=', 
                   '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '+=', '-=', 
                   '*=', '/=', '%=', '++', '--', '=>', '...'],
        punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', ':', '.', '?', '...']
    },
    html: {
        tags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 
              'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 
              'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 
              'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 
              'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 
              'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 
              'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 
              'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 
              'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 
              's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 
              'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 
              'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
        attributes: ['abbr', 'accept', 'accept-charset', 'accesskey', 'action', 'align', 
                    'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'bgcolor', 
                    'border', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 
                    'color', 'cols', 'colspan', 'content', 'contenteditable', 'controls', 
                    'coords', 'data', 'datetime', 'default', 'defer', 'dir', 'dirname', 
                    'disabled', 'download', 'draggable', 'enctype', 'for', 'form', 
                    'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 
                    'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 
                    'label', 'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 
                    'maxlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 
                    'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 
                    'poster', 'preload', 'radiogroup', 'readonly', 'rel', 'required', 
                    'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'seamless', 
                    'selected', 'shape', 'size', 'sizes', 'span', 'spellcheck', 'src', 
                    'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'subject', 
                    'summary', 'tabindex', 'target', 'title', 'type', 'usemap', 'value', 
                    'width', 'wrap'],
        events: ['onabort', 'onblur', 'onchange', 'onclick', 'oncontextmenu', 'ondblclick', 
                'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 
                'ondragstart', 'ondrop', 'onerror', 'onfocus', 'oninput', 'oninvalid', 
                'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 
                'onmouseout', 'onmouseover', 'onmouseup', 'onreset', 'onscroll', 'onsearch', 
                'onselect', 'onsubmit', 'onwheel']
    },
    css: {
        keywords: ['@charset', '@font-face', '@import', '@keyframes', '@media', '@page', 
                  '@supports', 'azimuth', 'background', 'background-attachment', 
                  'background-color', 'background-image', 'background-position', 
                  'background-repeat', 'background-size', 'binding', 'bleed', 'bookmark-label', 
                  'bookmark-level', 'bookmark-state', 'border', 'border-bottom', 
                  'border-bottom-color', 'border-bottom-style', 'border-bottom-width', 
                  'border-collapse', 'border-color', 'border-left', 'border-left-color', 
                  'border-left-style', 'border-left-width', 'border-right', 
                  'border-right-color', 'border-right-style', 'border-right-width', 
                  'border-spacing', 'border-style', 'border-top', 'border-top-color', 
                  'border-top-style', 'border-top-width', 'border-width', 'bottom', 
                  'box-decoration-break', 'box-shadow', 'box-sizing', 'break-after', 
                  'break-before', 'break-inside', 'caption-side', 'clear', 'clip', 'color', 
                  'column-count', 'column-fill', 'column-gap', 'column-rule', 
                  'column-rule-color', 'column-rule-style', 'column-rule-width', 
                  'column-span', 'column-width', 'columns', 'content', 'counter-increment', 
                  'counter-reset', 'cue', 'cue-after', 'cue-before', 'cursor', 'direction', 
                  'display', 'elevation', 'empty-cells', 'fit', 'fit-position', 'float', 
                  'flow-from', 'flow-into', 'font', 'font-family', 'font-feature-settings', 
                  'font-kerning', 'font-language-override', 'font-size', 'font-size-adjust', 
                  'font-stretch', 'font-style', 'font-variant', 'font-variant-alternates', 
                  'font-variant-caps', 'font-variant-east-asian', 'font-variant-ligatures', 
                  'font-variant-numeric', 'font-variant-position', 'font-weight', 'hanging-punctuation', 
                  'height', 'hyphens', 'icon', 'image-orientation', 'image-rendering', 
                  'image-resolution', 'ime-mode', 'justify-content', 'left', 'letter-spacing', 
                  'line-break', 'line-height', 'list-style', 'list-style-image', 
                  'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 
                  'margin-left', 'margin-right', 'margin-top', 'marks', 'max-height', 
                  'max-width', 'min-height', 'min-width', 'nav-down', 'nav-index', 'nav-left', 
                  'nav-right', 'nav-up', 'object-fit', 'object-position', 'opacity', 'order', 
                  'orphans', 'outline', 'outline-color', 'outline-offset', 'outline-style', 
                  'outline-width', 'overflow', 'overflow-style', 'overflow-x', 'overflow-y', 
                  'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 
                  'page', 'page-break-after', 'page-break-before', 'page-break-inside', 
                  'pause', 'pause-after', 'pause-before', 'perspective', 'perspective-origin', 
                  'pitch', 'pitch-range', 'play-during', 'position', 'punctuation-trim', 
                  'quotes', 'region-break-after', 'region-break-before', 'region-break-inside', 
                  'region-fragment', 'resize', 'rest', 'rest-after', 'rest-before', 'richness', 
                  'right', 'rotation', 'rotation-point', 'ruby-position', 'speak', 
                  'speak-as', 'speak-header', 'speak-numeral', 'speak-punctuation', 'speech-rate', 
                  'stress', 'table-layout', 'tab-size', 'target', 'target-name', 'target-new', 
                  'target-position', 'text-align', 'text-align-last', 'text-decoration', 
                  'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 
                  'text-height', 'text-indent', 'text-justify', 'text-kashida-space', 
                  'text-line-through', 'text-line-through-color', 'text-line-through-mode', 
                  'text-line-through-style', 'text-line-through-width', 'text-overflow', 
                  'text-overflow-ellipsis', 'text-overflow-mode', 'text-rendering', 
                  'text-shadow', 'text-transform', 'text-underline', 'text-underline-color', 
                  'text-underline-mode', 'text-underline-style', 'text-underline-width', 
                  'text-wrap', 'top', 'transform', 'transform-origin', 'transform-style', 
                  'transition', 'transition-delay', 'transition-duration', 'transition-property', 
                  'transition-timing-function', 'unicode-bidi', 'unicode-range', 'vertical-align', 
                  'visibility', 'voice-balance', 'voice-duration', 'voice-family', 
                  'voice-pitch', 'voice-range', 'voice-rate', 'voice-stress', 'voice-volume', 
                  'white-space', 'widows', 'width', 'word-break', 'word-spacing', 
                  'word-wrap', 'z-index'],
        pseudoClasses: [':active', ':checked', ':default', ':dir', ':disabled', ':empty', 
                       ':enabled', ':first', ':first-child', ':first-of-type', ':focus', 
                       ':fullscreen', ':hover', ':indeterminate', ':in-range', ':invalid', 
                       ':lang', ':last-child', ':last-of-type', ':left', ':link', 
                       ':not', ':nth-child', ':nth-last-child', ':nth-last-of-type', 
                       ':nth-of-type', ':only-child', ':only-of-type', ':optional', 
                       ':out-of-range', ':read-only', ':read-write', ':required', ':right', 
                       ':root', ':scope', ':target', ':valid', ':visited'],
        pseudoElements: ['::after', '::before', '::first-letter', '::first-line', '::selection'],
        functions: ['attr', 'calc', 'cubic-bezier', 'hsl', 'hsla', 'rgb', 'rgba', 'url'],
        units: ['cm', 'deg', 'em', 'ex', 'fr', 'grad', 'Hz', 'in', 'khz', 'mm', 'ms', 
               'number', 'pc', 'pt', 'px', 'rad', 'rem', 's', 'turn', 'vh', 'vm', 'vmax', 'vmin', 'vw']
    },
    python: {
        keywords: ['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 
                  'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 
                  'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 
                  'try', 'while', 'with', 'yield'],
        builtins: ['abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 
                  'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 
                  'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 
                  'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 
                  'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 
                  'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 
                  'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 
                  'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'],
        literals: ['True', 'False', 'None'],
        operators: ['+', '-', '*', '/', '%', '**', '//', '=', '==', '!=', '>', '<', '>=', '<=', 
                   'and', 'or', 'not', 'is', 'in', 'is not', 'not in', '&', '|', '^', '~', 
                   '<<', '>>', '+=', '-=', '*=', '/=', '%=', '**=', '//=', '&=', '|=', 
                   '^=', '>>=', '<<=', '->'],
        punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', ':', '.', '@', '...']
    },
    java: {
        keywords: ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 
                  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 
                  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 
                  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 
                  'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 
                  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 
                  'try', 'void', 'volatile', 'while'],
        literals: ['true', 'false', 'null'],
        operators: ['+', '-', '*', '/', '%', '=', '==', '!=', '>', '<', '>=', '<=', '&&', '||', 
                   '!', '&', '|', '^', '~', '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '%=', 
                   '++', '--', 'instanceof'],
        punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', ':', '.', '...']
    },
    cpp: {
        keywords: ['alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 
                  'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 
                  'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'const_cast', 
                  'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 
                  'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 
                  'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 
                  'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 
                  'or', 'or_eq', 'private', 'protected', 'public', 'register', 'reinterpret_cast', 
                  'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 
                  'static_cast', 'struct', 'switch', 'template', 'this', 'thread_local', 'throw', 
                  'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 
                  'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'],
        literals: ['true', 'false', 'nullptr'],
        operators: ['+', '-', '*', '/', '%', '=', '==', '!=', '>', '<', '>=', '<=', '&&', '||', 
                   '!', '&', '|', '^', '~', '<<', '>>', '+=', '-=', '*=', '/=', '%=', '++', 
                   '--', '->', '->*', '.', '.*', '::', '?:'],
        punctuation: ['(', ')', '[', ']', '{', '}', ',', ';', ':', '...']
    }
};

// Syntax highlighting function
function applySyntaxHighlighting(text, language) {
    if (!language || !languages[language]) {
        return text;
    }
    
    const lang = languages[language];
    let highlighted = text;
    
    // Escape HTML special characters
    highlighted = highlighted.replace(/&/g, '&amp;')
                             .replace(/</g, '&lt;')
                             .replace(/>/g, '&gt;');
    
    // Highlight comments (single-line and multi-line)
    highlighted = highlightComments(highlighted, lang);
    
    // Highlight strings
    highlighted = highlightStrings(highlighted);
    
    // Highlight numbers
    highlighted = highlightNumbers(highlighted);
    
    // Highlight keywords
    highlighted = highlightKeywords(highlighted, lang.keywords, 'keyword');
    
    // Highlight builtins
    if (lang.builtins) {
        highlighted = highlightKeywords(highlighted, lang.builtins, 'builtin');
    }
    
    // Highlight literals
    if (lang.literals) {
        highlighted = highlightKeywords(highlighted, lang.literals, 'literal');
    }
    
    // Highlight operators
    if (lang.operators) {
        highlighted = highlightOperators(highlighted, lang.operators);
    }
    
    // For HTML, highlight tags and attributes
    if (language === 'html') {
        highlighted = highlightHtmlTags(highlighted, lang);
    }
    
    // For CSS, highlight properties and values
    if (language === 'css') {
        highlighted = highlightCss(highlighted, lang);
    }
    
    return highlighted;
}

function highlightComments(text, lang) {
    // Single-line comments
    let result = text;
    
    // C-style comments (//)
    result = result.replace(/(^|[^\\])(\/\/[^\n]*)/gm, '$1<span class="comment">$2</span>');
    
    // C-style multi-line comments (/* */)
    result = result.replace(/\/\*[\s\S]*?\*\//g, function(match) {
        return '<span class="comment">' + match + '</span>';
    });
    
    // Python-style comments (#)
    result = result.replace(/(^|[^\\])(#.*)/gm, '$1<span class="comment">$2</span>');
    
    // HTML comments (<!-- -->)
    result = result.replace(/<!--[\s\S]*?-->/g, function(match) {
        return '<span class="comment">' + match + '</span>';
    });
    
    return result;
}

function highlightStrings(text) {
    // Double-quoted strings
    let result = text.replace(/("[^"\\]*(?:\\.[^"\\]*)*")/g, '<span class="string">$1</span>');
    
    // Single-quoted strings
    result = result.replace(/('([^'\\]|\\.)*?')/g, '<span class="string">$1</span>');
    
    // Template literals (backticks)
    result = result.replace(/(`[^`\\]*(?:\\.[^`\\]*)*`)/g, '<span class="string">$1</span>');
    
    return result;
}

function highlightNumbers(text) {
    // Integer numbers
    let result = text.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
    
    // Floating point numbers
    result = result.replace(/\b(\d+\.\d+)\b/g, '<span class="number">$1</span>');
    
    // Scientific notation
    result = result.replace(/\b(\d+\.?\d*[eE][+-]?\d+)\b/g, '<span class="number">$1</span>');
    
    // Hex numbers
    result = result.replace(/\b(0[xX][0-9a-fA-F]+)\b/g, '<span class="number">$1</span>');
    
    return result;
}

function highlightKeywords(text, keywords, className) {
    // Sort by length (longest first) to avoid partial matches
    const sortedKeywords = keywords.sort((a, b) => b.length - a.length);
    
    let result = text;
    for (const keyword of sortedKeywords) {
        // Use word boundaries to match whole words only
        const regex = new RegExp('\\b(' + escapeRegExp(keyword) + ')\\b', 'g');
        result = result.replace(regex, '<span class="' + className + '">$1</span>');
    }
    
    return result;
}

function highlightOperators(text, operators) {
    // Sort by length (longest first)
    const sortedOperators = operators.sort((a, b) => b.length - a.length);
    
    let result = text;
    for (const op of sortedOperators) {
        // Escape special regex characters
        const regex = new RegExp(escapeRegExp(op), 'g');
        result = result.replace(regex, '<span class="operator">' + escapeHtml(op) + '</span>');
    }
    
    return result;
}

function highlightHtmlTags(text, lang) {
    let result = text;
    
    // Highlight HTML tags
    result = result.replace(/&lt;\/?([a-zA-Z][a-zA-Z0-9-]*)/g, '&lt;/<span class="tag">$1</span>');
    result = result.replace(/&lt;\/([a-zA-Z][a-zA-Z0-9-]*)/g, '&lt;/<span class="tag">$1</span>');
    
    // Highlight HTML attributes
    for (const attr of lang.attributes) {
        const regex = new RegExp('\\b(' + escapeRegExp(attr) + ')\\b', 'g');
        result = result.replace(regex, '<span class="attribute">$1</span>');
    }
    
    // Highlight HTML events
    for (const event of lang.events) {
        const regex = new RegExp('\\b(' + escapeRegExp(event) + ')\\b', 'g');
        result = result.replace(regex, '<span class="event">$1</span>');
    }
    
    return result;
}

function highlightCss(text, lang) {
    let result = text;
    
    // Highlight CSS properties
    for (const prop of lang.keywords) {
        const regex = new RegExp('\\b(' + escapeRegExp(prop) + ')\\b', 'g');
        result = result.replace(regex, '<span class="property">$1</span>');
    }
    
    // Highlight CSS pseudo-classes and pseudo-elements
    for (const pseudo of [...lang.pseudoClasses, ...lang.pseudoElements]) {
        const regex = new RegExp(escapeRegExp(pseudo), 'g');
        result = result.replace(regex, '<span class="pseudo">' + escapeHtml(pseudo) + '</span>');
    }
    
    // Highlight CSS functions
    for (const func of lang.functions) {
        const regex = new RegExp('\\b(' + escapeRegExp(func) + ')\\([^)]*\)', 'g');
        result = result.replace(regex, '<span class="function">$&</span>');
    }
    
    // Highlight CSS units
    for (const unit of lang.units) {
        const regex = new RegExp('\\b(\d+\.?\d*' + escapeRegExp(unit) + ')\\b', 'g');
        result = result.replace(regex, '<span class="unit">$1</span>');
    }
    
    return result;
}

// Utility functions
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(string) {
    return string.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#39;');
}

// Detect language from file extension
function detectLanguage(filename) {
    if (!filename) return null;
    
    const extension = filename.split('.').pop().toLowerCase();
    
    const extensionMap = {
        'js': 'javascript',
        'mjs': 'javascript',
        'cjs': 'javascript',
        'html': 'html',
        'htm': 'html',
        'xhtml': 'html',
        'css': 'css',
        'py': 'python',
        'pyw': 'python',
        'java': 'java',
        'class': 'java',
        'cpp': 'cpp',
        'cxx': 'cpp',
        'cc': 'cpp',
        'c': 'cpp',
        'h': 'cpp',
        'hpp': 'cpp',
        'hxx': 'cpp',
        'php': 'php',
        'rb': 'ruby',
        'go': 'go',
        'rs': 'rust',
        'swift': 'swift',
        'kt': 'kotlin',
        'kts': 'kotlin',
        'scala': 'scala',
        'ts': 'typescript',
        'tsx': 'typescript',
        'jsx': 'javascript',
        'vue': 'html',
        'svelte': 'html'
    };
    
    return extensionMap[extension] || null;
}

// Auto-detect and apply syntax highlighting
function updateSyntaxHighlighting() {
    const language = detectLanguage(currentFile);
    const text = editor.value;
    
    if (language && text) {
        const highlighted = applySyntaxHighlighting(text, language);
        // In a real implementation, we'd display this in a separate div
        // For now, we'll just store it for potential use
        return highlighted;
    }
    
    return text;
}
