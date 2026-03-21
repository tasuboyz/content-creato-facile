import { AppLayout } from "@/components/AppLayout";
import { usePosts } from "@/hooks/usePosts";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatoBadge } from "@/components/StatoBadge";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function GeneraPage() {
  const { postsQuery, updatePost } = usePosts();
  const { settingsQuery } = useSettings();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const bozzaPosts = (postsQuery.data ?? []).filter(
    (p) => p.stato_linkedin === "Bozza" || p.stato_instagram === "Bozza"
  );

  const handleGenera = async (postId: string, pdfLink: string | null, noteCorrezione: string | null, pngAttachments: string[] | null) => {
    const webhookUrl = settingsQuery.data?.webhook_genera_caption;
    if (!webhookUrl) {
      toast.error("Configura il webhook 'Genera Caption' nelle Impostazioni");
      return;
    }

    setGeneratingId(postId);
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, pdf_link: pdfLink, note: noteCorrezione, immagini: pngAttachments ?? [] }),
      });

      if (!res.ok) throw new Error("Errore webhook");
      
      const data = await res.json();
      
      updatePost.mutate({
        id: postId,
        caption_linkedin: data.caption_linkedin ?? "",
        caption_instagram: data.caption_instagram ?? "",
        stato_linkedin: "Generato",
        stato_instagram: "Generato",
        generato_il: new Date().toISOString(),
      });
      toast.success("Caption generate con successo!");
    } catch (err: any) {
      toast.error(`Errore: ${err.message}`);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Genera Caption</h1>
          <p className="text-sm text-muted-foreground mt-1">Genera caption AI per i post in bozza</p>
        </div>

        {postsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bozzaPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nessun post in bozza da elaborare</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bozzaPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {post.png_attachments?.[0] ? (
                      <img src={post.png_attachments[0]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{post.nome_post}</p>
                    <div className="flex gap-1.5 mt-1">
                      <StatoBadge stato={post.stato_linkedin} platform="linkedin" />
                      <StatoBadge stato={post.stato_instagram} platform="instagram" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 flex-shrink-0"
                    disabled={generatingId === post.id}
                    onClick={() => handleGenera(post.id, post.pdf_link, post.note_correzione, post.png_attachments)}
                  >
                    {generatingId === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {generatingId === post.id ? "Generando..." : "Genera caption"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
