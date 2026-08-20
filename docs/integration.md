# Blog integration contract

CXApp and TechMedia install Blog at a pinned Git tag and register it as a module in their own deployments. Blog owns its database, migrations, seeds, content, and public SEO routes. Hosts provide trusted tenant context, JWT validation, permissions, framework adapters, and canonical-domain rendering.

Hosts must resolve tenant context server-side, never trust a browser tenant id, mount the API and React public/editor modules, and run Blog migrations before enabling routes. Upgrade by exact tag, backup the Blog database, run composition smoke tests, then deploy web. No host imports private Blog files or writes Blog tables directly.

Use `npm install github:CODEXSUN/blog#v-1.0.0` locally and in CI so development exercises the production artifact.
