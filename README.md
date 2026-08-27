# CODEXSUN Blog

Centralised Blog add-on for multi-tenant and single-client CODEXSUN products. The repository owns blog content, taxonomy, discussions, engagement, public SEO pages, the editorial workspace, migrations, and seeds. A host integrates it through the public manifest, API lifecycle, and React exports.

## Packages

- `@codexsun/blog/api` — Fastify routes plus host-owned migration and seed lifecycle.
- `@codexsun/blog/web` — editor and public React modules with no CXApp or CXShop UI dependency.
- `@codexsun/blog/contracts` — host-neutral add-on manifest and integration types.

Install the compiled npm package in production:

```json
{"dependencies":{"@codexsun/blog":"1.0.13"}}
```

GitHub releases publish the matching package version to npm. The release tag must use the `v-<version>` format.

The npm trusted publisher must match the `CODEXSUN/blog` repository and `.github/workflows/publish-npm.yml`. The first package publish may require an npm owner to create the `@codexsun/blog` package.

See `docs/integration.md` for the production contract and upgrade sequence.
blog
