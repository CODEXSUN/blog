import type { FastifyInstance } from "fastify";
import { registerBlogRoute } from "../../runtime/blog-http.js";
import { z } from "zod";
import { EngagementService } from "./engagement.service.js";
const service = new EngagementService(),
  summary = z.object({
    articleId: z.number(),
    likes: z.number(),
    stars: z.number(),
    shares: z.number(),
    views: z.number(),
    favorites: z.number(),
    averageStar: z.number()
  });
export async function registerEngagementRoutes(app: FastifyInstance) {
  registerBlogRoute(app, {
    method: "GET",
    url: "/public/blog/favorites",
    schemas: {
      querystring: z.object({ actorKey: z.string().min(1).max(191) }),
      response: z.array(z.number()),
    },
    handler: ({ query }) => service.favorites(query.actorKey),
  });
  registerBlogRoute(app, {
    method: "GET",
    url: "/public/blog/:articleId/engagement",
    schemas: {
      params: z.object({ articleId: z.coerce.number().int().positive() }),
      response: summary
    },
    handler: ({ params }) => service.summary(params.articleId)
  });
  registerBlogRoute(app, {
    method: "POST",
    url: "/public/blog/engagement",
    schemas: {
      body: z.object({
        articleId: z.number().int().positive(),
        kind: z.enum(["like", "star", "share", "view", "favorite"]),
        actorKey: z.string().min(1).max(191),
        rating: z.number().int().min(1).max(5).nullable().default(null),
        channel: z.string().max(80).default("")
      }),
      response: summary
    },
    handler: ({ body }) => service.upsert(body)
  });
  registerBlogRoute(app, {
    method: "POST",
    url: "/public/blog/favorite",
    schemas: {
      body: z.object({
        articleId: z.number().int().positive(),
        actorKey: z.string().min(1).max(191),
        active: z.boolean(),
      }),
      response: summary,
    },
    handler: ({ body }) => service.setFavorite(body),
  });
}
