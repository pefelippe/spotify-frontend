export interface AuthContextData {
  isAuthenticated: boolean
  accessToken: string | null
  authenticate: (code: string) => Promise<void>
  logout: () => void
} 