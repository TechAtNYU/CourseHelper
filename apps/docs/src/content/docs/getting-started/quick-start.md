# Quick Start

Once you have completed the installation and setup, you can run the AlbertPlus project on your local machine.

## Running the Development Server

To start all the applications in development mode, run the following command from the root of the project:

```bash
bun run dev
```

This command uses `turbo` to start the development servers for the web app, browser extension, and Convex backend concurrently. You will see output from each of the services in your terminal.

- **Web App**: The Next.js application will be available at `http://localhost:3000`.
- **Convex Backend**: The Convex development server will run, providing a local backend for your application. You can access the Convex dashboard to view your data and logs.
- **Browser Extension**: The Plasmo development server will build the extension and prepare it for loading into your browser.

## Running Individual Applications

If you only need to work on a specific part of the project, you can run each application individually:

- **Web App**:

  ```bash
  bun run --filter web dev
  ```

- **Browser Extension**:

  ```bash
  bun run --filter browser dev
  ```

- **Convex Backend**:

  ```bash
  bun run --filter @albert-plus/server dev
  ```

## Accessing the Convex Dashboard

To open the Convex dashboard and inspect your database, view logs, and manage your backend environment, run:

```bash
bun run dashboard
```

This command is a convenient shortcut to the `convex dashboard` command.

## Building for Production

To create a production-ready build of all applications, use the following command:

```bash
bun run build
```

This will generate optimized assets for the web app and browser extension.

## Linting and Type Checking

To ensure code quality and consistency, the project uses Biome for linting and formatting, and TypeScript for type checking.

- **Check for linting errors**:

  ```bash
  bun run check
  ```

- **Automatically fix linting errors**:

  ```bash
  bun run check:fix
  ```

- **Check for TypeScript errors**:

  ```bash
  bun run check:types
  ```
