import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Loader2, Webhook, User, Key, Database, AlertTriangle, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getSupabaseConfig, setSupabaseConfig } from "@/lib/config";
import { reinitializeSupabaseClient } from "@/integrations/supabase/client";

export default function ImpostazioniPage() {
  const { settingsQuery, upsertSettings } = useSettings();
  const settings = settingsQuery.data;

  // Impostazioni app (salvate nel DB)
  const [webhookGenera, setWebhookGenera] = useState("");
  const [webhookLinkedin, setWebhookLinkedin] = useState("");
  const [webhookInstagram, setWebhookInstagram] = useState("");
  const [linkedinPageId, setLinkedinPageId] = useState("");
  const [instagramAccountId, setInstagramAccountId] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [promptSistema, setPromptSistema] = useState("");

  useEffect(() => {
    if (settings) {
      setWebhookGenera(settings.webhook_genera_caption ?? "");
      setWebhookLinkedin(settings.webhook_pubblica_linkedin ?? "");
      setWebhookInstagram(settings.webhook_pubblica_instagram ?? "");
      setLinkedinPageId(settings.linkedin_page_id ?? "");
      setInstagramAccountId(settings.instagram_account_id ?? "");
      setAnthropicKey(settings.anthropic_api_key ?? "");
      setPromptSistema(settings.prompt_sistema ?? "");
    }
  }, [settings]);

  const handleSave = () => {
    upsertSettings.mutate({
      webhook_genera_caption: webhookGenera,
      webhook_pubblica_linkedin: webhookLinkedin,
      webhook_pubblica_instagram: webhookInstagram,
      linkedin_page_id: linkedinPageId,
      instagram_account_id: instagramAccountId,
      anthropic_api_key: anthropicKey,
      prompt_sistema: promptSistema,
    });
  };

  // Connessione Supabase (salvata in localStorage — bootstrap config)
  const initialConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(initialConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(initialConfig.anonKey);
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  const handleSaveSupabase = () => {
    const url = supabaseUrl.trim();
    const key = supabaseAnonKey.trim();

    if (!url || !key) {
      toast.error("URL e chiave Supabase sono obbligatori");
      return;
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") {
        toast.error("L'URL Supabase deve usare HTTPS");
        return;
      }
    } catch {
      toast.error("URL Supabase non valido");
      return;
    }

    setSupabaseConfig(url, key);
    reinitializeSupabaseClient();
    setSupabaseSaved(true);
    toast.success("Configurazione salvata — ricarica la pagina per applicare");
  };

  if (settingsQuery.isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Impostazioni</h1>
          <p className="text-sm text-muted-foreground mt-1">Configura webhook e integrazioni</p>
        </div>

        {/* INFRA — Connessione Supabase (localStorage, non DB) */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-600" />
              Connessione Database (Supabase)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase-anon-key">Anon / Publishable Key</Label>
              <Input
                id="supabase-anon-key"
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJ..."
                autoComplete="off"
              />
            </div>

            {supabaseSaved && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="flex items-center gap-3">
                  <span>Configurazione salvata. <strong>Ricarica la pagina</strong> per applicare la nuova connessione.</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-amber-500/50"
                    onClick={() => window.location.reload()}
                  >
                    Ricarica ora
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSaveSupabase}
              variant="outline"
              className="w-full gap-2 border-amber-500/50 hover:bg-amber-500/10"
            >
              <Save className="h-4 w-4" />
              Salva connessione
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="h-4 w-4 text-primary" /> Webhook n8n
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>WF1 — Genera Caption</Label>
              <Input value={webhookGenera} onChange={(e) => setWebhookGenera(e.target.value)} placeholder="https://n8n.example.com/webhook/genera-caption" />
            </div>
            <div className="space-y-2">
              <Label>WF2 — Pubblica LinkedIn</Label>
              <Input value={webhookLinkedin} onChange={(e) => setWebhookLinkedin(e.target.value)} placeholder="https://n8n.example.com/webhook/pubblica-linkedin" />
            </div>
            <div className="space-y-2">
              <Label>WF3 — Pubblica Instagram</Label>
              <Input value={webhookInstagram} onChange={(e) => setWebhookInstagram(e.target.value)} placeholder="https://n8n.example.com/webhook/pubblica-instagram" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Account Social
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>LinkedIn Page ID</Label>
              <Input value={linkedinPageId} onChange={(e) => setLinkedinPageId(e.target.value)} placeholder="123456789" />
            </div>
            <div className="space-y-2">
              <Label>Instagram Business Account ID</Label>
              <Input value={instagramAccountId} onChange={(e) => setInstagramAccountId(e.target.value)} placeholder="987654321" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" /> Prompt AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="prompt-sistema">Contesto aziendale / Istruzioni copywriter</Label>
              <Textarea
                id="prompt-sistema"
                value={promptSistema}
                onChange={(e) => setPromptSistema(e.target.value)}
                placeholder={"Sei un esperto copywriter per [Nome Azienda].\nL'azienda si occupa di...\nTono di voce: professionale ma diretto.\nEvita: ..."}
                className="min-h-[140px] resize-y font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Questo testo viene inviato come contesto a ogni richiesta di generazione caption.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" /> API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Anthropic API Key</Label>
              <Input type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="sk-ant-..." />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={upsertSettings.isPending} className="w-full gap-2">
          {upsertSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salva impostazioni
        </Button>
      </div>
    </AppLayout>
  );
}
