import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const navigate = useNavigate();

  const [nomePost, setNomePost] = useState("");
  const [pngFiles, setPngFiles] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePngDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setPngFiles((prev) => [...prev, ...files]);
  }, []);

  const handlePdfDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setPdfFile(file);
  }, []);

  const removePng = (index: number) => setPngFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!nomePost.trim()) { toast.error("Inserisci il nome del post"); return; }
    if (!user) return;
    setUploading(true);

    try {
      // Upload PNGs
      const pngUrls: string[] = [];
      for (const file of pngFiles) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("post-media").upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
        pngUrls.push(urlData.publicUrl);
      }

      // Upload PDF
      let pdfLink: string | undefined;
      if (pdfFile) {
        const path = `${user.id}/${Date.now()}-${pdfFile.name}`;
        const { error } = await supabase.storage.from("post-media").upload(path, pdfFile);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
        pdfLink = urlData.publicUrl;
      }

      createPost.mutate({
        user_id: user.id,
        nome_post: nomePost,
        png_attachments: pngUrls,
        pdf_link: pdfLink ?? null,
        stato_png: pngUrls.length > 0 ? "Caricato" : "Vuoto",
        stato_pdf: pdfLink ? "Caricato" : "Vuoto",
        stato_linkedin: "Bozza",
        stato_instagram: "Bozza",
      }, {
        onSuccess: () => navigate("/"),
      });
    } catch (err: any) {
      toast.error(`Errore upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Carica nuovo post</h1>
          <p className="text-sm text-muted-foreground mt-1">Carica slide PNG e PDF per un nuovo contenuto</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nome">Nome post</Label>
          <Input id="nome" value={nomePost} onChange={(e) => setNomePost(e.target.value)} placeholder="Es. 5 Trend AI 2025" />
        </div>

        {/* PNG dropzone */}
        <div className="space-y-2">
          <Label>Slide PNG (carousel)</Label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePngDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.accept = "image/*";
              input.onchange = (e) => {
                const files = Array.from((e.target as HTMLInputElement).files ?? []);
                setPngFiles((prev) => [...prev, ...files]);
              };
              input.click();
            }}
          >
            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Trascina qui le immagini o clicca per selezionare</p>
          </div>
          {pngFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pngFiles.map((file, i) => (
                <div key={i} className="relative group">
                  <img src={URL.createObjectURL(file)} alt="" className="h-20 w-20 rounded-md object-cover border border-border" />
                  <button
                    onClick={() => removePng(i)}
                    className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDF dropzone */}
        <div className="space-y-2">
          <Label>File PDF</Label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePdfDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = ".pdf";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) setPdfFile(file);
              };
              input.click();
            }}
          >
            <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              {pdfFile ? pdfFile.name : "Trascina qui il PDF o clicca per selezionare"}
            </p>
          </div>
          {pdfFile && (
            <Button variant="ghost" size="sm" onClick={() => setPdfFile(null)} className="text-xs text-muted-foreground">
              <X className="h-3 w-3 mr-1" /> Rimuovi PDF
            </Button>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={uploading} className="w-full gap-2">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Caricamento..." : "Salva post"}
        </Button>
      </div>
    </AppLayout>
  );
}
