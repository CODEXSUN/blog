import type { Kysely } from "kysely";
import {
  type BlogsDatabase,
  type BlogRequestContext,
  withBlogContext,
} from "../runtime/blog-host.js";
import {
  articleMigration,
  migrateArticleModule,
} from "../modules/article/article.migration.js";
import {
  discussionMigration,
  migrateDiscussionModule,
} from "../modules/discussion/discussion.migration.js";
import {
  engagementMigration,
  migrateEngagementModule,
} from "../modules/engagement/engagement.migration.js";
import {
  taxonomyMigration,
  migrateTaxonomyModule,
} from "../modules/taxonomy/taxonomy.migration.js";
import { seedTaxonomyModule } from "../modules/taxonomy/taxonomy.seed.js";
import { seedArticleModule } from "../modules/article/article.seed.js";
import { seedArticleTemplateModule } from "../modules/article-template/article-template.seed.js";
import {
  blogsLiveEditorMigration,
  migrateBlogsLiveEditor,
} from "./blogs-live-editor.migration.js";
import {
  blogStandardTablesMigration,
  migrateBlogStandardTables,
} from "./blog-standard-tables.migration.js";
import {
  blogsExperienceMigration,
  migrateBlogsExperience,
} from "./blogs-experience.migration.js";

export type BlogMigrationStep = {
  acceptedAppliedChecksums?: readonly string[];
  checksum: string;
  description: string;
  down?: (database: Kysely<BlogsDatabase>) => Promise<unknown>;
  name: string;
  up: (database: Kysely<BlogsDatabase>) => Promise<unknown>;
  version: number;
};

export type BlogMigrationBatch = {
  batch: number;
  description: string;
  scope: "blogs";
  steps: readonly BlogMigrationStep[];
  version: string;
};

export type BlogMigrationRunner = (
  database: Kysely<BlogsDatabase>,
  batch: BlogMigrationBatch,
) => Promise<unknown>;

export const blogsMigrationBatch: BlogMigrationBatch = {
  batch: 1,
  description: "Database-backed Blog publishing schema.",
  scope: "blogs",
  version: "1.0.9",
  steps: [
    step(taxonomyMigration, migrateTaxonomyModule),
    step(articleMigration, migrateArticleModule),
    step(discussionMigration, migrateDiscussionModule),
    step(engagementMigration, migrateEngagementModule),
    step(blogsExperienceMigration, migrateBlogsExperience, 2, [
      "187d79bf83dd2a93665fa1cdb971464eaa84b0a05ea425a5b6c3c3379e39ba16",
    ]),
    step(blogStandardTablesMigration, migrateBlogStandardTables, 3),
    step(blogsLiveEditorMigration, migrateBlogsLiveEditor, 4),
  ],
};

export async function provisionBlogsDatabase(input: {
  context: BlogRequestContext;
  runMigrationBatch: BlogMigrationRunner;
}) {
  await input.runMigrationBatch(input.context.database, blogsMigrationBatch);
  await seedBlogsDatabase(input.context);
}

export async function migrateBlogsDatabase(
  database: Kysely<BlogsDatabase>,
  runMigrationBatch: BlogMigrationRunner,
) {
  return runMigrationBatch(database, blogsMigrationBatch);
}

export async function seedBlogsDatabase(context: BlogRequestContext) {
  return withBlogContext(context, async () => {
    await seedTaxonomyModule();
    await seedArticleTemplateModule();
    await seedArticleModule();
  });
}

function step(
  migration: { description: string; key: string },
  up: (database: Kysely<BlogsDatabase>) => Promise<void>,
  version = 1,
  acceptedAppliedChecksums?: readonly string[],
): BlogMigrationStep {
  return {
    ...(acceptedAppliedChecksums ? { acceptedAppliedChecksums } : {}),
    checksum: `${migration.key}:v${version}`,
    description: migration.description,
    name: migration.key,
    up,
    version,
  };
}
