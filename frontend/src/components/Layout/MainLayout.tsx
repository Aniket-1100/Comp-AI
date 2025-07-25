import { useState } from "react"
import { Header } from "./Header"
import { ChatPanel } from "../Chat/ChatPanel"
import { CodeEditor } from "../Editor/CodeEditor"
import { ComponentPreview } from "../Preview/ComponentPreview"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { motion } from "framer-motion"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface MainLayoutProps {
  user: any
  onSignOut: () => void
}

export const MainLayout = ({ user, onSignOut }: MainLayoutProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. Describe the React component you\'d like me to generate and I\'ll create it for you with JSX and CSS.',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [jsxCode, setJsxCode] = useState(`export default function WelcomeComponent() {
  return (
    <div className="welcome-container">
      <h1>Welcome to ComponentAI</h1>
      <p>Start by describing a component you'd like me to generate!</p>
    </div>
  )
}`)
  const [cssCode, setCssCode] = useState(`.welcome-container {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #1e40af, #06b6d4);
  border-radius: 1rem;
  color: white;
}

.welcome-container h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.welcome-container p {
  font-size: 1.125rem;
  opacity: 0.9;
}`)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call backend Cohere AI endpoint
      const res = await fetch('http://localhost:5000/api/cohere/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content, jsx: jsxCode }),
      });
      const data = await res.json();
      const aiText = data.generations?.[0]?.text || data.text || 'AI response error.';
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiText,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      // Extract code blocks from aiText
      const jsxMatch = aiText.match(/```(?:jsx|tsx)?([\s\S]*?)```/);
      if (jsxMatch) setJsxCode(jsxMatch[1].trim());
      const cssMatch = aiText.match(/```css([\s\S]*?)```/);
      if (cssMatch) setCssCode(cssMatch[1].trim());
    } catch (error) {
      console.error('Error generating component:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while generating your component. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewSession = () => {
    setMessages([{
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. Describe the React component you\'d like me to generate and I\'ll create it for you with JSX and CSS.',
      timestamp: new Date()
    }])
    setJsxCode(`export default function WelcomeComponent() {
  return (
    <div className="welcome-container">
      <h1>Welcome to ComponentAI</h1>
      <p>Start by describing a component you'd like me to generate!</p>
    </div>
  )
}`)
    setCssCode(`.welcome-container {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #1e40af, #06b6d4);
  border-radius: 1rem;
  color: white;
}

.welcome-container h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.welcome-container p {
  font-size: 1.125rem;
  opacity: 0.9;
}`)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "Hello! I'm your AI assistant. Describe the React component you'd like me to generate and I'll create it for you with JSX and CSS.",
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header user={user} onSignOut={onSignOut} onNewSession={handleNewSession} />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 p-4"
      >
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-border">
          <ResizablePanel defaultSize={25} minSize={20}>
            <ChatPanel 
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearChat={handleClearChat}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={40} minSize={30}>
            <CodeEditor
              jsxCode={jsxCode}
              cssCode={cssCode}
              onJsxChange={setJsxCode}
              onCssChange={setCssCode}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={35} minSize={25}>
            <ComponentPreview jsxCode={jsxCode} cssCode={cssCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </motion.div>
    </div>
  )
}