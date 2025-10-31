---
title: Environment Setup
---

# Environment Setup

This guide provides detailed instructions for setting up your local development environment for AlbertPlus. A correct setup is crucial for a smooth development experience.

## Option 1: Standard Setup

This setup is for developers who prefer to manage their own development tools.

### 1. Install Prerequisites

-   **Node.js**: Install Node.js version 20 or higher. We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm).
-   **Bun**: Install Bun, the JavaScript toolkit used in this project. You can find installation instructions on the [official Bun website](https://bun.sh/).
-   **Doppler**: Install the Doppler CLI for secret management. Follow the instructions on the [Doppler website](https://docs.doppler.com/reference/cli).

### 2. Clone and Install

```bash
git clone https://github.com/TechAtNYU/AlbertPlus.git
cd AlbertPlus
bun install
```

### 3. Configure Doppler

You will need access to the project's Doppler repository. Once you have access, log in and set up the project:

```bash
doppler login
doppler setup
```

### 4. Run the Setup Script

The setup script will create the necessary environment files for each application:

```bash
./setup.sh
```

## Option 2: Nix-based Setup

This setup uses Nix to create a reproducible and isolated development environment. It is the recommended approach for a hassle-free setup.

### 1. Install Nix

If you don't have Nix installed, follow the instructions on the [NixOS website](https://nixos.org/download.html). We also recommend installing [direnv](https://direnv.net/) to automatically load the Nix shell.

### 2. Clone and Enter the Directory

```bash
git clone https://github.com/TechAtNYU/AlbertPlus.git
cd AlbertPlus
```

If you have `direnv` installed, allow it to load the `.envrc` file:

```bash
direnv allow
```

Nix will then build the development environment, which may take some time on the first run. The shell hook will also automatically run `bun install`.

### 3. Configure Doppler

The Nix shell will prompt you to enter your Doppler service token if it's not already configured. Paste the token to grant the environment access to the project's secrets.

### 4. Run the Setup Script

Finally, run the setup script to create the environment files:

```bash
./setup.sh
```

Your development environment is now fully configured and ready for you to start coding.
