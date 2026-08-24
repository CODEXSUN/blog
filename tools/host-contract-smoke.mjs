import assert from "node:assert/strict";
import Fastify from "fastify";
import {
  blogsMigrationBatch,
  getBlogRequestContext,
  withBlogContext,
  registerBlogsApi,
} from "@codexsun/blog/api";
import { blogPluginManifest } from "@codexsun/blog/contracts";

assert.equal(blogPluginManifest.kind, "composable-addon-application");
assert.equal(blogPluginManifest.hostApi, "^1.0.0");
assert.deepEqual(blogPluginManifest.runtimeModes, ["multi-tenant", "single-client"]);
assert.deepEqual(
  blogsMigrationBatch.steps.map(({ acceptedAppliedChecksums, checksum, name, version }) => ({
    acceptedAppliedChecksums,
    checksum,
    name,
    version,
  })),
  [
    { acceptedAppliedChecksums: undefined, checksum: "blogs.taxonomy:v1", name: "blogs.taxonomy", version: 1 },
    { acceptedAppliedChecksums: undefined, checksum: "blogs.article:v1", name: "blogs.article", version: 1 },
    { acceptedAppliedChecksums: undefined, checksum: "blogs.discussion:v1", name: "blogs.discussion", version: 1 },
    { acceptedAppliedChecksums: undefined, checksum: "blogs.engagement:v1", name: "blogs.engagement", version: 1 },
    {
      acceptedAppliedChecksums: [
        "187d79bf83dd2a93665fa1cdb971464eaa84b0a05ea425a5b6c3c3379e39ba16",
      ],
      checksum: "blogs.experience-v2:v2",
      name: "blogs.experience-v2",
      version: 2,
    },
    { acceptedAppliedChecksums: undefined, checksum: "blogs.standard-tables:v3", name: "blogs.standard-tables", version: 3 },
    { acceptedAppliedChecksums: undefined, checksum: "blogs.live-editor:v4", name: "blogs.live-editor", version: 4 },
  ],
);

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
