import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

export interface PreviewFile {
  path: string
  parsed?: ParsedContent
}

export interface DraftFile {
  path: string
  parsed?: ParsedContent
  new?: boolean
  oldPath?: string
  pathMeta?: Record<string, unknown>
}

export interface PreviewResponse {
  files: PreviewFile[]
  additions: DraftFile[]
  deletions: DraftFile[]
}

export interface FileChangeMessagePayload {
  additions: Array<PreviewFile>
  deletions: Array<PreviewFile>
}
