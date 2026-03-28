import axios from 'axios'

/**
 * Axios instance for FastAPI backend.
 * Pre-configured with base URL and JSON content type.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})
