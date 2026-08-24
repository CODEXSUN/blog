import type { FastifyInstance } from "fastify";
import { registerBlogRoute } from "../../runtime/blog-http.js";
import { z } from "zod";
import { ArticleTemplateService } from "./article-template.service.js";

const record = z.object({
  id: z.number(),
  uuid: z.string().length(8),
  name: z.string(),
  kind: z.enum(["post", "page"]),
  excerpt: z.string(),
  content: z.string(),
  imageAlt: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export async function registerArticleTemplateRoutes(app: FastifyInstance) {
  registerBlogRoute(app, {
    method: "GET",
    url: "/blogs/article-templates",
    schemas: { response: z.array(record) },
    handler: () => new ArticleTemplateService().list(),
  });
}
