import { useEffect, useRef, useState } from "react";
import { ImagePlus, Sparkles, Upload, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  WorkspaceAutocomplete,
} from "../../components/addon-ui.js";
import { toast } from "sonner";
import { articleSchema } from "./editor.schema.js";
import type {
  Article,
  ArticlePayload,
  ArticleTemplate,
  BlogAuthorOption,
  BlogMediaFile,
  BlogsEditorHost,
  Taxonomy,
} from "./editor.types.js";

const empty: ArticlePayload = {
  kind: "post",
  title: "",
  slug: "",
  excerpt: "",
  mdx: "",
  featuredImage: "",
  imageAlt: "",
  authorName: "",
  authorRole: "",
  authorAvatar: "",
  authorUserUuid: null,
  displayPosition: 100,
  categoryId: null,
  tagIds: [],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  status: "draft",
};

export function EditorForm({
  record,
  taxonomy,
  templates,
  host,
  saving,
  saveError,
  onCancel,
  onSubmit,
}: {
  record: Article | null;
  taxonomy: Taxonomy[];
  templates: ArticleTemplate[];
  host: BlogsEditorHost;
  saving: boolean;
  saveError: string | undefined;
  onCancel: () => void;
  onSubmit: (value: ArticlePayload) => void;
}) {
  const [value, setValue] = useState<ArticlePayload>(() =>
    record ? toPayload(record) : { ...empty },
  );
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ArticlePayload, string>>
  >({});
  const [authors, setAuthors] = useState<BlogAuthorOption[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [selectedTemplateUuid, setSelectedTemplateUuid] = useState("");
  const [mediaTarget, setMediaTarget] = useState<
    "featuredImage" | "authorAvatar" | null
  >(null);
  const [media, setMedia] = useState<BlogMediaFile[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const field = <K extends keyof ArticlePayload>(
    key: K,
    next: ArticlePayload[K],
  ) => setValue((current) => ({ ...current, [key]: next }));

  useEffect(() => {
    let active = true;
    host
      .listAuthors("")
      .then(
        (items) =>
          active &&
          setAuthors(items.filter((item) => item.status === "active")),
      )
      .catch((next) =>
        toast.error("Authors could not be loaded", {
          description: errorMessage(next),
        }),
      )
      .finally(() => active && setAuthorsLoading(false));
    return () => {
      active = false;
    };
  }, [host]);

  useEffect(() => {
    if (saveError) setError(saveError);
  }, [saveError]);

  useEffect(() => {
    if (mediaTarget !== null) return;
    const closeEditorOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", closeEditorOnEscape);
    return () => document.removeEventListener("keydown", closeEditorOnEscape);
  }, [mediaTarget, onCancel]);

  async function openMedia(target: "featuredImage" | "authorAvatar") {
    setMediaTarget(target);
    setMediaLoading(true);
    try {
      setMedia(
        (await host.listImages()).filter((item) =>
          item.mimeType.startsWith("image/"),
        ),
      );
    } catch (next) {
      toast.error("Images could not be loaded", {
        description: errorMessage(next),
      });
    } finally {
      setMediaLoading(false);
    }
  }

  async function upload(file: File) {
    if (!file.type.startsWith("image/"))
      return toast.error("Select an image file.");
    try {
      const uploaded = await host.uploadImage(file);
      field(mediaTarget ?? "featuredImage", uploaded.url);
      setMediaTarget(null);
      toast.success("Image uploaded and selected");
    } catch (next) {
      toast.error("Image could not be uploaded", {
        description: errorMessage(next),
      });
    }
  }

  function magicFill() {
    const template =
      templates.find((item) => item.uuid === selectedTemplateUuid) ??
      templates.find((item) => item.kind === value.kind);
    if (!template)
      return toast.error("No active article template is available.");
    const title = value.title.trim() || "Untitled article";
    const render = (text: string) => text.replaceAll("{{title}}", title);
    const author = authors[0];
    const next = { ...value };
    let count = 0;
    const fill = <K extends keyof ArticlePayload>(
      key: K,
      replacement: ArticlePayload[K],
    ) => {
      const present = Array.isArray(next[key])
        ? (next[key] as unknown[]).length > 0
        : next[key] !== null && String(next[key]).trim() !== "";
      if (!present) {
        next[key] = replacement;
        count += 1;
      }
    };
    fill("slug", slugify(title));
    fill("excerpt", render(template.excerpt));
    fill("mdx", render(template.content));
    fill("imageAlt", render(template.imageAlt));
    fill("seoTitle", render(template.seoTitle));
    fill("seoDescription", render(template.seoDescription));
    fill("authorName", author?.name ?? "Editorial Team");
    fill("authorRole", "Author");
    fill("authorUserUuid", author?.uuid ?? null);
    fill(
      "categoryId",
      taxonomy.find((item) => item.kind === "category")?.id ?? null,
    );
    fill(
      "tagIds",
      taxonomy
        .filter((item) => item.kind === "tag")
        .slice(0, 2)
        .map((item) => item.id),
    );
    setValue(next);
    toast.success(
      count
        ? `${count} missing fields filled`
        : "All supported fields already have values",
    );
  }

  return (
    <section className="blogs-editor-form">
      <header>
        <div>
          <span className="blogs-kicker">Database article</span>
          <h1>{record ? "Edit article" : "New article"}</h1>
        </div>
        <div className="blogs-actions">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            disabled={saving}
            onClick={() => {
              const parsed = articleSchema.safeParse(value);
              if (!parsed.success) {
                const nextErrors = validationErrors(parsed.error.issues);
                setFieldErrors(nextErrors);
                const first = parsed.error.issues[0];
                setError(
                  first ? issueMessage(first) : "Check the article fields.",
                );
                return;
              }
              setError("");
              setFieldErrors({});
              onSubmit(parsed.data);
            }}
          >
            {saving ? "Saving…" : "Save article"}
          </Button>
        </div>
      </header>
      {error ? <p className="blogs-error">{error}</p> : null}
      <div className="blogs-editor-tools">
        <label>
          Content template
          <select
            value={selectedTemplateUuid}
            onChange={(event) => setSelectedTemplateUuid(event.target.value)}
          >
            <option value="">Automatic for article type</option>
            {templates.map((item) => (
              <option key={item.uuid} value={item.uuid}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <Button variant="outline" onClick={magicFill}>
          <Sparkles />
          Magic fill missing fields
        </Button>
      </div>
      <div className="blogs-editor-meta">
        <span>
          {record ? `Created ${formatDate(record.createdAt)}` : "Unsaved draft"}
        </span>
        <span>
          {record
            ? `Updated ${formatDate(record.updatedAt)}`
            : "Saved directly to the database"}
        </span>
        <span>{wordCount(value.mdx)} words</span>
      </div>
      <div className="blogs-editor-grid">
        <div className="blogs-fields">
          <label>
            Title
            <input
              value={value.title}
              onChange={(event) => field("title", event.target.value)}
            />
            <FieldError message={fieldErrors.title} />
          </label>
          <div className="blogs-row">
            <label>
              Type
              <select
                value={value.kind}
                onChange={(event) =>
                  field("kind", event.target.value as ArticlePayload["kind"])
                }
              >
                <option value="post">Post</option>
                <option value="page">Page</option>
              </select>
            </label>
            <label>
              Status
              <select
                value={value.status}
                onChange={(event) =>
                  field(
                    "status",
                    event.target.value as ArticlePayload["status"],
                  )
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="suspended">Suspended</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
          <div className="blogs-row">
            <label>
              Slug
              <input
                value={value.slug}
                onChange={(event) => field("slug", event.target.value)}
              />
              <FieldError message={fieldErrors.slug} />
            </label>
            <label>
              Display position
              <input
                type="number"
                min={0}
                max={100000}
                value={value.displayPosition}
                onChange={(event) =>
                  field("displayPosition", Number(event.target.value))
                }
              />
            </label>
          </div>
          <label>
            Excerpt
            <textarea
              rows={3}
              value={value.excerpt}
              onChange={(event) => field("excerpt", event.target.value)}
            />
            <FieldError message={fieldErrors.excerpt} />
          </label>
          <label>
            Category
            <select
              value={value.categoryId ?? ""}
              onChange={(event) =>
                field(
                  "categoryId",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <option value="">Uncategorised</option>
              {taxonomy
                .filter((item) => item.kind === "category")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <fieldset className="blogs-tags">
            <legend>Tags</legend>
            <div>
              {taxonomy
                .filter((item) => item.kind === "tag")
                .map((tag) => (
                  <label
                    key={tag.id}
                    data-selected={value.tagIds.includes(tag.id)}
                  >
                    <input
                      type="checkbox"
                      checked={value.tagIds.includes(tag.id)}
                      onChange={() =>
                        field(
                          "tagIds",
                          value.tagIds.includes(tag.id)
                            ? value.tagIds.filter((id) => id !== tag.id)
                            : [...value.tagIds, tag.id],
                        )
                      }
                    />
                    {tag.name}
                  </label>
                ))}
            </div>
          </fieldset>
          <div className="blogs-form-section">
            <h2>Author</h2>
            <label>
              Tenant user
              <WorkspaceAutocomplete
                loading={authorsLoading}
                value={value.authorUserUuid ?? ""}
                placeholder="Search active users"
                options={authors.map((item) => ({
                  value: item.uuid,
                  label: `${item.name} · ${item.email}`,
                }))}
                onChange={(uuid) => {
                  const author = authors.find((item) => item.uuid === uuid);
                  field("authorUserUuid", uuid);
                  if (author) field("authorName", author.name);
                }}
              />
              <FieldError message={fieldErrors.authorUserUuid} />
            </label>
            <label>
              Display name
              <input
                value={value.authorName}
                onChange={(event) => field("authorName", event.target.value)}
              />
            </label>
            <label>
              Role
              <input
                value={value.authorRole}
                onChange={(event) => field("authorRole", event.target.value)}
              />
            </label>
            <MediaInput
              label="Author image"
              value={value.authorAvatar}
              onChange={(next) => field("authorAvatar", next)}
              onBrowse={() => void openMedia("authorAvatar")}
              onUpload={() => {
                setMediaTarget("authorAvatar");
                fileInput.current?.click();
              }}
            />
          </div>
          <MediaInput
            label="Featured image"
            value={value.featuredImage}
            onChange={(next) => field("featuredImage", next)}
            onBrowse={() => void openMedia("featuredImage")}
            onUpload={() => {
              setMediaTarget("featuredImage");
              fileInput.current?.click();
            }}
          />
          <input
            ref={fileInput}
            className="blogs-hidden-file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />
          <label>
            Image alt text
            <input
              value={value.imageAlt}
              onChange={(event) => field("imageAlt", event.target.value)}
            />
          </label>
          <label>
            SEO title
            <input
              value={value.seoTitle}
              onChange={(event) => field("seoTitle", event.target.value)}
            />
          </label>
          <label>
            SEO description
            <textarea
              rows={3}
              value={value.seoDescription}
              onChange={(event) => field("seoDescription", event.target.value)}
            />
          </label>
          <label>
            Canonical URL
            <input
              value={value.canonicalUrl}
              onChange={(event) => field("canonicalUrl", event.target.value)}
            />
          </label>
        </div>
        <label className="blogs-mdx">
          Content
          <textarea
            spellCheck
            rows={28}
            value={value.mdx}
            onChange={(event) => field("mdx", event.target.value)}
          />
          <FieldError message={fieldErrors.mdx} />
          <small>
            Use headings, paragraphs, lists, and links. Executable markup is
            rejected.
          </small>
        </label>
      </div>
      <MediaDialog
        open={mediaTarget !== null}
        loading={mediaLoading}
        files={media}
        onClose={() => setMediaTarget(null)}
        onUpload={() => fileInput.current?.click()}
        onSelect={(file) => {
          field(mediaTarget ?? "featuredImage", file.url);
          setMediaTarget(null);
        }}
      />
    </section>
  );
}

function MediaInput({
  label,
  value,
  onChange,
  onBrowse,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBrowse: () => void;
  onUpload: () => void;
}) {
  return (
    <label>
      {label}
      <div className="blogs-media-input">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Choose a stored image or upload one"
        />
        <Button type="button" variant="outline" onClick={onBrowse}>
          <ImagePlus />
          Browse
        </Button>
        <Button type="button" variant="outline" onClick={onUpload}>
          <Upload />
          Upload
        </Button>
      </div>
    </label>
  );
}

function MediaDialog({
  open,
  loading,
  files,
  onClose,
  onSelect,
  onUpload,
}: {
  open: boolean;
  loading: boolean;
  files: BlogMediaFile[];
  onClose: () => void;
  onSelect: (file: BlogMediaFile) => void;
  onUpload: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="blogs-media-dialog">
        <div className="blogs-media-dialog-heading">
          <DialogHeader>
            <DialogTitle>Browse images</DialogTitle>
            <DialogDescription>
              Select an image managed by File Manager or upload a new image.
            </DialogDescription>
          </DialogHeader>
          <DialogClose
            aria-label="Close image browser"
            className="blogs-media-dialog-close"
            title="Close image browser"
          >
            <X aria-hidden="true" />
          </DialogClose>
        </div>
        {loading ? (
          <p>Loading images…</p>
        ) : files.length ? (
          <div className="blogs-media-grid">
            {files.map((file) => (
              <button key={file.uuid} onClick={() => onSelect(file)}>
                <img src={file.url} alt={file.name} />
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="blogs-media-empty">
            <ImagePlus aria-hidden="true" />
            <strong>No managed images yet</strong>
            <p>Upload an image now, or add one from the File Manager desk.</p>
          </div>
        )}
        <footer className="blogs-media-dialog-actions">
          <span>Press Esc to close</span>
          <div>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={onUpload}>
              <Upload aria-hidden="true" />
              Upload image
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

function toPayload(record: Article): ArticlePayload {
  const {
    id: _id,
    uuid: _uuid,
    commentCount: _commentCount,
    viewCount: _viewCount,
    favoriteCount: _favoriteCount,
    publishedAt: _publishedAt,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...payload
  } = record;
  return payload;
}
function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}
function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
function errorMessage(value: unknown) {
  return value instanceof Error ? value.message : "Request failed.";
}

function FieldError({ message }: { message: string | undefined }) {
  return message ? (
    <small className="blogs-field-error">{message}</small>
  ) : null;
}

function validationErrors(issues: { message: string; path: PropertyKey[] }[]) {
  return Object.fromEntries(
    issues
      .filter((issue) => typeof issue.path[0] === "string")
      .map((issue) => [issue.path[0], issue.message]),
  ) as Partial<Record<keyof ArticlePayload, string>>;
}

function issueMessage(issue: { message: string; path: PropertyKey[] }) {
  const key = String(issue.path[0] ?? "article");
  const label: Partial<Record<keyof ArticlePayload, string>> = {
    authorName: "Author display name",
    authorUserUuid: "Author tenant user",
    mdx: "Content",
    slug: "Slug",
    title: "Title",
  };
  return `${label[key as keyof ArticlePayload] ?? key}: ${issue.message}`;
}
