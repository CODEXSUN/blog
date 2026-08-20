# CODEXSUN Blog

Centralised, multi-tenant blog capability for CODEXSUN products. The repository owns blog content, taxonomy, discussions, engagement, public SEO pages, and the editorial workspace. CXApp and TechMedia integrate it through public module exports and HTTP contracts.

## Packages

- `@codexsun/blogs-api` — Fastify module, MariaDB migrations, tenant-scoped repositories, public and protected routes.
- `@codexsun/blogs-web` — editor and public React modules.
- `@codexsun/blogs-contracts` — host-neutral plugin manifest and integration types.

Install exact GitHub tags in production:

```json
{"dependencies":{"@codexsun/blogs-api":"github:CODEXSUN/blog#v-1.0.0","@codexsun/blogs-web":"github:CODEXSUN/blog#v-1.0.0","@codexsun/blogs-contracts":"github:CODEXSUN/blog#v-1.0.0"}}
```

See `docs/integration.md` for the production contract.
blog
