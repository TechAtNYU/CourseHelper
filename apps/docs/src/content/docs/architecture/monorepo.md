# Monorepo Structure

AlbertPlus utilizes a monorepo architecture, managed by Turborepo, to streamline development and code sharing across its various applications and packages. This structure enhances code consistency, simplifies dependency management, and improves the overall developer workflow.

## Tooling

- **Turborepo**: The high-performance build system for JavaScript and TypeScript codebases. It enables fast, incremental builds and parallel execution of tasks.
- **Bun**: The package manager and JavaScript runtime. Bun's speed and comprehensive feature set make it an ideal choice for a modern monorepo.
- **Workspaces**: The project is organized into workspaces, which are defined in the root `package.json` file. This allows for the logical separation of applications and shared packages.

## Directory Layout

The project's directory is organized as follows:

```
/
├── apps/
│   ├── web/                # Next.js web application
│   ├── browser/            # Chrome browser extension
│   ├── scraper/            # Cloudflare Worker for web scraping
│   └── docs/               # Astro documentation site
├── packages/
│   └── server/             # Convex backend and database schema
├── .github/                # GitHub Actions workflows
├── biome.json              # Biome linter and formatter configuration
├── bun.lockb               # Bun lockfile
├── flake.nix               # Nix flake for reproducible environments
├── package.json            # Root package configuration and scripts
├── setup.sh                # Environment setup script
└── turbo.json              # Turborepo configuration
```

### `apps` Directory

The `apps` directory contains the individual, deployable applications of the AlbertPlus platform. Each application is a self-contained project with its own dependencies and build process.

- **`web`**: The main user-facing Next.js application.
- **`browser`**: The Chrome browser extension.
- **`scraper`**: The Cloudflare Worker responsible for data collection.
- **`docs`**: The documentation site you are currently viewing.

### `packages` Directory

The `packages` directory holds shared code that is used across multiple applications. This promotes code reuse and consistency.

- **`server`**: The Convex backend, which includes the database schema, serverless functions (queries and mutations), and authentication logic. This package is a critical dependency for both the web app and the browser extension.
