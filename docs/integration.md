# Blog integration contract

Blog is a composable add-on application. It has no CXApp or CXShop dependency. The host chooses multi-tenant or single-client mode and supplies verified identity, authorization, database access, migration-ledger execution, and canonical origin through adapters.

## Host responsibilities

1. Install one exact Blog release tag.
2. Validate the exported manifest before activation.
3. Resolve `scopeId`, actor, database, and origin from trusted server state. Never accept a tenant or database name from browser input.
4. Call `provisionBlogsDatabase` for each database scope before serving its first Blog request. The host migration runner owns locking, batches, checksums, and rollback policy.
5. Register `registerBlogsApi` with `resolveContext` and `authorize`. The protected API requires `blog.manage`; public article and sitemap routes still require a host-resolved scope.
6. Mount only public React exports. Host shells own navigation, authentication chrome, and route placement.
7. Close host database pools after add-on shutdown. Blog does not open or own a global pool.

The same Blog source therefore runs in CXApp with a database per tenant and in a single-client host with one stable application scope. Repositories read the active request context, so concurrent tenants cannot change global database state.

## Upgrade sequence

Back up every affected database, install the exact tag, validate the manifest, run provision/migration checks for every scope, run API and web composition tests, then deploy. No host imports private Blog files or writes Blog tables directly.

The current host-neutral source supersedes the old `bootstrapBlogsDatabase()` integration. Existing hosts may keep a short compatibility adapter only until they install the release that exports `provisionBlogsDatabase`.
