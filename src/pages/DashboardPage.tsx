import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/PostCard";
import { AppLayout } from "@/components/AppLayout";
import { STATO_SOCIAL_ORDER, type StatoSocial } from "@/types/post";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const COLUMN_LABELS: Record<string, string> = {
  Bozza: "Bozza",
  Generato: "Generato",
  Approvato: "Approvato",
  Pubblicato: "Pubblicato",
};

export default function DashboardPage() {
  const { postsQuery, updatePost } = usePosts();
  const posts = postsQuery.data ?? [];

  const getPostsByStato = (stato: StatoSocial) =>
    posts.filter((p) => p.stato_linkedin === stato || p.stato_instagram === stato);

  const handleApprova = (id: string) => {
    updatePost.mutate({ id, stato_linkedin: "Approvato", stato_instagram: "Approvato" });
    toast.success("Post approvato");
  };

  const handlePubblica = (id: string) => {
    updatePost.mutate({ id, stato_linkedin: "Pubblicato", stato_instagram: "Pubblicato", pubblicato_il: new Date().toISOString() });
    toast.success("Post contrassegnato come pubblicato");
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
                      <PostCard post={post} onApprova={handleApprova} onPubblica={handlePubblica} />
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
