export const BLOG_PLUGIN_KEY = "codexsun.blog" as const;
export type BlogHost = "cxapp" | "techmedia";
export type BlogPluginManifest = { key: typeof BLOG_PLUGIN_KEY; version: string; compatibleHosts: BlogHost[]; capabilities: ["editor", "public-pages", "seo", "discussion", "engagement"]; apiPrefix: string; publicPrefix: string };
export const blogPluginManifest: BlogPluginManifest = { key: BLOG_PLUGIN_KEY, version: "1.0.0", compatibleHosts: ["cxapp", "techmedia"], capabilities: ["editor", "public-pages", "seo", "discussion", "engagement"], apiPrefix: "/api/blog", publicPrefix: "/blog" };
export type BlogTenantContext = { tenantId: string; host: BlogHost; requestId?: string };
