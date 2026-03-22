import { useParams, useNavigate } from "react-router-dom";
import { usePost, usePosts } from "@/hooks/usePosts";
import { useSettings } from "@/hooks/useSettings";
import { AppLayout } from "@/components/AppLayout";
import { StatoBadge } from "@/components/StatoBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Check, Send, Loader2, Image as ImageIcon, Trash2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id);
  const { updatePost, deletePost } = usePosts();
  const { settingsQuery } = useSettings();

  const [captionLinkedin, setCaptionLinkedin] = useState("");
  const [captionInstagram, setCaptionInstagram] = useState("");
  const [noteCorrezione, setNoteCorrezione] = useState("");
  const [pubblicaLinkedin, setPubblicaLinkedin] = useState("");
  const [pubblicaInstagram, setPubblicaInstagram] = useState("");
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    if (post) {
      setCaptionLinkedin(post.caption_linkedin ?? "");
      setCaptionInstagram(post.caption_instagram ?? "");
      setNoteCorrezione(post.note_correzione ?? "");
      setPubblicaLinkedin(post.pubblica_linkedin ? post.pubblica_linkedin.slice(0, 16) : "");
      setPubblicaInstagram(post.pubblica_instagram ? post.pubblica_instagram.slice(0, 16) : "");
    }
  }, [post]);

  if (isLoading || !post) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const slides = post.png_attachments ?? [];

  const handleSave = () => {
    updatePost.mutate({
      id: post.id,
      caption_linkedin: captionLinkedin,
      caption_instagram: captionInstagram,
      note_correzione: noteCorrezione,
      pubblica_linkedin: pubblicaLinkedin ? new Date(pubblicaLinkedin).toISOString() : null,
      pubblica_instagram: pubblicaInstagram ? new Date(pubblicaInstagram).toISOString() : null,
    });
    toast.success("Post salvato");
  };

  const handleApprova = (platform: "linkedin" | "instagram") => {
    const update = platform === "linkedin"
      ? { id: post.id, stato_linkedin: "Approvato" as const }
      : { id: post.id, stato_instagram: "Approvato" as const };
    updatePost.mutate(update);
    toast.success(`${platform === "linkedin" ? "LinkedIn" : "Instagram"} approvato`);
  };

  const handlePubblica = async () => {
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

    setIsPublishing(true);
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
              caption_linkedin: captionLinkedin,
              immagini: post.png_attachments ?? [],
              linkedin_page_id: settings?.linkedin_page_id ?? "",
              pubblica_linkedin: pubblicaLinkedin ? new Date(pubblicaLinkedin).toISOString() : null,
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
              caption_instagram: captionInstagram,
              immagini: post.png_attachments ?? [],
              instagram_account_id: settings?.instagram_account_id ?? "",
              pubblica_instagram: pubblicaInstagram ? new Date(pubblicaInstagram).toISOString() : null,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`Instagram webhook: stato ${res.status}`);
            updates.stato_instagram = "Pubblicato";
          })
        );
      }

      await Promise.all(calls);

      updatePost.mutate({
        id: post.id,
        ...updates,
        pubblicato_il: new Date().toISOString(),
      });
      toast.success("Post pubblicato con successo!");
    } catch (err: any) {
      toast.error(err instanceof TypeError ? "Impossibile raggiungere il webhook" : err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRigenera = async () => {
    const webhookUrl = settingsQuery.data?.webhook_genera_caption;
    if (!webhookUrl) {
      toast.error("Configura il webhook 'Genera Caption' nelle Impostazioni");
      return;
    }

    setIsRegenerating(true);
    updatePost.mutate({ id: post.id, stato_linkedin: "In corso", stato_instagram: "In corso" });

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.id,
          pdf_link: post.pdf_link,
          note: noteCorrezione,
          immagini: post.png_attachments ?? [],
          prompt_sistema: settingsQuery.data?.prompt_sistema ?? "",
        }),
      });

      if (!res.ok) throw new Error(`Webhook ha risposto con stato ${res.status}`);

      const data = await res.json();
      const newLinkedin = data.caption_linkedin ?? "";
      const newInstagram = data.caption_instagram ?? "";

      setCaptionLinkedin(newLinkedin);
      setCaptionInstagram(newInstagram);

      updatePost.mutate({
        id: post.id,
        caption_linkedin: newLinkedin,
        caption_instagram: newInstagram,
        stato_linkedin: "Generato",
        stato_instagram: "Generato",
        generato_il: new Date().toISOString(),
      });
      toast.success("Caption rigenerate con successo!");
    } catch (err: any) {
      updatePost.mutate({ id: post.id, stato_linkedin: "Generato", stato_instagram: "Generato" });
      toast.error(err instanceof TypeError ? "Impossibile raggiungere il webhook" : `Errore: ${err.message}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Sei sicuro di voler eliminare questo post?")) {
      deletePost.mutate(post.id, { onSuccess: () => navigate("/") });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{post.nome_post}</h1>
            <div className="flex gap-2 mt-1">
              <StatoBadge stato={post.stato_linkedin} platform="linkedin" />
              <StatoBadge stato={post.stato_instagram} platform="instagram" />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center">
              {slides.length > 0 ? (
                <img src={slides[selectedSlide]} alt={`Slide ${selectedSlide + 1}`} className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Nessuna slide caricata</p>
                </div>
              )}
            </div>
            {slides.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {slides.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlide(i)}
                    className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 transition-colors ${
                      i === selectedSlide ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={url} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Captions */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-linkedin" /> Caption LinkedIn
                </Label>
                <Textarea
                  value={captionLinkedin}
                  onChange={(e) => setCaptionLinkedin(e.target.value)}
                  rows={8}
                  placeholder="Caption per LinkedIn..."
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-instagram" /> Caption Instagram
                </Label>
                <Textarea
                  value={captionInstagram}
                  onChange={(e) => setCaptionInstagram(e.target.value)}
                  rows={8}
                  placeholder="Caption per Instagram..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Note correzione</Label>
              <Textarea
                value={noteCorrezione}
                onChange={(e) => setNoteCorrezione(e.target.value)}
                rows={3}
                placeholder="Note per la rigenerazione..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pubblica LinkedIn</Label>
                <Input type="datetime-local" value={pubblicaLinkedin} onChange={(e) => setPubblicaLinkedin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Pubblica Instagram</Label>
                <Input type="datetime-local" value={pubblicaInstagram} onChange={(e) => setPubblicaInstagram(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleSave} className="gap-1.5">
                <Save className="h-4 w-4" /> Salva
              </Button>
              <Button variant="outline" className="gap-1.5" disabled={isRegenerating} onClick={handleRigenera}>
                {isRegenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isRegenerating ? "Rigenerando..." : "Rigenera"}
              </Button>
              <Button variant="outline" onClick={() => handleApprova("linkedin")} className="gap-1.5"
                disabled={post.stato_linkedin === "Approvato" || post.stato_linkedin === "Pubblicato"}>
                <Check className="h-4 w-4" /> Approva LinkedIn
              </Button>
              <Button variant="outline" onClick={() => handleApprova("instagram")} className="gap-1.5"
                disabled={post.stato_instagram === "Approvato" || post.stato_instagram === "Pubblicato"}>
                <Check className="h-4 w-4" /> Approva Instagram
              </Button>
              <Button onClick={handlePubblica} className="gap-1.5" disabled={
                isPublishing ||
                (post.stato_linkedin !== "Approvato" && post.stato_instagram !== "Approvato")
              }>
                {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isPublishing ? "Pubblicando..." : "Pubblica ora"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
