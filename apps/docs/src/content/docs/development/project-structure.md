---
title: Project Structure
---

# Project Structure

Understanding the file and directory structure of AlbertPlus is essential for navigating the codebase and making contributions. The project is organized as a monorepo, with a clear separation between applications and shared packages.

## Root Directory

The root directory contains the configuration files for the entire monorepo, as well as the `apps` and `packages` directories.

-   `apps/`: Contains the individual, deployable applications.
-   `packages/`: Contains shared code and libraries used across the applications.
-   `.github/`: GitHub Actions workflows for CI/CD.
-   `biome.json`: Configuration for the Biome linter and formatter.
-   `bun.lockb`: The lockfile for Bun, the package manager.
-   `flake.nix`: The Nix flake for creating a reproducible development environment.
-   `package.json`: The root package configuration, including scripts and workspace definitions.
-   `turbo.json`: The configuration for Turborepo, the monorepo build system.

## `apps` Directory

Each subdirectory in the `apps` directory is a standalone application.

-   `web/`: The Next.js web application.
    -   `src/app/`: The App Router directory, containing the pages and layouts.
    -   `src/components/`: Shared React components for the web app.
    -   `src/lib/`: Utility functions and library configurations.
-   `browser/`: The Plasmo-based Chrome extension.
    -   `src/content.tsx`: The content script injected into web pages.
    -   `src/popup.tsx`: The UI for the extension's popup.
-   `scraper/`: The Cloudflare Worker for web scraping.
    -   `src/index.ts`: The main entry point for the worker.
    -   `src/modules/`: The logic for scraping courses and programs.
-   `docs/`: The Astro and Starlight documentation site.
    -   `src/content/docs/`: The Markdown and MDX files for the documentation pages.

## `packages` Directory

The `packages` directory contains code that is shared across multiple applications.

-   `server/`: The Convex backend.
    -   `convex/`: The core of the backend, containing the database schema, queries, and mutations.
    -   `convex/schema.ts`: The database schema definition.
    -   `convex/*.ts`: Files containing the serverless functions (queries and mutations).
