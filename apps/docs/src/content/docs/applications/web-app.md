# Web Application

The web application, located in the `apps/web` directory, is the heart of the AlbertPlus platform. It is a modern, feature-rich application built with Next.js and React, providing students with a powerful and intuitive interface for course planning and registration.

## Key Technologies

-   **Framework**: [Next.js](https://nextjs.org/) 15 with the App Router, enabling a flexible and scalable application structure.
-   **Language**: [TypeScript](https://www.typescriptlang.org/), for type safety and improved developer experience.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4, for a utility-first approach to styling.
-   **UI Components**: A combination of [Radix UI](https://www.radix-ui.com/) primitives for accessible, unstyled components, and custom-built UI components.
-   **Authentication**: [Clerk](https://clerk.com/) for user management and authentication.
-   **Backend**: [Convex](https://www.convex.dev/) for the serverless backend and real-time database.

## Features

-   **Dashboard**: A central hub for students to access all of the application's features.
-   **Degree Progress Upload**: Students can upload their degree progress report in PDF format, which is then parsed on the client-side to extract completed courses.
-   **Schedule Calendar**: A visual calendar interface for building and managing course schedules.
-   **Course Catalog**: A searchable and filterable catalog of all NYU courses.
-   **Program Requirements**: The ability to view the requirements for different academic programs.
-   **Admin Panel**: A dedicated section for administrators to manage application settings.

## Project Structure

The web application follows the standard Next.js App Router structure:

-   `src/app/`: Contains the main application routes and layouts.
-   `src/components/`: Shared UI components used throughout the application.
-   `src/hooks/`: Custom React hooks.
-   `src/lib/`: Utility functions and library configurations.
-   `src/modules/`: Feature-specific modules, such as `report-parsing`.

## Running the Web App

To run the web application in development mode, use the following command:

```bash
bun run --filter web dev
```

The application will be available at `http://localhost:3000`.
