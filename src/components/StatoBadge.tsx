import { Badge } from "@/components/ui/badge";
import type { StatoSocial } from "@/types/post";

const colorMap: Record<StatoSocial, string> = {
  "In corso": "bg-stato-in-corso/15 text-stato-in-corso border-stato-in-corso/30",
  "Bozza": "bg-stato-bozza/15 text-stato-bozza border-stato-bozza/30",
  "Generato": "bg-stato-generato/15 text-stato-generato border-stato-generato/30",
  "Approvato": "bg-stato-approvato/15 text-stato-approvato border-stato-approvato/30",
  "Pubblicato": "bg-stato-pubblicato/15 text-stato-pubblicato border-stato-pubblicato/30",
};

export function StatoBadge({ stato, platform }: { stato: StatoSocial; platform?: "linkedin" | "instagram" }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${colorMap[stato]} border`}>
      {platform && (
        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${platform === "linkedin" ? "bg-linkedin" : "bg-instagram"}`} />
      )}
      {stato}
    </Badge>
  );
}
