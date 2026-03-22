import { usePosts } from "@/hooks/usePosts";
import { useSettings } from "@/hooks/useSettings";
import { PostCard } from "@/components/PostCard";
import { AppLayout } from "@/components/AppLayout";
import { STATO_SOCIAL_ORDER, type StatoSocial } from "@/types/post";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const COLUMN_LABELS: Record<string, string> = {
  Bozza: "Bozza",
  Generato: "Generato",
  Approvato: "Approvato",
  Pubblicato: "Pubblicato",
};

export default function DashboardPage() {
  const { postsQuery, updatePost } = usePosts();
  const { settingsQuery } = useSettings();
  const posts = postsQuery.data ?? [];
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const getPostsByStato = (stato: StatoSocial) =>
    posts.filter((p) => p.stato_linkedin === stato || p.stato_instagram === stato);

  const handleApprova = (id: string) => {
    updatePost.mutate({ id, stato_linkedin: "Approvato", stato_instagram: "Approvato" });
    toast.success("Post approvato");
  };

  const handlePubblica = async (id: string) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const settings = settingsQuery.data;
    const linkedinWebhook = settings?.webhook_pubblica_linkedin;
    const instagramWebhook = settings?.webhook_pubblica_instagram;

    const publishLinkedin = post.stato_linkedin === "Approvato" && linkedinWebhook;
    const publishInstagram = post.stato_instagram === "Approvato" && instagramWebhook;

    if (!publishLinkedin && !publishInstagram) {
      if (!linkedinWebhook && !instagramWebhook) {
        toast.error("Configura i webhook di pubblicazione nelle Impostazioni");
      } else {
        toast.error("Nessuna piattaforma approvata con webhook configurato");
      }
      return;
    }

    setPublishingId(id);
    const updates: Record<string, string> = {};

    try {
      const calls: Promise<void>[] = [];

      if (publishLinkedin) {
        calls.push(
          fetch(linkedinWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              post_id: post.id,
              caption_linkedin: post.caption_linkedin,
              immagini: post.png_attachments ?? [],
              linkedin_page_id: settings?.linkedin_page_id ?? "",
              pubblica_linkedin: post.pubblica_linkedin,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`LinkedIn webhook: stato ${res.status}`);
            updates.stato_linkedin = "Pubblicato";
          })
        );
      }

      if (publishInstagram) {
        calls.push(
          fetch(instagramWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              post_id: post.id,
              caption_instagram: post.caption_instagram,
              immagini: post.png_attachments ?? [],
              instagram_account_id: settings?.instagram_account_id ?? "",
              pubblica_instagram: post.pubblica_instagram,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`Instagram webhook: stato ${res.status}`);
            updates.stato_instagram = "Pubblicato";
          })
        );
      }

      await Promise.all(calls);

      updatePost.mutate({
        id,
        ...updates,
        pubblicato_il: new Date().toISOString(),
      });
      toast.success("Post pubblicato con successo!");
    } catch (err: any) {
      toast.error(err instanceof TypeError ? "Impossibile raggiungere il webhook" : err.message);
    } finally {
      setPublishingId(null);
    }
  };

  if (postsQuery.isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestisci il tuo piano editoriale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATO_SOCIAL_ORDER.map((stato) => {
            const columnPosts = getPostsByStato(stato);
            return (
              <div key={stato} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">{COLUMN_LABELS[stato]}</h2>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {columnPosts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {columnPosts.map((post, i) => (
                    <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                      <PostCard post={post} onApprova={handleApprova} onPubblica={handlePubblica} isPublishing={publishingId === post.id} />
                    </div>
                  ))}
                  {columnPosts.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
                      <p className="text-xs text-muted-foreground">Nessun post</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
