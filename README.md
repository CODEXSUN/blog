# CODEXSUN Blog

Centralised Blog add-on for multi-tenant and single-client CODEXSUN products. The repository owns blog content, taxonomy, discussions, engagement, public SEO pages, the editorial workspace, migrations, and seeds. A host integrates it through the public manifest, API lifecycle, and React exports.

## Packages

- `@codexsun/blog/api` — Fastify routes plus host-owned migration and seed lifecycle.
- `@codexsun/blog/web` — editor and public React modules with no CXApp or CXShop UI dependency.
- `@codexsun/blog/contracts` — host-neutral add-on manifest and integration types.

Install exact GitHub tags in production:

```json
{"dependencies":{"@codexsun/blog":"github:CODEXSUN/blog#v-1.0.9"}}
```

The current source contains the host-adapter contract that will ship in the next Blog release. See `docs/integration.md` for the production contract and upgrade sequence.
blog
