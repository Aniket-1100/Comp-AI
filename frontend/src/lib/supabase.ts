// Supabase configuration placeholder
// To enable authentication and database features, connect to Supabase using the integration

export const supabase = null

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          chat_history: any[]
          current_code: string
          current_css: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
          chat_history?: any[]
          current_code?: string
          current_css?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          chat_history?: any[]
          current_code?: string
          current_css?: string
        }
      }
    }
  }
}