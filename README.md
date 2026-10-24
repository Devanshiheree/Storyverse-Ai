# StoryVerse AI ✨

**Your story. Your universe. Infinite possibilities.**

StoryVerse AI is an AI-powered creative writing companion designed to help writers develop stories, explore character personalities, simulate scenes, and discover alternative narrative possibilities. It brings storytelling and artificial intelligence together in one workspace, helping writers turn ideas into immersive fictional worlds.

## ✨ Features

- **📖 Story Editor** — Create and develop stories in a dedicated writing workspace.
- **👥 Character Development** — Build characters and explore their personalities, motivations, and traits.
- **🎬 Scene Simulator** — Visualize scenes and explore how story situations might unfold.
- **🌿 Alternate Story Paths** — Discover alternative directions and possibilities for your narrative.
- **🤖 AI Writing Assistant** — Generate story continuations, character insights, dialogue, and creative suggestions.
- **💭 Scene & Character Visualization** — Generate text-based visual descriptions and prompts to help imagine fictional worlds.
- **💾 Local Story Storage** — Keep projects and characters saved in your browser using localStorage.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

**Backend**
- Node.js
- Express.js
- TypeScript
- Google Gemini API

**Deployment**
- Vercel — Frontend
- Render — Backend

## 🏗️ Project Structure

```text
Storyverse-Ai/
├── server/
│   ├── index.ts
│   ├── package.json
│   └── ...
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── views/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- Node.js and npm
- Git
- A Google Gemini API key for AI-powered features

### 1. Clone the repository

```bash
git clone https://github.com/Devanshiheree/Storyverse-Ai.git
cd Storyverse-Ai
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace the placeholder with your own Gemini API key. Never commit your `.env` file or expose your API key publicly.

### 4. Start the backend

From the `server/` directory, run:

```bash
npm run dev
```

The backend runs locally on port `3001`, according to the project's current configuration.

### 5. Configure the frontend

In the project root, create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 6. Start the frontend

Open another terminal in the project root and run:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

### 7. Build for production

```bash
npm run build
```

Vite generates the production build in the `dist/` directory.

## 🔌 API Endpoints

The backend exposes endpoints for:

| Endpoint | Purpose |
|---|---|
| `/api/health` | Check backend availability |
| `/api/continue-story` | Continue a story |
| `/api/generate-dialogue` | Generate character dialogue |
| `/api/suggest-alternatives` | Explore alternative story directions |
| `/api/analyse-character` | Analyse a character |
| `/api/visualize-character` | Generate character visual descriptions |
| `/api/visualize-scene` | Generate scene visual descriptions |

## 🌐 Deployment

The application uses separate deployments for the frontend and backend.

- **Frontend:** Vercel
- **Backend:** Render

For the deployed frontend, configure the following Vercel environment variable:

```env
VITE_API_BASE_URL=https://storyverse-ai-tud1.onrender.com/api
```

Keep `GEMINI_API_KEY` configured only in the backend's environment variables.

## 💾 Data Storage

StoryVerse AI currently uses browser localStorage for local project and character persistence. This means saved data is associated with the browser and device being used; it is not automatically synchronized across devices.

## 🔮 Future Possibilities

- Cloud-based story storage and synchronization
- Richer character relationship mapping
- Interactive branching narratives
- Enhanced story visualization tools
- Collaborative writing features
- Personalized writing assistance

## 🎯 Vision

StoryVerse AI aims to give writers a space where imagination meets intelligent assistance — helping them experiment with ideas, understand their characters, and explore the endless possibilities hidden inside a story.

**Every story has a universe. Let's explore yours.** ✨

---

*Built with creativity, curiosity, and AI.*
