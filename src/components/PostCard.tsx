import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatoBadge } from "@/components/StatoBadge";
import { Check, Loader2, Send, Image as ImageIcon } from "lucide-react";
import type { Post } from "@/types/post";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface PostCardProps {
  post: Post;
  onApprova?: (id: string) => void;
  onPubblica?: (id: string) => void;
  isPublishing?: boolean;
}

export function PostCard({ post, onApprova, onPubblica, isPublishing }: PostCardProps) {
  const thumbnail = post.png_attachments?.[0];
  const publishDate = post.pubblica_linkedin || post.pubblica_instagram;

  return (
    <Card className="group overflow-hidden border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/post/${post.id}`} className="block">
        <div className="aspect-[16/10] bg-muted flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={post.nome_post} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          )}
        </div>
      </Link>
      <CardContent className="p-3 space-y-2.5">
        <Link to={`/post/${post.id}`}>
          <h3 className="font-semibold text-sm truncate text-foreground">{post.nome_post}</h3>
        </Link>
        <div className="flex flex-wrap gap-1.5">
          <StatoBadge stato={post.stato_linkedin} platform="linkedin" />
          <StatoBadge stato={post.stato_instagram} platform="instagram" />
        </div>
        {publishDate && (
          <p className="text-xs text-muted-foreground">
            {format(new Date(publishDate), "d MMM yyyy, HH:mm", { locale: it })}
          </p>
        )}
        <div className="flex gap-1 pt-1">
          {(post.stato_linkedin === "Generato" || post.stato_instagram === "Generato") && onApprova && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => onApprova(post.id)}>
              <Check className="h-3 w-3" /> Approva
            </Button>
          )}
          {(post.stato_linkedin === "Approvato" || post.stato_instagram === "Approvato") && onPubblica && (
            <Button size="sm" className="h-7 text-xs gap-1" disabled={isPublishing} onClick={() => onPubblica(post.id)}>
              {isPublishing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              {isPublishing ? "Pubblicando..." : "Pubblica"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
