---
title: Code Style
---

# Code Style

To maintain a high level of code quality and consistency across the project, AlbertPlus adheres to a set of coding standards and practices. These are enforced using modern tooling, which helps to automate the process and reduce the cognitive load on developers.

## Formatter and Linter

-   **Tool**: [Biome](https://biomejs.dev/), an all-in-one tool for linting, formatting, and more.
-   **Configuration**: The Biome configuration is defined in the `biome.json` file at the root of the project.
-   **Key Formatting Rules**:
    -   Indentation: 2 spaces.
    -   Quotes: Double quotes (`"`).
    -   Imports: Automatically organized and sorted.

To check for linting errors, run:

```bash
bun run check
```

To automatically fix formatting and linting issues, run:

```bash
bun run check:fix
```

## TypeScript

-   **Strict Mode**: The project uses TypeScript in strict mode to catch common errors at compile time.
-   **Explicit Return Types**: All exported functions should have explicit return types to improve code clarity and maintainability.
-   **Path Aliases**: The project uses path aliases (e.g., `@/components/...`) for cleaner and more readable import statements. These are configured in the `tsconfig.json` file for each application.

## React Components

-   **Functional Components**: All React components should be written as functional components using hooks.
-   **Props**: For components that accept props, use intersection types to combine standard HTML attributes with custom props. This is particularly useful when wrapping native elements.

    ```tsx
    import type { VariantProps } from "class-variance-authority";

    type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;
    ```

-   **Component Variants**: The `class-variance-authority` (cva) library is used to create components with different visual variants.

## Naming Conventions

-   **Variables and Functions**: Use `camelCase`.
-   **Components and Types**: Use `PascalCase`.

## CSS

-   **Tailwind CSS**: The project uses Tailwind CSS for styling. Adhere to the utility-first methodology.
-   **Conditional Classes**: Use the `cn()` utility (a combination of `clsx` and `tailwind-merge`) for applying conditional classes to components.
