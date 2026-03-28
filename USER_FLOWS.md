# KM-CRM — User Flows

## 1. Authentication Flow

```mermaid
flowchart TD
  A["User visits /drive"] --> B{Authenticated?}
  B -- No --> C["Show 'Connect Google Drive' screen"]
  C --> D["Click 'Sign in with Google'"]
  D --> E["Redirect to Google OAuth consent"]
  E --> F["User grants Drive permissions"]
  F --> G["/api/auth/google/callback"]
  G --> H["Exchange code → tokens"]
  H --> I["Create JWT session cookie"]
  I --> J["Redirect to /drive"]
  J --> K["File Manager loads"]

  B -- Yes --> K
```

---

## 2. File Upload Flow (Parallel)

```mermaid
flowchart TD
  A["Click 'Upload' or drag files"] --> B["File Upload Dialog opens"]
  B --> C["User drops/selects files"]
  C --> D["All files process in parallel\n(Promise.all)"]

  D --> E["POST /api/drive/upload\n(per file)"]
  E --> F["Extract text content"]
  F --> G["AI categorizes file\n(Electrical Engineer persona)"]
  G --> H["Create folder path\nif not exists"]
  H --> I["Upload to AI-suggested folder"]
  I --> J["Generate embedding\n(OpenRouter)"]
  J --> K["Store vector in ChromaDB"]
  K --> L["Show result per file\n(category + folder)"]
  L --> M["Refresh file list +\nfolder tree"]
```

> **Note:** AI categorization always runs regardless of current folder. The `folderId` is never sent from the frontend.

---

## 3. File Browsing Flow

```mermaid
flowchart TD
  A["File Manager loads"] --> B["GET /api/drive\nList root files"]
  B --> C["Render files in grid/list"]

  C --> D{User action}

  D --> E["Click folder"]
  E --> F["Load folder contents"]
  F --> G["Update breadcrumbs"]
  G --> C

  D --> H["Click breadcrumb"]
  H --> F

  D --> I["Click folder in sidebar tree"]
  I --> F

  D --> J["Click file"]
  J --> K["Open File Preview Dialog"]

  D --> L["Toggle grid/list view"]
  L --> C

  D --> M["Type in filter box"]
  M --> N["Filter files by name"]
  N --> C
```

---

## 4. File Preview Flow

```mermaid
flowchart TD
  A["Click file in grid/list"] --> B["FilePreviewDialog opens"]
  B --> C{File type?}

  C --> D["Image"]
  D --> E["GET /api/drive/preview\nProxy from Drive"]
  E --> F["Render <img>"]

  C --> G["PDF"]
  G --> E
  E --> H["Render <iframe>"]

  C --> I["Google Doc/Sheet/Slide"]
  I --> J["Export as PDF\nvia Drive API"]
  J --> H

  C --> K["Video / Audio"]
  K --> E
  E --> L["HTML5 <video>/<audio>"]

  C --> M["Text / JSON"]
  M --> E
  E --> N["Render <pre> block"]

  C --> O["Unsupported type"]
  O --> P["Show fallback +\nOpen in Drive button"]

  B --> Q["Header actions:\nOpen in Drive | Download | Close"]
```

> **Note:** Non-ASCII filenames (Thai) use RFC 5987 encoding in `Content-Disposition` headers.

---

## 5. AI Semantic Search Flow

```mermaid
flowchart TD
  A["Press ⌘K or click 'AI Search'"] --> B["Search Dialog opens"]
  B --> C["User types query"]
  C --> D["Debounce 400ms"]
  D --> E["GET /api/search?q=..."]
  E --> F["Generate query embedding\n(OpenRouter)"]
  F --> G["Query ChromaDB\n(cosine similarity)"]
  G --> H["Return top-K results\nwith scores"]
  H --> I["Display results:\nname, score%, folder, snippet"]

  I --> J{User action}
  J --> K["Click a result"]
  K --> L["GET /api/drive/file\nGet file parents"]
  L --> M["Navigate to parent folder"]
  J --> N["Refine query"]
  N --> C
  J --> O["Press Esc / close"]
```

---

## 6. File Management Flow

```mermaid
flowchart TD
  A["Hover file → context menu (⋮)\n(top-right corner)"] --> B{Action}

  B --> C["Rename"]
  C --> D["Rename dialog opens"]
  D --> E["Enter new name → confirm"]
  E --> F["PATCH /api/drive\n{fileId, newName}"]
  F --> G["Refresh file list"]

  B --> H["Open in Drive"]
  H --> I["Open webViewLink\nin new tab"]

  B --> J["Delete"]
  J --> K{Is folder?}
  K -- File --> L["DELETE /api/drive\n{fileId}"]
  L --> M["Remove from ChromaDB"]
  M --> G

  K -- Folder --> N["Collect all file IDs\n(recursive)"]
  N --> O["DELETE /api/drive\n{fileId, isFolder: true}"]
  O --> P["Batch remove from ChromaDB"]
  P --> Q["Invalidate folder tree\n(TanStack Query)"]
  Q --> G

  B --> R["Create New Folder"]
  R --> S["New Folder dialog"]
  S --> T["Enter name → confirm"]
  T --> U["POST /api/drive\n{name, parentId}"]
  U --> G
```

---

## 7. Storage Toggle Flow

```mermaid
flowchart TD
  A["Storage Toggle\n(header bar)"] --> B{Selected}

  B --> C["Google Drive (default)"]
  C --> D["All operations go through\nGoogle Drive API"]

  B --> E["Local"]
  E --> F["Browser file picker\n(download only, no server storage)"]
```

---

## 8. Logout Flow

```mermaid
flowchart TD
  A["Click logout icon"] --> B["DELETE /api/auth/session"]
  B --> C["Clear session cookie"]
  C --> D["Redirect to login screen"]
```

---

## Page Map

```mermaid
graph TB
  subgraph Pages
    HOME["/\nDashboard"]
    DRIVE["/drive\nFile Manager"]
  end

  subgraph "API Routes"
    AUTH1["/api/auth/google"]
    AUTH2["/api/auth/google/callback"]
    AUTH3["/api/auth/session"]
    DRIVE_API["/api/drive"]
    DRIVE_FILE["/api/drive/file"]
    DRIVE_PREVIEW["/api/drive/preview"]
    UPLOAD["/api/drive/upload"]
    SEARCH["/api/search"]
    CAT["/api/categorize"]
  end

  DRIVE --> AUTH1
  AUTH1 -->|"redirect"| AUTH2
  AUTH2 -->|"session"| DRIVE

  DRIVE --> DRIVE_API
  DRIVE --> DRIVE_FILE
  DRIVE --> DRIVE_PREVIEW
  DRIVE --> UPLOAD
  DRIVE --> SEARCH
  DRIVE --> CAT
  DRIVE --> AUTH3
```
