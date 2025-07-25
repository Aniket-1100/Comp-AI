import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw, Maximize } from "lucide-react"
import { motion } from "framer-motion"

interface ComponentPreviewProps {
  jsxCode: string
  cssCode: string
}

export const ComponentPreview = ({ jsxCode, cssCode }: ComponentPreviewProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const createPreviewContent = () => {
    // Transform JSX to JavaScript for execution in iframe
    const transformedCode = jsxCode
      .replace(/className=/g, 'className=')
      .replace(/export default function (\w+)/g, 'function $1')
      .replace(/export default /g, '')

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Component Preview</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #0a0a0b;
            color: #e5e7eb;
          }
          ${cssCode}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef } = React;
          
          ${transformedCode}
          
          // Find the component function
          const componentNames = Object.getOwnPropertyNames(window).filter(name => 
            typeof window[name] === 'function' && 
            name !== 'useState' && 
            name !== 'useEffect' && 
            name !== 'useRef'
          );
          
          const ComponentToRender = window[componentNames[componentNames.length - 1]] || (() => React.createElement('div', null, 'Component not found'));
          
          try {
            ReactDOM.render(React.createElement(ComponentToRender), document.getElementById('root'));
          } catch (error) {
            document.getElementById('root').innerHTML = \`
              <div style="color: #ef4444; padding: 20px; border: 1px solid #ef4444; border-radius: 8px; margin: 20px;">
                <h3>Error rendering component:</h3>
                <pre>\${error.message}</pre>
              </div>
            \`;
          }
        </script>
      </body>
      </html>
    `
  }

  const updatePreview = () => {
    if (!iframeRef.current) return
    
    try {
      setError(null)
      setIsRefreshing(true)
      
      const content = createPreviewContent()
      const iframe = iframeRef.current
      
      iframe.srcdoc = content
      
      // Handle iframe load
      iframe.onload = () => {
        setIsRefreshing(false)
      }
      
    } catch (err: any) {
      setError(err.message)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview()
    }, 500)

    return () => clearTimeout(timer)
  }, [jsxCode, cssCode])

  const handleRefresh = () => {
    updatePreview()
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen()
    }
  }

  return (
    <Card className="h-full bg-gradient-card border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <h2 className="font-semibold text-foreground">Live Preview</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleFullscreen}
            className="flex items-center gap-1"
          >
            <Maximize className="w-3 h-3" />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center p-6 border border-destructive rounded-lg bg-destructive/10">
              <h3 className="text-lg font-medium text-destructive mb-2">Preview Error</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </motion.div>
        ) : (
          <div className="h-full border border-border rounded-lg overflow-hidden bg-background">
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin"
              title="Component Preview"
            />
          </div>
        )}
      </div>
    </Card>
  )
}