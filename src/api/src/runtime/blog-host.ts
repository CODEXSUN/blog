import { AsyncLocalStorage } from "node:async_hooks";
import type { FastifyRequest } from "fastify";
import type { Kysely } from "kysely";
import { z } from "zod";
import { BlogError } from "./blog-error.js";

export type BlogsDatabase = Record<string, unknown>;

export type BlogRequestContext = {
  actorId: string | null;
  database: Kysely<BlogsDatabase>;
  host: string;
  origin: string;
  scopeId: string;
};

export type ResolveBlogContext = (
  request: FastifyRequest,
) => BlogRequestContext | Promise<BlogRequestContext>;

const contextSchema = z.object({
  actorId: z.string().trim().min(1).nullable(),
  host: z.string().trim().regex(/^[a-z][a-z0-9-]{1,31}$/u),
  origin: z.string().url().transform((value) => value.replace(/\/$/u, "")),
  scopeId: z.string().trim().min(1).max(191),
});
const requestContext = new AsyncLocalStorage<BlogRequestContext>();

export async function resolveBlogContext(
  request: FastifyRequest,
  resolveContext: ResolveBlogContext,
) {
  const resolved = await resolveContext(request);
  const safe = contextSchema.parse(resolved);
  if (!resolved.database || typeof resolved.database.selectFrom !== "function") {
    throw BlogError.validation("Blog requires a host-provided database.");
  }
  return { ...safe, database: resolved.database };
}

export function getBlogRequestContext() {
  const context = requestContext.getStore();
  if (!context) throw new Error("Blog request context is unavailable.");
  return context;
}

export function getBlogsDatabase() {
  return getBlogRequestContext().database;
}

export function withBlogContext<Result>(
  context: BlogRequestContext,
  run: () => Result,
) {
  return requestContext.run(context, run);
}
