import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { usePosts } from "@/hooks/usePosts";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { it } from "date-fns/locale";
import { useState } from "react";
import type { Post } from "@/types/post";

export default function CalendarioPage() {
  const { postsQuery } = usePosts();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const getPostsForDay = (day: Date): { post: Post; platform: "linkedin" | "instagram" }[] => {
    if (!postsQuery.data) return [];
    const results: { post: Post; platform: "linkedin" | "instagram" }[] = [];
    for (const post of postsQuery.data) {
      if (post.pubblica_linkedin && isSameDay(new Date(post.pubblica_linkedin), day)) {
        results.push({ post, platform: "linkedin" });
      }
      if (post.pubblica_instagram && isSameDay(new Date(post.pubblica_instagram), day)) {
        results.push({ post, platform: "instagram" });
      }
    }
    return results;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Calendario</h1>
            <p className="text-sm text-muted-foreground mt-1">Vista settimanale dei post programmati</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[160px] text-center">
              {format(weekStart, "d MMM", { locale: it })} – {format(addDays(weekStart, 6), "d MMM yyyy", { locale: it })}
            </span>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {postsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayPosts = getPostsForDay(day);
              return (
                <div key={day.toISOString()} className="space-y-2">
                  <div className={`text-center text-xs font-medium py-2 rounded-md ${isToday ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    <div>{format(day, "EEE", { locale: it })}</div>
                    <div className="text-lg font-bold">{format(day, "d")}</div>
                  </div>
                  <div className="space-y-1.5 min-h-[80px]">
                    {dayPosts.map(({ post, platform }, i) => (
                      <Link
                        key={`${post.id}-${platform}-${i}`}
                        to={`/post/${post.id}`}
                        className={`block rounded-md p-2 text-xs transition-colors ${
                          platform === "linkedin"
                            ? "bg-linkedin/10 text-linkedin hover:bg-linkedin/20 border border-linkedin/20"
                            : "bg-instagram/10 text-instagram hover:bg-instagram/20 border border-instagram/20"
                        }`}
                      >
                        <p className="font-medium truncate">{post.nome_post}</p>
                        <p className="opacity-70 capitalize">{platform}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
