import { BlogError } from "../../runtime/blog-error.js";
import { ArticleRepository } from "./article.repository.js";
import type { ArticleSaveInput } from "./article.types.js";
export class ArticleService {
  constructor(private readonly repository = new ArticleRepository()) {}
  list(input?: {
    publicOnly?: boolean;
    search?: string;
    kind?: "post" | "page";
  }) {
    return this.repository.list(input);
  }
  findBySlug(slug: string, publicOnly = false) {
    return this.repository.findBySlug(slug, publicOnly);
  }
  async save(input: ArticleSaveInput, id?: number) {
    const value = {
      ...input,
      title: input.title.trim(),
      slug: slugify(input.slug || input.title),
      excerpt: input.excerpt.trim(),
      seoTitle: (input.seoTitle || input.title).trim(),
      seoDescription: (input.seoDescription || input.excerpt).trim(),
      authorUserUuid: input.authorUserUuid?.trim() || null,
      displayPosition: Math.max(0, Math.trunc(input.displayPosition)),
      tagIds: [...new Set(input.tagIds)],
    };
    if (!value.title || !value.slug)
      throw BlogError.validation("Title and slug are required.");
    validateContent(value.mdx);
    if (await this.repository.duplicate(value.slug, id))
      throw BlogError.conflict("This article slug already exists.");
    if (!(await this.repository.taxonomyValid(value.categoryId, value.tagIds)))
      throw BlogError.validation(
        "A selected category or tag is inactive or missing.",
      );
    return id
      ? this.repository.update(id, value)
      : this.repository.create(value);
  }
  async suspend(id: number) {
    return required(await this.repository.setStatus(id, "suspended"));
  }
  async forceDelete(id: number) {
    return required(await this.repository.forceDelete(id));
  }
}
function slugify(v: string) {
  return v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}
function validateContent(value: string) {
  if (!value.trim()) throw BlogError.validation("Article content is required.");
  if (/<(script|iframe)\b/iu.test(value) || /javascript:/iu.test(value))
    throw BlogError.validation(
      "Unsafe executable markup is not allowed in article content.",
    );
}
function required<T>(value: T | null): T {
  if (!value) throw BlogError.notFound("Article was not found.");
  return value;
}
