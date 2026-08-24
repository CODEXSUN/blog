import { randomBytes } from "node:crypto";
import { sql } from "kysely";
import { getBlogsDatabase } from "../../runtime/blog-host.js";
import type { EngagementInput, EngagementSummary, FavoriteInput } from "./engagement.types.js";
export class EngagementRepository {
  async articlePublished(id: number) {
    const r =
      await sql`SELECT id FROM blogs_articles WHERE id=${id} AND status='published' LIMIT 1`.execute(
        getBlogsDatabase()
      );
    return Boolean(r.rows[0]);
  }
  async upsert(i: EngagementInput) {
    await sql`INSERT INTO blogs_engagement(uuid,article_id,kind,actor_key,rating,channel)VALUES(${randomBytes(4).toString("hex")},${i.articleId},${i.kind},${i.actorKey},${i.rating},${i.channel}) ON DUPLICATE KEY UPDATE rating=VALUES(rating),channel=VALUES(channel)`.execute(
      getBlogsDatabase()
    );
    return this.summary(i.articleId);
  }
  async setFavorite(input: FavoriteInput) {
    if (input.active) {
      await this.upsert({
        articleId: input.articleId,
        kind: "favorite",
        actorKey: input.actorKey,
        rating: null,
        channel: "favorite",
      });
    } else {
      await sql`DELETE FROM blogs_engagement WHERE article_id=${input.articleId} AND kind='favorite' AND actor_key=${input.actorKey}`.execute(
        getBlogsDatabase(),
      );
    }
    return this.summary(input.articleId);
  }
  async favorites(actorKey: string) {
    const result = await sql<{ article_id: number | string }>`SELECT article_id FROM blogs_engagement WHERE kind='favorite' AND actor_key=${actorKey}`.execute(
      getBlogsDatabase(),
    );
    return result.rows.map((row) => Number(row.article_id));
  }
  async summary(articleId: number) {
    const r = await sql<
      Record<string, unknown>
    >`SELECT SUM(kind='like') likes,SUM(kind='star') stars,SUM(kind='share') shares,SUM(kind='view') views,SUM(kind='favorite') favorites,COALESCE(AVG(CASE WHEN kind='star' THEN rating END),0) average_star FROM blogs_engagement WHERE article_id=${articleId}`.execute(
      getBlogsDatabase()
    );
    const v = r.rows[0] ?? {};
    return {
      articleId,
      likes: Number(v.likes ?? 0),
      stars: Number(v.stars ?? 0),
      shares: Number(v.shares ?? 0),
      views: Number(v.views ?? 0),
      favorites: Number(v.favorites ?? 0),
      averageStar: Number(v.average_star ?? 0)
    } satisfies EngagementSummary;
  }
}
