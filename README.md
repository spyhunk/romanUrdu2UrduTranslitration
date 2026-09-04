# Roman Urdu ⇄ Urdu Transliterator

A production-grade, real-time **two-way** transliterator: Roman Urdu → Urdu script, and Urdu script → Roman Urdu. Built with **Vite** and designed for **Cloudflare Pages**. The Urdu → Roman direction is powered by [urdu-text-utils](https://github.com/Zaid-maker/urdu-text-utils) (MIT) — a 2,200+ word dictionary plus a rule engine.

## ✨ Features

- ✅ **660+ Word Dictionary**: High-accuracy mappings for common words.
- ✅ **Sliding Window Matching**: Longest-match-first algorithm for multi-character sequences.
- ✅ **Phonetic Normalization**: Handles "mujhe", "mujhey", and "mujhy" seamlessly.
- ✅ **Cloudflare Pages API**: Distributed, high-performance API endpoint.
- ✅ **Modern UI**: Sleek dark-mode interface with real-time feedback.
- ✅ **Two-Way Translation**: Type Roman Urdu *or* Urdu script — direction is detected automatically.

---

## 🚀 Development Workflow

### 1. Local Development (Browser Only)
We use Vite for local development. It runs the transliteration logic directly in your browser, completely bypassing the Cloudflare binary issues you might have encountered locally.

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see it in action.

### 2. Testing
Run the command-line tests to verify both transliteration directions:
```bash
npm run test
```

### 3. Build
Generate a production-ready static site:
```bash
npm run build
```

---

## 🌍 GitHub & Cloudflare Pages Deployment

This project is optimized for **Cloudflare Pages** which integrates directly with your **GitHub** repo. No `wrangler` is needed locally!

### Setup Instructions:
1.  **Push to GitHub**: Create a new repository and push this code.
2.  **Connect to Cloudflare**:
    *   Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
    *   Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
    *   Select your GitHub repository.
3.  **Configure Build**:
    *   **Framework preset**: `Vite`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
4.  **Save and Deploy**: Cloudflare will automatically build and deploy your site and the **Functions** (API) folder.

---

## 📡 API Reference

### Endpoint: `POST /api`
Transliterate Roman Urdu text via a JSON API.

**Request:**
```json
{ "text": "Assalam o alaikum" }
```

**Response:**
```json
{
  "success": true,
  "output": "السلام و علیکم",
  "wordCount": 3,
  "dictionaryHits": 3
}
```

**Rate Limit**: 60 requests per minute per IP (Free account optimized).

---

## 📁 Project Structure

- `index.html`: Main UI wrapper (Vite root).
- `src/main.js`: UI logic and smart API switcher.
- `src/transliterator.js`: The core engine (shared between UI & API).
- `functions/api.js`: Cloudflare Pages Function (Back-end API).
- `package.json`: Project dependencies and scripts.

---

## 📚 Library Usage (`romanUrduConverter.js`)

If you want to use the core transliteration engine in your own project without the API, you can use the standalone `romanUrduConverter.js` file. It supports both Browser and Node.js environments.

### 🌐 In the Browser
Include the script in your HTML:
```html
<script src="romanUrduConverter.js"></script>
<script>
  // Access through the window object
  const urdu = window.romanUrduConverter("Assalam o alaikum");
  console.log(urdu); // "السلام و علیکم"
</script>
```

### 💻 In Node.js
```javascript
const { romanUrduConverter } = require('./romanUrduConverter.js');

const urdu = romanUrduConverter("Mujhe aap se pyaar hai");
console.log(urdu); // "مجھے آپ سے پیار ہے"
```

### 🛠️ Available Functions
| Function | Description |
|----------|-------------|
| `romanUrduConverter(text)` | Converts a full string of Roman Urdu to Urdu script. |
| `transliterateWord(word)` | Converts a single word. |
| `isInDictionary(word)` | Returns `true` if the word exists in the 660+ word dictionary. |
| `getDictionaryStats()` | Returns the current size of the vocabulary. |

---

## 📜 Changelog

### v1.0.1 (Current)
-   Implemented **In-Memory Rate Limiting** (60 req/min) to protect the API on free tier.
-   Migrated from Cloudflare Workers to **Cloudflare Pages + Functions**.
-   Added **Vite** as the primary build tool and local development server.
-   Polished the UI with a faster, browser-native development mode.
-   Added comprehensive library usage documentation to `README.md`.

### v1.0.0
-   Major overhaul of the core engine: Added 660+ word dictionary.
-   Implemented **Longest-match-first** matching algorithm.
-   Added support for **Aspirated Consonants** (کھ، گھ، پھ، etc.).
-   Added phonetic normalization for variations like "mujhe/mujhey".
-   Created the initial sleek dark-mode demo interface.

---

## License
MIT
