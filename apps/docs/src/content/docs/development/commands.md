---
title: Commands
---

# Commands

The AlbertPlus monorepo comes with a set of scripts defined in the root `package.json` to streamline common development tasks. These scripts are executed using the Bun package manager.

## Core Commands

-   `bun run dev`

    Starts all applications in development mode. This is the most common command you will use during development.

-   `bun run build`

    Creates a production-ready build of all applications in the monorepo.

-   `bun run check`

    Runs the Biome linter to check for code quality and style issues across the entire project.

-   `bun run check:fix`

    Automatically fixes any linting and formatting errors that can be resolved by Biome.

-   `bun run check:types`

    Runs the TypeScript compiler to perform type checking across all workspaces.

-   `bun run dashboard`

    Opens the Convex dashboard in your web browser, allowing you to inspect your database, view logs, and manage your backend environment.

## Running Commands for a Single Application

Turborepo allows you to run commands for a specific application or package by using the `--filter` flag.

For example, to run the development server for only the web application, you can use:

```bash
bun run --filter web dev
```

Similarly, to build only the browser extension, you would run:

```bash
bun run --filter browser build
```

This is useful when you are focused on a single part of the project and don't need to run the other applications.
