export const BLOG_PLUGIN_KEY = "codexsun.blog" as const;
export const BLOG_ADDON_KIND = "composable-addon-application" as const;
export const BLOG_PACKAGE_VERSION = "1.0.16" as const;

export type BlogHost = string;
export type BlogRuntimeMode = "multi-tenant" | "single-client";
export type BlogDatabaseMode = "host-database";

export type BlogPluginManifest = {
  apiPrefix: "/blogs";
  capabilities: {
    optional: readonly ["media.public", "queue"];
    required: readonly [
      "identity",
      "authorization",
      "database",
      "migration-ledger",
    ];
  };
  compatibleHosts: "host-adapter";
  contributions: {
    api: true;
    editor: true;
    navigation: true;
    publicPages: true;
    seo: true;
  };
  databaseModes: readonly BlogDatabaseMode[];
  displayName: "Blog";
  hostApi: "^1.0.0";
  key: typeof BLOG_PLUGIN_KEY;
  kind: typeof BLOG_ADDON_KIND;
  packages: {
    api: "@codexsun/blog/api";
    contracts: "@codexsun/blog/contracts";
    web: "@codexsun/blog/web";
  };
  runtimeModes: readonly BlogRuntimeMode[];
  schemaVersion: 1;
  version: string;
};

export const blogPluginManifest: BlogPluginManifest = {
  apiPrefix: "/blogs",
  capabilities: {
    optional: ["media.public", "queue"],
    required: ["identity", "authorization", "database", "migration-ledger"],
  },
  compatibleHosts: "host-adapter",
  contributions: {
    api: true,
    editor: true,
    navigation: true,
    publicPages: true,
    seo: true,
  },
  databaseModes: ["host-database"],
  displayName: "Blog",
  hostApi: "^1.0.0",
  key: BLOG_PLUGIN_KEY,
  kind: BLOG_ADDON_KIND,
  packages: {
    api: "@codexsun/blog/api",
    contracts: "@codexsun/blog/contracts",
    web: "@codexsun/blog/web",
  },
  runtimeModes: ["multi-tenant", "single-client"],
  schemaVersion: 1,
  version: BLOG_PACKAGE_VERSION,
};

export type BlogTenantContext = {
  actorId: string | null;
  host: BlogHost;
  origin: string;
  scopeId: string;
};
