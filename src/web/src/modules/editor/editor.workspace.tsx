import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  WorkspacePage,
} from "../../components/addon-ui";
import { toast } from "sonner";
import { EditorForm } from "./editor.form";
import {
  BlogFilters,
  BlogStats,
  filterArticles,
  filterTitle,
  type KindFilter,
  type StatusFilter,
} from "./editor.dashboard";
import {
  articleKey,
  useArticles,
  useArticleTemplates,
  useTaxonomy,
} from "./editor.hooks";
import { EditorList } from "./editor.list";
import {
  createArticle,
  forceDeleteArticle,
  suspendArticle,
  updateArticle,
} from "./editor.services";
import type { Article, ArticlePayload, BlogsEditorHost } from "./editor.types";
import "./editor.css";

type LifecycleAction = { kind: "suspend" | "delete"; record: Article } | null;

export function BlogsEditorWorkspace({ host }: { host: BlogsEditorHost }) {
  const client = useQueryClient();
  const articles = useArticles();
  const taxonomy = useTaxonomy();
  const templates = useArticleTemplates();
  const [editing, setEditing] = useState<Article | null | undefined>();
  const [action, setAction] = useState<LifecycleAction>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const records = articles.data ?? [];
  const taxonomyRecords = taxonomy.data ?? [];
  const filteredRecords = useMemo(
    () => filterArticles(records, { categoryId, kind, search, status }),
    [categoryId, kind, records, search, status],
  );
  const save = useMutation({
    mutationFn: (value: ArticlePayload) =>
      editing ? updateArticle(editing.id, value) : createArticle(value),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: articleKey });
      setEditing(undefined);
      toast.success("Article saved");
    },
    onError: (error) =>
      toast.error("Article could not be saved", { description: error.message }),
  });
  const lifecycle = useMutation({
    mutationFn: async (next: NonNullable<LifecycleAction>) =>
      next.kind === "suspend"
        ? suspendArticle(next.record.id)
        : forceDeleteArticle(next.record.id),
    onSuccess: async (_, next) => {
      await client.invalidateQueries({ queryKey: articleKey });
      setAction(null);
      toast.success(
        next.kind === "suspend"
          ? "Article suspended"
          : "Article permanently deleted",
      );
    },
    onError: (error) =>
      toast.error("Article could not be updated", {
        description: error.message,
      }),
  });

  if (editing !== undefined)
    return (
      <EditorForm
        host={host}
        record={editing}
        taxonomy={taxonomy.data ?? []}
        templates={templates.data ?? []}
        saving={save.isPending}
        onCancel={() => setEditing(undefined)}
        onSubmit={(value) => save.mutate(value)}
      />
    );

  return (
    <>
      <WorkspacePage
        title="Blogs"
        description="Create and publish database-backed articles and information pages."
        actions={
          <div className="blogs-actions">
            <Button variant="outline" onClick={() => void articles.refetch()}>
              <RefreshCw />
              Refresh
            </Button>
            <Button onClick={() => setEditing(null)}>
              <Plus />
              New article
            </Button>
          </div>
        }
      >
        <div className="blogs-dashboard-layout">
          <BlogFilters
            categoryId={categoryId}
            kind={kind}
            records={records}
            search={search}
            status={status}
            taxonomy={taxonomyRecords}
            onCategoryChange={setCategoryId}
            onKindChange={setKind}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />
          <section className="blogs-dashboard-feed">
            <header>
              <div>
                <span>Content</span>
                <h2>{filterTitle(status, kind)}</h2>
              </div>
              <strong>{filteredRecords.length} articles</strong>
            </header>
            <EditorList
              records={filteredRecords}
              taxonomy={taxonomyRecords}
              onEdit={setEditing}
              onAction={setAction}
            />
          </section>
          <BlogStats records={records} />
        </div>
      </WorkspacePage>
      <LifecycleDialog
        action={action}
        loading={lifecycle.isPending}
        onCancel={() => setAction(null)}
        onConfirm={() => action && lifecycle.mutate(action)}
      />
    </>
  );
}

function LifecycleDialog({
  action,
  loading,
  onCancel,
  onConfirm,
}: {
  action: LifecycleAction;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const deleting = action?.kind === "delete";
  return (
    <AlertDialog
      open={Boolean(action)}
      onOpenChange={(open) => !open && onCancel()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deleting ? "Permanently delete article?" : "Suspend article?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleting
              ? `“${action?.record.title ?? "This article"}” and its discussions and engagement will be permanently removed. This cannot be undone.`
              : `“${action?.record.title ?? "This article"}” will be removed from the public blog but retained for editing.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={
              deleting
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
            onClick={onConfirm}
          >
            {loading ? "Working…" : deleting ? "Delete permanently" : "Suspend"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
