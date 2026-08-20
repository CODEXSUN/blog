# Changelog

## Version State

Current version: 1.0.8

Release tag: v-1.0.8

Changelog label: v 1.0.8

This changelog records the standalone CODEXSUN Blog package. Database-facing work and application codebase work remain separate in every release entry.

New entries must use the same format and must be ordered newest first.

#### Database Changes

Records schema, migrations, repeatable seeds, tenant database ownership, and data compatibility changes.

#### App Codebase Changes

API, web, editor, SEO, service logic, contracts, tooling, packaging, integration, and documentation changes.

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
