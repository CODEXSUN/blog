import { sql, type Kysely } from "kysely";
import type { BlogsDatabase } from "./blogs-database.js";

export const blogStandardTablesMigration = {
  key: "blogs.standard-tables",
  description: "Authors, media, revisions, redirects, and settings for Blog operations."
};

export async function migrateBlogStandardTables(database: Kysely<BlogsDatabase>) {
  await sql`CREATE TABLE IF NOT EXISTS blogs_authors (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, uuid CHAR(8) NOT NULL UNIQUE, display_name VARCHAR(191) NOT NULL, email VARCHAR(320) NOT NULL, role VARCHAR(191) NOT NULL DEFAULT 'Author', avatar_url VARCHAR(1000) NOT NULL DEFAULT '', bio TEXT NOT NULL, status VARCHAR(24) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX blogs_authors_status(status)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.execute(database);
  await sql`CREATE TABLE IF NOT EXISTS blogs_media (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, uuid CHAR(8) NOT NULL UNIQUE, storage_key VARCHAR(500) NOT NULL, original_name VARCHAR(255) NOT NULL, mime_type VARCHAR(128) NOT NULL, byte_size BIGINT NOT NULL DEFAULT 0, alt_text VARCHAR(255) NOT NULL DEFAULT '', status VARCHAR(24) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX blogs_media_status(status)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.execute(database);
  await sql`CREATE TABLE IF NOT EXISTS blogs_revisions (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, article_id INT NOT NULL, revision_no INT NOT NULL, title VARCHAR(255) NOT NULL, excerpt VARCHAR(500) NOT NULL, mdx LONGTEXT NOT NULL, changed_by VARCHAR(191) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY blogs_revision_number(article_id,revision_no), CONSTRAINT blogs_revision_article_fk FOREIGN KEY(article_id) REFERENCES blogs_articles(id) ON DELETE CASCADE) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.execute(database);
  await sql`CREATE TABLE IF NOT EXISTS blogs_redirects (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, from_path VARCHAR(500) NOT NULL UNIQUE, to_path VARCHAR(500) NOT NULL, status_code SMALLINT NOT NULL DEFAULT 301, active TINYINT(1) NOT NULL DEFAULT 1, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX blogs_redirects_active(active)) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.execute(database);
  await sql`CREATE TABLE IF NOT EXISTS blogs_settings (setting_key VARCHAR(191) NOT NULL PRIMARY KEY, setting_value LONGTEXT NOT NULL, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.execute(database);
}
