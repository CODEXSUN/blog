import type { FastifyInstance, FastifyRequest } from "fastify";
import { BlogError } from "./runtime/blog-error.js";
import {
  getBlogRequestContext,
  resolveBlogContext,
  withBlogContext,
  type ResolveBlogContext,
} from "./runtime/blog-host.js";
import { articleModule } from "./modules/article/index.js";
import { articleTemplateModule } from "./modules/article-template/index.js";
import { discussionModule } from "./modules/discussion/index.js";
import { engagementModule } from "./modules/engagement/index.js";
import { taxonomyModule } from "./modules/taxonomy/index.js";

export type BlogApiOptions = {
  authorize: (input: {
    context: ReturnType<typeof getBlogRequestContext>;
    permission: "blog.manage";
    request: FastifyRequest;
  }) => Promise<void> | void;
  resolveContext: ResolveBlogContext;
};

export const blogsApiModuleKeys = [
  taxonomyModule.key,
  articleTemplateModule.key,
  articleModule.key,
  discussionModule.key,
  engagementModule.key,
] as const;

export async function registerBlogsApi(
  app: FastifyInstance,
  options: BlogApiOptions,
) {
  if (!options || typeof options.resolveContext !== "function") {
    throw BlogError.validation("Blog requires a trusted host context resolver.");
  }
  if (typeof options.authorize !== "function") {
    throw BlogError.validation("Blog requires a host authorization adapter.");
  }

  await app.register(async (blogsApp) => {
    blogsApp.addHook("onRequest", (request, _reply, done) => {
      void resolveBlogContext(request, options.resolveContext).then(
        (context) => withBlogContext(context, () => done()),
        (error: unknown) => done(normalizeError(error)),
      );
    });
    blogsApp.addHook("preHandler", async (request) => {
      if (isPublicBlogRoute(request.url)) return;
      const context = getBlogRequestContext();
      if (!context.actorId) {
        throw BlogError.unauthorized("Blog authentication is required.");
      }
      await options.authorize({ context, permission: "blog.manage", request });
    });

    await taxonomyModule.register(blogsApp);
    await articleTemplateModule.register(blogsApp);
    await articleModule.register(blogsApp);
    await discussionModule.register(blogsApp);
    await engagementModule.register(blogsApp);
  });
}

function isPublicBlogRoute(url: string) {
  return url.startsWith("/public/blog") || url.startsWith("/sitemap.xml");
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}
