import { useState, useEffect } from 'react'

// User type
export type User = {
  email: string
  id: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch current user from backend
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser({ email: data.user.email, id: data.user._id })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const signOut = async () => {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
  }

  return {
    user,
    loading,
    signOut
  }
}