import type { ReactNode } from "react";
import {
  Bookmark,
  CirclePause,
  Eye,
  FileText,
  Globe2,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/addon-ui";
import type { Article, Taxonomy } from "./editor.types";

export function EditorList({
  records,
  taxonomy,
  onEdit,
  onAction,
}: {
  records: Article[];
  taxonomy: Taxonomy[];
  onEdit: (value: Article) => void;
  onAction: (value: { kind: "suspend" | "delete"; record: Article }) => void;
}) {
  if (!records.length) return <EmptyState />;

  const categoryById = new Map(
    taxonomy
      .filter((item) => item.kind === "category")
      .map((item) => [item.id, item.name]),
  );

  return (
    <div className="blogs-list">
      {records.map((item) => (
        <article key={item.id}>
          <ArticleThumbnail article={item} />
          <div className="blogs-list-copy">
            <strong>{item.title}</strong>
            <p>{item.excerpt || "No article summary has been added yet."}</p>
            <span>
              {item.authorName || "Editorial team"} ·{" "}
              {relativeTime(item.updatedAt)}
            </span>
          </div>
          <div className="blogs-list-taxonomy">
            <span className="blogs-category-badge">
              {item.categoryId
                ? categoryById.get(item.categoryId) || "Uncategorised"
                : "Uncategorised"}
            </span>
            <span className={`blogs-status blogs-status-${item.status}`}>
              {item.status}
            </span>
          </div>
          <div className="blogs-list-metrics" aria-label="Article engagement">
            <Metric
              icon={<MessageCircle />}
              label="comments"
              value={item.commentCount}
            />
            <Metric icon={<Eye />} label="views" value={item.viewCount} />
            <Metric
              icon={<Bookmark />}
              label="favourites"
              value={item.favoriteCount}
            />
          </div>
          <div className="blogs-list-actions">
            <Button variant="ghost" onClick={() => onEdit(item)}>
              <Pencil />
              Edit
            </Button>
            {item.status !== "suspended" ? (
              <Button
                variant="ghost"
                title="Suspend"
                onClick={() => onAction({ kind: "suspend", record: item })}
              >
                <CirclePause />
              </Button>
            ) : null}
            <Button
              variant="ghost"
              title="Delete permanently"
              onClick={() => onAction({ kind: "delete", record: item })}
            >
              <Trash2 />
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ArticleThumbnail({ article }: { article: Article }) {
  const canRenderImage = /^(https?:\/\/|\/api\/|\/storage\/)/.test(
    article.featuredImage,
  );
  return (
    <div className="blogs-list-thumbnail">
      {canRenderImage ? (
        <img src={article.featuredImage} alt={article.imageAlt || ""} />
      ) : article.kind === "page" ? (
        <Globe2 aria-hidden="true" />
      ) : (
        <FileText aria-hidden="true" />
      )}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <span title={`${value} ${label}`}>
      {icon}
      {value.toLocaleString("en-IN")}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="blogs-empty">
      <FileText />
      <h2>No matching articles</h2>
      <p>Change the filters or create a database-backed article.</p>
    </div>
  );
}

function relativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  const units = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ] as const;
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, milliseconds] of units) {
    if (elapsed >= milliseconds) {
      return formatter.format(-Math.floor(elapsed / milliseconds), unit);
    }
  }
  return "just now";
}
