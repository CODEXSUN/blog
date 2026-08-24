import { sql, type Kysely } from "kysely";
import type { BlogsDatabase } from "../runtime/blog-host.js";

export const blogsLiveEditorMigration = {
  key: "blogs.live-editor",
  description:
    "Database presets, user authors, display ordering, and lifecycle state.",
} as const;

export async function migrateBlogsLiveEditor(database: Kysely<BlogsDatabase>) {
  await sql
    .raw(
      `ALTER TABLE blogs_articles
    ADD COLUMN IF NOT EXISTS author_user_uuid CHAR(8) NULL AFTER author_avatar,
    ADD COLUMN IF NOT EXISTS display_position INT NOT NULL DEFAULT 100 AFTER author_user_uuid,
    ADD INDEX IF NOT EXISTS blogs_articles_position (display_position, status, published_at)`,
    )
    .execute(database);
  await sql
    .raw(
      `CREATE TABLE IF NOT EXISTS blogs_article_templates (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(8) NOT NULL UNIQUE,
    name VARCHAR(191) NOT NULL,
    kind VARCHAR(24) NOT NULL DEFAULT 'post',
    excerpt VARCHAR(500) NOT NULL DEFAULT '',
    content LONGTEXT NOT NULL,
    image_alt VARCHAR(255) NOT NULL DEFAULT '',
    seo_title VARCHAR(191) NOT NULL DEFAULT '',
    seo_description VARCHAR(320) NOT NULL DEFAULT '',
    status VARCHAR(24) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX blogs_article_templates_status (status, name)
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    )
    .execute(database);
}
