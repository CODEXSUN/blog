import { sql } from "kysely";
import { getBlogsDatabase } from "../../runtime/blog-host.js";

const templates = [
  {
    uuid: "btpl0001",
    name: "Practical guide",
    kind: "post",
    excerpt:
      "A practical guide to {{title}} with clear steps, controls, and measurable outcomes.",
    content:
      "# {{title}}\n\nStart with the business outcome and the people responsible for it.\n\n## Define the current position\n\nDescribe the process, evidence, constraints, and risks.\n\n## Make the change practical\n\nList the smallest useful actions, owners, and review dates.\n\n## Measure the result\n\nTrack a small set of operating measures and refine the process from evidence.",
    imageAlt: "Editorial image for {{title}}",
    seoTitle: "{{title}} | CODEXSUN",
    seoDescription:
      "Learn how to improve {{title}} with practical controls and measurable steps.",
  },
  {
    uuid: "btpl0002",
    name: "Business announcement",
    kind: "post",
    excerpt:
      "What is changing, why it matters, and what customers and teams need to do next.",
    content:
      "# {{title}}\n\nSummarise the change and the date it takes effect.\n\n## What is changing\n\nExplain the scope in plain language.\n\n## Why it matters\n\nConnect the change to customer or operating outcomes.\n\n## What happens next\n\nList the actions, owners, support route, and important dates.",
    imageAlt: "Announcement image for {{title}}",
    seoTitle: "{{title}}",
    seoDescription: "Read the latest CODEXSUN announcement about {{title}}.",
  },
  {
    uuid: "btpl0003",
    name: "Evergreen information page",
    kind: "page",
    excerpt:
      "Essential information about {{title}}, kept current for customers and teams.",
    content:
      "# {{title}}\n\nExplain the purpose of this page and who it helps.\n\n## Overview\n\nProvide the essential facts and scope.\n\n## How it works\n\nDescribe the process and expected result.\n\n## Support\n\nExplain where readers can get help or more information.",
    imageAlt: "Page image for {{title}}",
    seoTitle: "{{title}} | CODEXSUN",
    seoDescription: "Current information and guidance about {{title}}.",
  },
] as const;

export async function seedArticleTemplateModule() {
  for (const item of templates) {
    await sql`INSERT INTO blogs_article_templates(uuid,name,kind,excerpt,content,image_alt,seo_title,seo_description,status)
      VALUES(${item.uuid},${item.name},${item.kind},${item.excerpt},${item.content},${item.imageAlt},${item.seoTitle},${item.seoDescription},'active')
      ON DUPLICATE KEY UPDATE name=VALUES(name),kind=VALUES(kind),excerpt=VALUES(excerpt),content=VALUES(content),image_alt=VALUES(image_alt),seo_title=VALUES(seo_title),seo_description=VALUES(seo_description),status='active'`.execute(
      getBlogsDatabase(),
    );
  }
}
