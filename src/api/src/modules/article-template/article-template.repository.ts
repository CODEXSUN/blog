import { sql } from "kysely";
import { getBlogsDatabase } from "../../runtime/blog-host.js";
import type { ArticleTemplateRecord } from "./article-template.types.js";

type Row = Record<string, unknown> & {
  id: number | string;
  uuid: string;
  name: string;
  kind: "post" | "page";
};

export class ArticleTemplateRepository {
  async list(): Promise<ArticleTemplateRecord[]> {
    const result =
      await sql<Row>`SELECT * FROM blogs_article_templates WHERE status='active' ORDER BY name ASC`.execute(
        getBlogsDatabase(),
      );
    return result.rows.map((row) => ({
      id: Number(row.id),
      uuid: row.uuid,
      name: row.name,
      kind: row.kind,
      excerpt: String(row.excerpt ?? ""),
      content: String(row.content ?? ""),
      imageAlt: String(row.image_alt ?? ""),
      seoTitle: String(row.seo_title ?? ""),
      seoDescription: String(row.seo_description ?? ""),
    }));
  }
}
