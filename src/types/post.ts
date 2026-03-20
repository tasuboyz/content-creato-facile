import type { Database } from "@/integrations/supabase/types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type SettingsInsert = Database["public"]["Tables"]["settings"]["Insert"];

export type StatoSocial = Database["public"]["Enums"]["stato_social"];
export type StatoMedia = Database["public"]["Enums"]["stato_media"];

export const STATO_SOCIAL_ORDER: StatoSocial[] = ["Bozza", "Generato", "Approvato", "Pubblicato"];

export const STATO_COLORS: Record<StatoSocial, string> = {
  "In corso": "bg-stato-in-corso",
  "Bozza": "bg-stato-bozza",
  "Generato": "bg-stato-generato",
  "Approvato": "bg-stato-approvato",
  "Pubblicato": "bg-stato-pubblicato",
};
