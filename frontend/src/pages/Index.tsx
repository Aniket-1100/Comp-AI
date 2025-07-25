import { useAuth } from "@/hooks/useAuth"
import { MainLayout } from "@/components/Layout/MainLayout"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading ComponentAI...</p>
        </motion.div>
      </div>
    )
  }

  return <MainLayout user={user} onSignOut={signOut} />
}

export default Index;
