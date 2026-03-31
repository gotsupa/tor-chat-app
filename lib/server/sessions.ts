/**
 * In-memory session store for chat PDF sessions.
 * Stores extracted PDF text keyed by session ID.
 *
 * ⚠️ This is for development only — sessions are lost on server restart.
 * For production, use Redis or a database.
 */

export interface ChatSessionData {
  createdAt: Date
  fileName: string
  history: Array<{ content: string; role: 'assistant' | 'user' }>
  pdfText: string
}

const sessions = new Map<string, ChatSessionData>()

export function addToHistory(
  id: string,
  role: 'assistant' | 'user',
  content: string
): void {
  const session = sessions.get(id)
  if (session) {
    session.history.push({ content, role })
  }
}

export function createSession(
  id: string,
  fileName: string,
  pdfText: string
): void {
  sessions.set(id, {
    createdAt: new Date(),
    fileName,
    history: [],
    pdfText,
  })
}

export function deleteSession(id: string): void {
  sessions.delete(id)
}

export function getSession(id: string): ChatSessionData | undefined {
  return sessions.get(id)
}
