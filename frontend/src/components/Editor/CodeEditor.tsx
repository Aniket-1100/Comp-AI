import { Editor } from "@monaco-editor/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Code, Palette } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CodeEditorProps {
  jsxCode: string
  cssCode: string
  onJsxChange: (value: string) => void
  onCssChange: (value: string) => void
}

export const CodeEditor = ({ jsxCode, cssCode, onJsxChange, onCssChange }: CodeEditorProps) => {
  const handleCopy = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Copied!",
      description: `${type} code copied to clipboard`,
    })
  }

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded!",
      description: `${filename} has been downloaded`,
    })
  }

  return (
    <Card className="h-full bg-gradient-card border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Code className="w-4 h-4" />
          Code Editor
        </h2>
      </div>

      <Tabs defaultValue="jsx" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="jsx" className="flex-1">JSX</TabsTrigger>
            <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="jsx" className="flex-1 m-0 p-4 pt-2">
          <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCopy(jsxCode, 'JSX')}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload(jsxCode, 'component.jsx')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </div>
            <div className="flex-1 border border-border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={jsxCode}
                onChange={(value) => onJsxChange(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0 p-4 pt-2">
          <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleCopy(cssCode, 'CSS')}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload(cssCode, 'styles.css')}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </div>
            <div className="flex-1 border border-border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="css"
                value={cssCode}
                onChange={(value) => onCssChange(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}