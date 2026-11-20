import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)

  const login = (role, user = {}) => {
    setSession({ role, user })
  }
  const logout = () => setSession(null)

  const value = useMemo(() => ({ session, login, logout }), [session])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
