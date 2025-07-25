import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface PropertyEditorProps {
  props: Record<string, any>;
  onChange: (newProps: Record<string, any>) => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ props, onChange }) => {
  if (!props) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-4 w-80 bg-card border-border text-card-foreground shadow-xl animate-glow-pulse">
        <CardHeader className="mb-2">
          <h3 className="font-bold text-lg tracking-tight">Edit Properties</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(props).map(([key, value]) => (
            <div key={key} className="mb-2">
              <label className="block text-xs font-semibold mb-1 capitalize text-muted-foreground">{key}</label>
              {typeof value === "string" && (
                <Input
                  value={value}
                  onChange={e => onChange({ ...props, [key]: e.target.value })}
                  className="w-full focus:border-primary focus:ring-2 focus:ring-primary"
                />
              )}
              {typeof value === "number" && (
                <Input
                  type="number"
                  value={value}
                  onChange={e => onChange({ ...props, [key]: Number(e.target.value) })}
                  className="w-full focus:border-primary focus:ring-2 focus:ring-primary"
                />
              )}
              {typeof value === "boolean" && (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => onChange({ ...props, [key]: e.target.checked })}
                  className="ml-1 accent-primary focus:ring-2 focus:ring-primary"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 