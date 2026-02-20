# Gadget Bot - Comprehensive Technical Documentation

## 1. Project Overview
Gadget Bot is an intelligent, responsive, and seamless AI chatbot application specifically designed to assist users with technology hardware specs, news, and gadget recommendations. Built with a modern Next.js stack, it offers users persistent authentication, chat history storage, and a visually arresting premium dark mode UI.

---

## 2. Core Architecture & Tech Stack

The application embraces a Server/Client decoupled logic approach using the Next.js App Router for maximal performance.

- **Frontend & Routing:** Next.js 14+ (App Directory)
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI component library
- **Authentication & Database:** Supabase (PostgreSQL) + OAuth2 Google Provider
- **State Management:** Zustand (Global State)
- **Animations:** Framer Motion (3D Interactive states) + Tailwind Animations
- **AI Processing:** Google Gemini API (`gemini-2.5-flash`) via the OpenAI Node SDK Wrapper.

---

## 3. Database Schema (Supabase)

Data persistence relies on two linked tables governed by Supabase Row Level Security (RLS) ensuring strict user data privacy.

### Table: `chats`
Represents a unique conversation thread.
- `id` (uuid, primary key)
- `user_id` (uuid, references `auth.users(id)`)
- `title` (text, automatically generated e.g., "Response 1")
- `created_at` (timestampz)
- `updated_at` (timestampz)

### Table: `messages`
Stores individual prompts and AI responses within a thread.
- `id` (uuid, primary key)
- `chat_id` (uuid, references `chats(id)`, cascade delete)
- `user_id` (uuid, references `auth.users(id)`)
- `role` (text, `user` or `assistant`)
- `content` (text)
- `created_at` (timestampz)

---

## 4. Backend AI Logic Integration

The core chat logic is intercepted by `/app/api/chat/route.ts`. 

### The Chat Flow:
1. **User Request Validation:** Verifies the `GEMINI_API_KEY` exists and requests the user token via `@supabase/ssr` cookies.
2. **Chat Title Generation:** If a `chatId` is missing from the payload (signifying a new conversation), the API executes an `exact count` query on the user's existing chats to generate a generic sequential title (e.g., "Response N") before inserting the actual message.
3. **Context Hydration:** It fetches the last `10` messages matching the `<chatId>` and reformats them chronologically to build conversational context tracking.
4. **AI Processing:** Prompts the `gemini-2.5-flash` model, explicitly injecting today's `currentDate` as system preprompt context to satisfy time-relative queries ("*Did Apple drop an M4 yet?*").
5. **Persistence:** The user's message and the AI's generated response are written directly to the Supabase Postgres instance before finally unlocking the API response to the frontend client.

---

## 5. Frontend & UI System

### 5.1 The `ChatWindow.tsx`
This serves as the main viewport bounding box for messages, rendering Markdown automatically via `react-markdown` within `ChatMessage.tsx`.

### 5.2 Responsive Layout Strategy (Mobile First)
The app is entirely responsive. Instead of simply stacking menus, the layout utilizes Shadcn UI's `<Sheet />` primitive (`MobileSidebar.tsx`) to implement a native-feeling "Drawer" style interaction when triggered by a hamburger menu on screens `< md`. 
* On desktop (`md:flex`), the traditional permanent `Sidebar.tsx` dictates the layout.
* To prevent interaction issues on mobile touch-devices, action items like 'Delete' and 'Edit/Rename' force an `opacity-100` instead of relying on non-existent hover-events (`group-hover`).

### 5.3 Global State using Zustand
Instead of cumbersome cascading `useState` prop-drilling, `zustand` is utilized via `store/chatStore.ts` to seamlessly update active chat selections, optimistic message insertions, and history invalidation across decoupled components.

### 5.4 Glassmorphism & Animations
The visual hierarchy hinges on depth and translucency. `backdrop-blur-xl`, `bg-white/10`, animated background meshes (`bg-[url(...)]`), and Framer-Motion driven interactive SVGs (`EmptyState.tsx`) combine to produce a native-feeling lightweight aesthetic.

---

## 6. Deployment Logistics (Vercel)

Gadget Bot is configured natively for Vercel deployment. 

**Critical Vercel Deployment Requirements:**
1. The Environment Variables must be securely populated in the Vercel Settings console:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
2. Next.js will critically fail to statically bake dynamic authentication components. We implemented `export const dynamic = 'force-dynamic';` in `app/chat/page.tsx` to force SSR, allowing Supabase to read cookies cleanly across deployment instances without triggering a `DYNAMIC_SERVER_USAGE` build error.

---

## 7. Versioning & Iteration History
* **v0.1:** Initial React initialization, basic layout, dark mode provider.
* **v0.2:** Implemented Shadcn UI primitives, Markdown syntax highlighting setup.
* **v0.3:** Vercel deployment, Supabase backend initialization, Chat history logic, Framer interactions.