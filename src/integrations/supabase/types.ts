export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      posts: {
        Row: {
          caption_instagram: string | null
          caption_linkedin: string | null
          created_at: string
          generato_il: string | null
          id: string
          media_group_id: string | null
          nome_post: string
          note_correzione: string | null
          pdf_link: string | null
          png_attachments: string[] | null
          pubblica_instagram: string | null
          pubblica_linkedin: string | null
          pubblicato_il: string | null
          stato_instagram: Database["public"]["Enums"]["stato_social"]
          stato_linkedin: Database["public"]["Enums"]["stato_social"]
          stato_pdf: Database["public"]["Enums"]["stato_media"]
          stato_png: Database["public"]["Enums"]["stato_media"]
          updated_at: string
          user_id: string
        }
        Insert: {
          caption_instagram?: string | null
          caption_linkedin?: string | null
          created_at?: string
          generato_il?: string | null
          id?: string
          media_group_id?: string | null
          nome_post: string
          note_correzione?: string | null
          pdf_link?: string | null
          png_attachments?: string[] | null
          pubblica_instagram?: string | null
          pubblica_linkedin?: string | null
          pubblicato_il?: string | null
          stato_instagram?: Database["public"]["Enums"]["stato_social"]
          stato_linkedin?: Database["public"]["Enums"]["stato_social"]
          stato_pdf?: Database["public"]["Enums"]["stato_media"]
          stato_png?: Database["public"]["Enums"]["stato_media"]
          updated_at?: string
          user_id: string
        }
        Update: {
          caption_instagram?: string | null
          caption_linkedin?: string | null
          created_at?: string
          generato_il?: string | null
          id?: string
          media_group_id?: string | null
          nome_post?: string
          note_correzione?: string | null
          pdf_link?: string | null
          png_attachments?: string[] | null
          pubblica_instagram?: string | null
          pubblica_linkedin?: string | null
          pubblicato_il?: string | null
          stato_instagram?: Database["public"]["Enums"]["stato_social"]
          stato_linkedin?: Database["public"]["Enums"]["stato_social"]
          stato_pdf?: Database["public"]["Enums"]["stato_media"]
          stato_png?: Database["public"]["Enums"]["stato_media"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          anthropic_api_key: string | null
          created_at: string
          id: string
          instagram_account_id: string | null
          linkedin_page_id: string | null
          prompt_sistema: string | null
          updated_at: string
          user_id: string
          webhook_genera_caption: string | null
          webhook_pubblica_instagram: string | null
          webhook_pubblica_linkedin: string | null
        }
        Insert: {
          anthropic_api_key?: string | null
          created_at?: string
          id?: string
          instagram_account_id?: string | null
          linkedin_page_id?: string | null
          prompt_sistema?: string | null
          updated_at?: string
          user_id: string
          webhook_genera_caption?: string | null
          webhook_pubblica_instagram?: string | null
          webhook_pubblica_linkedin?: string | null
        }
        Update: {
          anthropic_api_key?: string | null
          created_at?: string
          id?: string
          instagram_account_id?: string | null
          linkedin_page_id?: string | null
          prompt_sistema?: string | null
          updated_at?: string
          user_id?: string
          webhook_genera_caption?: string | null
          webhook_pubblica_instagram?: string | null
          webhook_pubblica_linkedin?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      stato_media: "Vuoto" | "Caricato"
      stato_social:
        | "In corso"
        | "Bozza"
        | "Generato"
        | "Approvato"
        | "Pubblicato"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      stato_media: ["Vuoto", "Caricato"],
      stato_social: [
        "In corso",
        "Bozza",
        "Generato",
        "Approvato",
        "Pubblicato",
      ],
    },
  },
} as const
