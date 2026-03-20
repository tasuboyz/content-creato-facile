import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Settings } from "@/types/post";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Settings | null;
    },
    enabled: !!user,
  });

  const upsertSettings = useMutation({
    mutationFn: async (settings: Partial<Settings>) => {
      if (!user) throw new Error("Non autenticato");
      const { data, error } = await supabase
        .from("settings")
        .upsert({ ...settings, user_id: user.id }, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Impostazioni salvate");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { settingsQuery, upsertSettings };
}
