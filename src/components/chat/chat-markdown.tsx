import * as React from "react";
import { safeHttpUrl } from "@/lib/utils";

/**
 * Minimal, safe renderer for the assistant's replies: paragraphs, bullet / numbered
 * lists, **bold**, *italic* and [links](https://…). Built from React elements (never
 * innerHTML) and only http(s) links are kept.
 */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) {
      out.push(<strong key={key}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("[")) {
      const [, label, url] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok) ?? [];
      const href = safeHttpUrl(url);
      out.push(
        href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="underline">
            {label}
          </a>
        ) : (
          label
        )
      );
    } else if (tok.startsWith("http")) {
      const href = safeHttpUrl(tok);
      out.push(
        href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="break-all underline">
            {tok}
          </a>
        ) : (
          tok
        )
      );
    } else {
      out.push(<em key={key}>{tok.slice(1, -1)}</em>);
    }
    last = idx + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function ChatMarkdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={`l${blocks.length}`} className={list.ordered ? "my-1 list-decimal pl-5" : "my-1 list-disc pl-5"}>
        {list.items.map((it, i) => (
          <li key={i} className="my-0.5">
            {inline(it, `li${blocks.length}-${i}`)}
          </li>
        ))}
      </Tag>
    );
    list = null;
  };

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const bullet = /^\s*(?:[-*•])\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
    } else {
      flush();
      if (line.trim()) {
        blocks.push(
          <p key={`p${blocks.length}`} className="my-1">
            {inline(line, `p${blocks.length}`)}
          </p>
        );
      }
    }
  }
  flush();
  return <>{blocks}</>;
}
