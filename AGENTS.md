# Agent Guidelines for dev-team-fall-25

## Build/Lint/Test Commands
- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all applications
- `bun run check` - Run Biome linting
- `bun run check:fix` - Auto-fix Biome linting issues
- `bun run check:types` - TypeScript type checking
- `bun run dashboard` - Open Convex dashboard
- App-specific: `bun run --filter <app-name> <command>`

## Code Style
- **Formatter**: Biome with 2-space indentation, double quotes
- **Imports**: Auto-organized by Biome, use `@/` for app-relative paths
- **Types**: TypeScript strict mode, explicit return types for functions
- **Components**: React functional components with TypeScript props interface
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Use proper TypeScript error types and Result patterns
- **CSS**: TailwindCSS with `cn()` utility from `clsx` + `tailwind-merge`

## Project Structure
- Monorepo with Turbo, Bun package manager
- Apps: `web` (Next.js), `chrome` (extension), `scraper` (Cloudflare Worker)
- Server: Convex backend in `packages/server`
- Use workspace dependencies with `workspace:*` syntax