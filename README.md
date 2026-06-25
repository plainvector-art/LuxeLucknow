# ✨ LuxeLucknow ✨

> **Aesthetics, Personalized by AI.**  
> LuxeLucknow is an elite, curated beauty and wellness marketplace and AI concierge platform designed exclusively for Lucknow. Discover top luxury salons, stylize your look with an interactive onboarding moodboard, consult with a Gemini-powered AI beauty concierge, and schedule bespoke pre-event or wedding beauty timelines.

---

## 🌟 Key Features

*   **Premium Curated Marketplace**: Browse Lucknow's finest establishments (in Hazratganj, Gomti Nagar, Aliganj, Indira Nagar, Mahanagar, etc.) with detailed reviews, rating levels, and available styling services.
*   **AI Beauty Concierge**: An elite Gemini-powered assistant offering personalized style advice, service matching, and skin care routines tailored to Lucknow's weather/conditions.
*   **Bespoke Event & Wedding Planner**: Input your occasion date and budget to generate a custom step-by-step beauty itinerary, tracking tasks from 6 weeks prior down to the day-of.
*   **Interactive Visual Moodboard**: Swipe through visual aesthetics (e.g. *Clean Girl*, *Soft Glam*, *Natural Glow*) to find your signature vibe and automatically filter salons that match your aesthetics.
*   **Stylist Verification & Discovery**: Connect directly with verified local artists, view reviews, and book their specialty services.

---

## 🛠️ Technology Stack & Libraries

*   **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
*   **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/) (using the new Vite plugin `@tailwindcss/vite` for optimized builds)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid page transitions, interactive cards, and swipe gestures
*   **Icons**: [Lucide React](https://lucide.dev/) for sleek modern vector iconography
*   **Database & Auth**: [Firebase](https://firebase.google.com/) for authentication and firestore integration
*   **Artificial Intelligence**: Powered by the **Gemini API** (`gemini-3-flash-preview` / `gemini-3.5`) via Google AI Studio

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/plainvector-art/LuxeLucknow.git
   cd LuxeLucknow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the address shown in your terminal (typically `http://localhost:5173`).

### 🤖 Configuring the AI Features

To unlock the full potential of the AI Beauty Concierge and Bespoke Event Planner:
1. Open the application.
2. Click the **Key Settings** button (or the key icon in the Navbar).
3. Paste your **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
4. Save the key. It will be stored securely in your browser's local storage and used to make direct API calls to the Google Generative Language endpoints. If no key is provided, the application will gracefully fall back to high-fidelity mockup data.

---

## 📦 Project Structure

```text
src/
├── assets/         # Images, graphics, and static assets
├── components/     # Reusable UI components (Navbar, Footer, IntroReveal, MoodBoard, KeySettingsModal)
├── data/           # Mock data for salons, areas, and moods (salons.ts)
├── pages/          # Core views (Home, Marketplace, SalonProfile, AiConcierge, BeautyPlanner)
├── types/          # TypeScript interface definitions (index.ts)
├── App.tsx         # Main router and shell layout
└── main.tsx        # Application entry point
```

---

## 🎨 Design System & Colors

The app utilizes a custom luxury palette defined in its Tailwind configuration:
*   `warm-white` / `ivory`: Clean, elegant editorial backdrops.
*   `charcoal` / `charcoal-light`: Premium typography and dark section backgrounds.
*   `gold` / `gold-dark`: Sophisticated brand highlights and buttons.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](file:///c:/Users/Nyx/Downloads/LuxeLucknow/LICENSE) file for details.
