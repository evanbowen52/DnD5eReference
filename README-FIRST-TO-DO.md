# 🚨 README FIRST: TO-DO (Architectural Mismatch & Refactoring Guide)

This project has been tested with Jest, and all unit/integration/performance tests pass successfully in WSL. However, when loaded inside a real web browser via `http-server`, the app currently fails to load content when menu items are clicked.

---

## 🔍 The Issue (Browser Console Errors)
If you open Chrome/Firefox Developer Tools when loading the application, you will see the following errors:
```text
Uncaught SyntaxError: Unexpected token 'export' (client.js:166)
Uncaught SyntaxError: Cannot use import statement outside a module (spells.js:2)
Uncaught TypeError: window.DnDAPI is not a constructor (index.html:123)
```

### Why this happens:
The codebase is currently in a **half-migrated state** between classic global scripts and modern modules:
1. **The Scripts**: The files in `pages/` and `api/` are written using modern ES6 `import`/`export` keywords.
2. **The HTML**: `index.html` imports these files using standard, classic `<script>` tags, which do not support module keywords. Since the browser fails to compile `client.js` and `spells.js` due to syntax errors, `window.DnDAPI` is never defined.

---

## 🛠️ How to Fix This (Two Options)

### Option A: Complete the Browser-Native ES6 Module Refactoring (No Bundler Required)
This is the cleanest approach because it requires no compilation or build steps, running directly in any modern browser.

1. **Update `index.html`**:
   Change all `<script>` imports for your local files to use `type="module"`.
   ```html
   <!-- Change from this: -->
   <script src="./api/client.js"></script>
   <script src="./router.js"></script>
   <script src="./pages/spells.js"></script>

   <!-- To this: -->
   <script type="module" src="./api/client.js"></script>
   <script type="module" src="./router.js"></script>
   <script type="module" src="./pages/spells.js"></script>
   ```
   *Note: Ensure the main inline `<script>` tag at the bottom of `index.html` is also changed to `<script type="module">` so that it executes in the correct deferred sequence.*

2. **Add `.js` Extensions to Your Imports**:
   Browser-native modules **require** explicit file extensions for imports (unlike Node/Webpack). You will need to add `.js` to all imports across your page files:
   ```javascript
   // Change from this (in pages/classes.js for example):
   import { BasePage } from '../api/basePage';
   import { stateManager } from '../api/stateManager';

   // To this:
   import { BasePage } from '../api/basePage.js';
   import { stateManager } from '../api/stateManager.js';
   ```

---

### Option B: Implement a Webpack Bundler
If you prefer not to add `.js` extensions to all imports and want a single compiled bundle:

1. **Create `webpack.config.cjs`**:
   Define your entry point, resolve extensions automatically, and output a single bundled file (e.g., `dist/bundle.js`).
2. **Expose Page Classes Globally**:
   Because `router.js` looks up pages in `window` (e.g. `window.spellsPage`), your pages must attach themselves to `window` (which they already do at the bottom of each file).
3. **Run Webpack**:
   Add a `"build": "webpack --mode=development"` script to `package.json` and load the output bundle in `index.html`.
