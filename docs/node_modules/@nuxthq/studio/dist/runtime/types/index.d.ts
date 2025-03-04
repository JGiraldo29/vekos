export * from './api'

declare global {
  interface Window {
    openContentInStudioEditor: (ids: string[], navigate?: { navigate?: boolean, pageContentId?: string }) => void
  }
}
