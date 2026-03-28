export interface CategorizeResult {
  category: string
  confidence: number
  reasoning: string
  suggestedFolder: string
}

export interface DriveFile {
  createdTime?: string
  iconLink?: string
  id: string
  isFolder: boolean
  mimeType: string
  modifiedTime?: string
  name: string
  parents?: string[]
  size?: string
  thumbnailLink?: string
  webViewLink?: string
}

export interface UploadResult {
  categorization: CategorizeResult | null
  file: DriveFile
}
