# Changelog

## Version State

Current version: 1.0.16

Release tag: v-1.0.16

Changelog label: v 1.0.16

This changelog records the standalone CODEXSUN Blog package. Database-facing work and application codebase work remain separate in every release entry.

New entries must use the same format and must be ordered newest first.

#### Database Changes

Records schema, migrations, repeatable seeds, tenant database ownership, and data compatibility changes.

#### App Codebase Changes

API, web, editor, SEO, service logic, contracts, tooling, packaging, integration, and documentation changes.

## Unreleased

#### Database Changes

- No unreleased database changes.

#### App Codebase Changes

- No unreleased application changes.

## v-1.0.16

### [v 1.0.16] 2026-08-27 10:46 am - Authenticated editor validation

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.16.
- Normalized a cleared article author selector to no linked tenant user.
- Added field-specific article validation messages beside the affected input.
- Added host-provided authentication headers to Blog editor data and save requests.
- Added a safe thumbnail fallback when a File Manager image is missing.
- Kept public article covers and article-list thumbnails consistent after storage resets.

## v-1.0.15

### [v 1.0.15] 2026-08-26 9:53 am - Accessible File Manager image picker

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.15.
- Added a visible close control, Cancel action, backdrop dismissal, and Escape-key support to Blog dialogs.
- Added an Upload image action inside the managed-media browser and retained automatic selection after upload.
- Added Escape-key exit for the New Article editor when no nested dialog is open.
- Refined the managed-image picker layout for desktop and mobile screens.

## v-1.0.14

### [v 1.0.14] 2026-08-26 8:25 am - Compiled npm web ESM compatibility

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.14.
- Published compiled API, web, and contracts entry points through the npm package.
- Added the GitHub release workflow and npm package-content checks.
- Removed the install-time Git build requirement.
- Added explicit JavaScript extensions to compiled web imports for native ESM compatibility.
- Added NodeNext type checking to prevent invalid compiled web imports.

## v-1.0.13

### [v 1.0.13] 2026-08-25 6:33 pm - Tech Media editorial article seeds

#### Database Changes

- Database update: Yes (automatic repeatable seed update, with no schema migration).
- Added published seeds for business printer selection, UPS and power protection, and monitor selection.
- Filled author, avatar, display position, canonical URL, taxonomy, media metadata, and SEO fields consistently in article seeds.

#### App Codebase Changes

- Bumped workspace version to 1.0.13.
- Added complete Tech Media editorial content for the three new buying and infrastructure guides.
- Added storefront product, assessment, and contact calls to action to each article.

## v-1.0.12

### [v 1.0.12] 2026-08-25 9:13 am - Stable Blog migration and release metadata

#### Database Changes

- Database update: No. Migration compatibility remains package-owned.

#### App Codebase Changes

- Synchronized the public add-on manifest with the package release version.
- Extended version tooling so future releases update and validate the manifest automatically.

## v-1.0.11

### [v 1.0.11] 2026-08-25 9:08 am - Stable migration checksum compatibility

#### Database Changes

- Database update: No. Existing migration records remain unchanged.

#### App Codebase Changes

- Added the previously applied checksum for `blogs.experience-v2` to the package-owned migration contract.
- Added a host-contract regression assertion for the migration name, version, checksum, and accepted legacy checksum.
- Hosts no longer need to patch Blog migration metadata locally.

## v-1.0.10

### [v 1.0.10] 2026-08-24 9:51 pm - Production GitHub package integration

#### Database Changes

- Database update: Integration lifecycle changed; owner tables are unchanged.
- Replaced the global Blog connection with a host-provided database context per request.
- Exported host-owned migration and repeatable seed provisioning for multi-tenant and single-client scopes.

#### App Codebase Changes

- Bumped workspace version to 1.0.10.
- Added production-safe compiled API and contract exports for GitHub-tag installations.
- Added the Git dependency prepare lifecycle and npm package policy for compiled artifacts.
- Changed the host-contract smoke test to exercise the public package exports.
- Exported request-context helpers for host provisioning and contract validation.
- Removed host framework and UI dependencies from the API and web workspaces.
- Added the versioned add-on manifest, request-context isolation, and host authorization adapter.
- Added host-neutral editor primitives and documented exact-tag integration.

## v-1.0.9

### [v 1.0.9] 2026-08-20 11:50 pm - Business content and public Blog navigation

#### Database Changes

- Database update: Yes (manual).
- Added repeatable taxonomy and eight published stories about business operations, accounting, billing, manufacturing, inventory, and automation.
- Keyed taxonomy seed lookups by kind and slug to keep matching category and tag slugs distinct.

#### App Codebase Changes

- Bumped workspace version to 1.0.9.
- Redesigned the public Blog list with an always-comfortable editorial layout.
- Added latest, category, tag, and recent-story filters in the Blog sidebar.
- Removed the search toolbar and Reading view density control.
- Added host-configurable media paths and generated image fallbacks for Blog lists and article pages.
- Improved public article navigation, media handling, responsive spacing, and discussion presentation.

## v-1.0.8

### [v 1.0.8] 2026-08-20 8:22 pm - Release update

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.8.

## v-1.0.7

### [v 1.0.7] 2026-08-20 8:22 pm - Release update

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.7.

## v-1.0.6

### [v 1.0.6] 2026-08-20 8:20 pm - Release update

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped workspace version to 1.0.6.

## v-1.0.5

### [v 1.0.5] 2026-08-20 8:05 pm - Changelog numbering alignment

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped all Blog packages to version 1.0.5.
- Aligned the release metadata with the CXApp changelog convention.
- Rewrote the changelog into descending version order.
- Removed custom numbered release headings in favour of standard `v-x.y.z` headings.

## v-1.0.4

### [v 1.0.4] 2026-08-20 7:49 pm - Release tooling and changelog format fix

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Added clean, version, GitHub sync, and release command tooling.
- Added timestamped release entries and package version checks.
- Fixed GitHub release commit subjects and release metadata handling.

## v-1.0.3

### [v 1.0.3] 2026-08-20 7:42 pm - Release tooling baseline

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Added Blog clean, version, GitHub, and release scripts.
- Added workspace package version consistency validation.

## v-1.0.2

### [v 1.0.2] 2026-08-20 7:42 pm - Migration and dashboard foundation

#### Database Changes

- Database update: Yes (auto-check).
- Registered author, media, revision, redirect, and settings tables.
- Added the Blog dashboard statistics query.

#### App Codebase Changes

- Added the first back-office dashboard endpoint.
- Corrected Blog migration batch metadata and registration order.

## v-1.0.1

### [v 1.0.1] 2026-08-20 7:45 pm - Initial release metadata

#### Database Changes

- Database update: No (auto-check).

#### App Codebase Changes

- Bumped all Blog packages to version 1.0.1.
- Published the first pinned GitHub package release.
- Added production installation guidance for CXApp and TechMedia.

## v-1.0.0

### [v 1.0.0] 2026-08-20 7:15 pm - Central Blog package

#### Database Changes

- Database update: Yes (auto-check).
- Added taxonomy, article, discussion, engagement, and Blog experience tables.
- Registered repeatable Blog seeds and migration ownership.

#### App Codebase Changes

- Created the standalone CODEXSUN Blog package.
- Added module-owned API and web modules for articles, taxonomy, discussions, engagement, editor, and public SEO pages.
- Added the Blog contracts package and host integration guidance.
- Established the rule that host applications must not write Blog tables directly.
