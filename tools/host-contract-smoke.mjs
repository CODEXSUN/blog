import assert from "node:assert/strict";
import Fastify from "fastify";
import {
  getBlogRequestContext,
  withBlogContext,
} from "../dist/apps/blogs/api/runtime/blog-host.js";
import { registerBlogsApi } from "../dist/apps/blogs/api/index.js";
import { blogPluginManifest } from "../dist/apps/blogs/contracts/index.js";

assert.equal(blogPluginManifest.kind, "composable-addon-application");
assert.equal(blogPluginManifest.hostApi, "^1.0.0");
assert.deepEqual(blogPluginManifest.runtimeModes, ["multi-tenant", "single-client"]);

const database = { selectFrom: () => undefined };
const scopes = await Promise.all(
  ["tenant-one", "tenant-two"].map((scopeId, index) =>
    withBlogContext(
      {
        actorId: `actor-${index}`,
        database,
        host: "contract-smoke",
        origin: "https://example.test",
        scopeId,
      },
      async () => {
        await new Promise((resolve) => setTimeout(resolve, index === 0 ? 10 : 1));
        return getBlogRequestContext().scopeId;
      },
    ),
  ),
);

assert.deepEqual(scopes, ["tenant-one", "tenant-two"]);
assert.throws(() => getBlogRequestContext(), /request context is unavailable/);

const app = Fastify({ logger: false });
await registerBlogsApi(app, {
  authorize: () => {
    throw new Error("Authorization must not run without an actor.");
  },
  resolveContext: () => ({
    actorId: null,
    database,
    host: "contract-smoke",
    origin: "https://example.test",
    scopeId: "tenant-one",
  }),
});
await app.ready();
const protectedResponse = await app.inject({ method: "GET", url: "/blogs/articles" });
assert.equal(protectedResponse.statusCode, 401, protectedResponse.body);
await app.close();
console.info("Blog host manifest and concurrent request isolation passed.");
