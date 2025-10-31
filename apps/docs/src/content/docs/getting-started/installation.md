# Installation

This guide provides instructions for setting up the AlbertPlus development environment. You can choose between the standard setup or the Nix-based setup for a more reproducible environment.

## Standard Setup

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/TechAtNYU/AlbertPlus.git
    cd AlbertPlus
    ```

2.  **Install Dependencies**

    Ensure you have Node.js (v20+) and Bun installed. Then, run the following command to install the project dependencies:

    ```bash
    bun install
    ```

3.  **Configure Doppler**

    This project uses Doppler to manage environment variables. You will need to have a Doppler account and the Doppler CLI installed.

    -   Log in to your Doppler account:

        ```bash
        doppler login
        ```

    -   Set up the Doppler project:

        ```bash
        doppler setup
        ```

        Follow the prompts to select the appropriate Doppler project for AlbertPlus.

4.  **Run the Setup Script**

    The `setup.sh` script automates the process of creating the necessary `.env.local` files for each application and configuring the Convex backend.

    ```bash
    ./setup.sh
    ```

    This script will:
    -   Copy and modify the environment file for the web app.
    -   Copy and modify the environment file for the browser extension.
    -   Create an environment file for the scraper.
    -   Set the Clerk JWT issuer domain and Convex API key in your Convex environment.

## Nix-based Setup

If you have Nix and `direnv` installed, you can use the provided `flake.nix` to create a reproducible development environment.

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/TechAtNYU/AlbertPlus.git
    cd AlbertPlus
    ```

2.  **Allow Direnv**

    When you first enter the directory, `direnv` will prompt you to allow the `.envrc` file. Run the following command:

    ```bash
    direnv allow
    ```

    Nix will then build the development shell, which may take a few minutes on the first run. The shell hook will automatically install the Bun dependencies.

3.  **Configure Doppler**

    The Nix shell provides an interactive prompt to configure Doppler if it hasn't been set up yet. Enter your Doppler service token when prompted.

4.  **Run the Setup Script**

    Once the Nix shell is active and Doppler is configured, run the setup script:

    ```bash
    ./setup.sh
    ```

Your development environment is now ready. You can proceed to the [Quick Start](./quick-start.md) guide to learn how to run the project.
