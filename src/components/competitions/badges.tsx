import { Globe, MapPin, Laptop, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryColor } from "@/lib/utils";
import type { CompFormat, CompRegion } from "@/lib/types";

export function CategoryBadge({ category }: { category?: string | null }) {
  if (!category) return null;
  return <Badge className={categoryColor(category)}>{category}</Badge>;
}

export function FormatBadge({ format }: { format: CompFormat }) {
  const map = {
    online: { icon: Laptop, label: "Online" },
    onsite: { icon: MapPin, label: "Onsite" },
    hybrid: { icon: Monitor, label: "Hybrid" },
  } as const;
  const { icon: Icon, label } = map[format] ?? map.online;
  return (
    <Badge className="gap-1 bg-charcoal/5 text-charcoal/70">
      <Icon className="h-3 w-3" /> {label}
    </Badge>
  );
}

export function RegionBadge({ region }: { region: CompRegion }) {
  return (
    <Badge className="gap-1 bg-electric-50 text-electric-700">
      <Globe className="h-3 w-3" /> {region}
    </Badge>
  );
}
