# KM-CRM — Project Specification

## Overview

KM-CRM is a Customer Relationship Management web application built for the KM Management organization. It provides tools for managing customer data, analytics, and file organization with AI-powered automation.

---

## Tech Stack

| Layer | Technology | Version |
| ------- | ----------- | --------- |
| **Framework** | Next.js (App Router) | 16.2.1 |
| **Language** | TypeScript | ^5.9 |
| **UI Library** | React | 19.2 |
| **Component Library** | shadcn/ui + @base-ui/react | ^1.3 |
| **Styling** | Tailwind CSS v4 | ^4 |
| **Icons** | lucide-react | ^0.577 |
| **Charts** | Recharts | ^2.15 |
| **AI Service** | OpenRouter (multi-model) | via API |
| **Embeddings** | OpenRouter (text-embedding-3-small) | via API |
| **Vector Store** | ChromaDB | v3 (Docker) |
| **HTTP Client** | Axios | ^1 |
| **Server State** | @tanstack/react-query | ^5 |
| **Google APIs** | googleapis | ^171.4 |
| **Session** | jose (JWT) | ^6.2 |
| **Linting** | ESLint + Prettier | ^9 / ^3 |

---

## Project Structure

```
km-crm/
├── app/                        # Next.js App Router pages & API routes
│   ├── layout.tsx              # Root layout (fonts, QueryProvider)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + Tailwind config
│   ├── drive/                  # Google Drive management feature
│   │   ├── layout.tsx          # Drive section layout + metadata
│   │   └── page.tsx            # Drive page (renders FileManager)
│   └── api/                    # API Route Handlers
│       ├── auth/
│       │   ├── google/
│       │   │   ├── route.ts    # OAuth redirect to Google consent
│       │   │   └── callback/
│       │   │       └── route.ts # OAuth callback → session creation
│       │   └── session/
│       │       └── route.ts    # GET: session status, DELETE: logout
│       ├── drive/
│       │   ├── route.ts        # CRUD: list, create folder, rename, delete
│       │   ├── file/
│       │   │   └── route.ts    # GET: file metadata (id, name, parents)
│       │   ├── preview/
│       │   │   └── route.ts    # GET: proxy file content for in-app preview
│       │   └── upload/
│       │       └── route.ts    # File upload + AI categorization + indexing
│       ├── search/
│       │   └── route.ts        # Semantic search via ChromaDB embeddings
│       └── categorize/
│           └── route.ts        # Re-categorize existing file with AI
│
├── components/
│   ├── ui/                     # shadcn/ui base components (~55 components)
│   ├── providers/
│   │   └── query-provider.tsx  # TanStack Query QueryClientProvider
│   └── drive/                  # Google Drive feature components
│       ├── file-manager.tsx    # Main file manager (composes all below)
│       ├── storage-toggle.tsx  # Google Drive / Local toggle
│       ├── toolbar.tsx         # Upload, New Folder, Search, View mode
│       ├── breadcrumb-nav.tsx  # Folder path breadcrumbs
│       ├── folder-tree.tsx     # Sidebar folder tree (TanStack Query)
│       ├── file-grid.tsx       # Grid/list view with context menu
│       ├── file-upload-dialog.tsx  # Drag-and-drop upload + parallel processing
│       ├── file-preview-dialog.tsx # In-app file preview (image/PDF/video/audio/text)
│       └── search-dialog.tsx   # AI semantic search dialog (⌘K)
│
├── hooks/
│   ├── use-auth.ts             # Google OAuth auth state
│   ├── use-drive.ts            # Drive API operations
│   └── use-mobile.ts           # Mobile viewport detection
│
├── lib/
│   ├── utils.ts                # Utility: cn() for className merge
│   ├── axios.ts                # Axios instance for API calls
│   ├── google-auth.ts          # Google OAuth2 client + token refresh
│   ├── session.ts              # JWT session encrypt/decrypt (jose)
│   ├── google-drive.ts         # Google Drive API wrapper
│   ├── ai-categorize.ts        # Electrical Engineer AI categorization
│   ├── embeddings.ts           # OpenRouter embedding generation
│   └── vector-store.ts         # ChromaDB vector store operations
│
├── .env.local                  # Environment variables (secrets)
├── eslint.config.mjs           # ESLint flat config
├── .prettierrc                 # Prettier config (single quotes, no semi)
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── package.json                # Dependencies & scripts
```

---

## Features

### 1. Google Drive File Management (`/drive`)

An integrated file manager for organizing files on Google Drive with AI assistance.

**Capabilities:**

- **Google OAuth 2.0** — Per-user authentication with Drive scopes, automatic token refresh
- **File browsing** — Grid/list views, folder navigation, breadcrumbs
- **Folder tree** — Collapsible sidebar with lazy-loaded sub-folders (TanStack Query, auto-refreshes on changes)
- **File upload** — Drag-and-drop with **parallel multi-file processing** (all files upload concurrently)
- **AI categorization** — Electrical Engineer persona analyzes files across 7 disciplines (Power System, Control & Automation, Lighting, Communication & Security, Renewable Energy, Smart Grid, Meter Infrastructure AMI/AMR). Always runs on upload regardless of current folder.
- **In-app file preview** — Click any file to preview inline. Supports images, PDFs, Google Docs/Sheets/Slides (exported as PDF), video, audio, and text files. Non-ASCII filenames (Thai) handled via RFC 5987 encoding.
- **AI semantic search** — Press ⌘K to search files by meaning (not just name). Uses OpenRouter embeddings + ChromaDB cosine similarity. Clicking a result navigates to the file's parent folder.
- **Vector indexing** — All uploaded files are embedded via OpenRouter and stored in ChromaDB for semantic search.
- **CRUD operations** — Create folders, rename, move, delete (trash). Deleting files/folders also removes them from the vector store (folders are cleaned recursively).
- **Storage toggle** — Switch between Google Drive and Local storage

### 2. Dashboard (`/`)

Landing page with CRM overview and analytics (Recharts charts).

---

## Environment Variables

| Variable | Description | Required |
| ---------- | ------------- | ---------- |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | ✅ |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL (`http://localhost:3000/api/auth/google/callback`) | ✅ |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI categorization + embeddings | ✅ |
| `OPENROUTER_MODEL` | AI model ID (default: `google/gemini-2.0-flash-001`) | ❌ |
| `OPENROUTER_EMBEDDING_MODEL` | Embedding model (default: `openai/text-embedding-3-small`) | ❌ |
| `CHROMA_URL` | ChromaDB server URL (default: `http://localhost:8000`) | ❌ |
| `SESSION_SECRET` | Secret key for JWT session encryption (32+ chars) | ✅ |

**Generate session secret:**

```bash
openssl rand -base64 32
```

**Start ChromaDB (Docker):**

```bash
docker run -d --name chromadb -p 8000:8000 -e CHROMA_SERVER_CORS_ALLOW_ORIGINS='["*"]' -v chromadb-data:/chroma/chroma chromadb/chroma
```

---

## API Routes

| Method | Endpoint | Description |
| -------- | ---------- | ------------- |
| `GET` | `/api/auth/google` | Redirect to Google OAuth consent |
| `GET` | `/api/auth/google/callback` | Handle OAuth callback, create session |
| `GET` | `/api/auth/session` | Check session status |
| `DELETE` | `/api/auth/session` | Logout (delete session cookie) |
| `GET` | `/api/drive?folderId=` | List files in folder |
| `GET` | `/api/drive?action=path&folderId=` | Get folder breadcrumb path |
| `POST` | `/api/drive` | Create folder `{ name, parentId? }` |
| `PATCH` | `/api/drive` | Rename/move file `{ fileId, newName?, newParentId? }` |
| `DELETE` | `/api/drive` | Delete file/folder `{ fileId, isFolder? }` + vector cleanup |
| `GET` | `/api/drive/file?fileId=` | Get file metadata (id, name, mimeType, parents) |
| `GET` | `/api/drive/preview?fileId=` | Proxy file content for in-app preview |
| `POST` | `/api/drive/upload` | Upload file + AI categorization + vector indexing |
| `GET` | `/api/search?q=&limit=` | Semantic search via embeddings + ChromaDB |
| `POST` | `/api/categorize` | Re-categorize file `{ fileId, fileName }` |

---

## Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check + fix
npm run format       # Prettier format all files
npm run format:check # Prettier check without writing
```

---

## Code Style

- **Quotes:** Single quotes for JS/TS, double quotes for JSX attributes
- **Semicolons:** None
- **Trailing commas:** ES5
- **Tab width:** 2 spaces
- **Print width:** 80 characters
- **Format on save:** Via ESLint (`source.fixAll.eslint` in VS Code)

---

## Design Patterns

### Server vs Client Components

- **Server Components** (default): Pages, layouts, data-fetching components
- **Client Components** (`'use client'`): Interactive UI (file manager, dialogs, forms)
- **Server-only libs**: `lib/google-auth.ts`, `lib/session.ts`, `lib/google-drive.ts`, `lib/ai-categorize.ts` — use `import 'server-only'` to prevent client import

### State Management

- **TanStack Query** — Server state caching for folder tree (`queryKey: ['drive-folders']`), with `invalidateQueries` on mutations
- **React hooks** (`useState`, `useCallback`, `useEffect`) for local UI state
- **Custom hooks** (`useAuth`, `useDrive`) encapsulate API calls and state
- **Axios** instance (`lib/axios.ts`) for all API calls

### Authentication

- JWT tokens stored in httpOnly cookies (encrypted with `jose`)
- Google OAuth tokens embedded in session payload
- **Automatic token refresh** — `getAuthenticatedClient` proactively refreshes expired access tokens using the refresh token and updates the session cookie
- Session auto-expires after 7 days

### Vector Store (ChromaDB)

- **ChromaDB v3** running in Docker on port 8000
- Client uses separate `host`, `port`, `ssl` params (not URL string)
- Custom `OpenRouterEmbeddingFunction` wraps `generateEmbeddings()` from `lib/embeddings.ts`
- Collection: `drive-files` with `hnsw:space: cosine`
- Documents indexed on upload, removed on file/folder deletion (recursive)

### UI Component Library

- **@base-ui/react** (headless) — uses `render` prop for composition, NOT `asChild`
- **shadcn/ui** wrappers in `components/ui/` — pre-styled with Tailwind
- **Lucide icons** — consistent iconography
