# 🤖 Gadget Bot

Gadget Bot is an AI-powered, next-generation gadget information chatbot. Built to provide users with up-to-date and accurate information regarding tech and gadgets, this application utilizes modern web technologies to deliver a premium, fully responsive user experience with persistent accounts and chat history.

## ✨ Features
- **Intelligent Conversations:** Powered by Google's Gemini AI model to answer any questions about gadget specs, tech news, and releases.
- **Persistent Accounts:** Seamless Google OAuth sign-in utilizing Supabase.
- **Chat History:** View, rename, and delete past conversations. All messages are securely saved to the database.
- **Premium UI Design:** Features a beautiful dark indigo/purple theme with animated gradient backgrounds, interactive 3D empty states via Framer Motion, and smooth glassmorphism effects.
- **Markdown Support:** Renders rich text, lists, code snippets, and tables flawlessly for highly readable AI responses.
- **Responsive Layout:** Automatically scales from ultra-wide desktop monitors down to a mobile-friendly drawer (Sheet) interface.

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org) (App Router, Server Actions)
- **Database & Auth:** [Supabase](https://supabase.com/) & `@supabase/ssr`
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Integrations:** Google Gemini via the OpenAI SDK wrapper (`gemini-2.5-flash`)
- **Markdown Parsing:** `react-markdown` and `remark-gfm`

## 📂 File Structure
Here is an overview of the core project structure:

```text
gadget-bot/
├── app/
│   ├── api/chat/route.ts      # API route for Gemini AI requests & saving to Supabase
│   ├── auth/callback/         # Supabase OAuth callback handler
│   ├── chat/page.tsx          # Main chat interface page with animated background
│   └── globals.css            # Global Tailwind CSS and custom Shadcn dark indigo theme variables
├── components/
│   ├── auth/                  # LoginCard and related auth UI
│   ├── chat/                  # Core chat UI (ChatWindow, Sidebar, EmptyState, MobileSidebar)
│   └── ui/                    # Reusable Shadcn UI components (Sheet, Button, ScrollArea)
├── lib/
│   ├── api/openai.ts          # OpenAI SDK configuration for the Gemini model
│   └── supabase/              # Supabase server and browser client utilities
├── store/
│   └── chatStore.ts           # Zustand global state for active chats and messages
├── public/                    # Static assets
└── tailwind.config.ts         # Tailwind CSS configuration and theme extensions
```

## 🚀 Getting Started

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a Supabase project and set up a `messages` and `chats` table. Enable Google Auth in your Supabase Auth Providers dashboard.

3. Create a `.env` file in the root directory and add the following keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to sign in and chat with the bot.

---

Made with love ❤️ by Tuhin
