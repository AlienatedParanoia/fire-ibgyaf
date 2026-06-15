import * as React from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button, buttonVariants } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-charcoal/15 bg-muted/40 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fire-100 to-electric-100 text-fire">
        {icon ?? <Inbox className="h-7 w-7" />}
      </div>
      <h3 className="font-heading text-lg font-semibold text-charcoal">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className={buttonVariants({ className: "mt-5" })}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
