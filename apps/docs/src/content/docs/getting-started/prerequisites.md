# Prerequisites

Before you begin, ensure you have the following software installed on your system. This project offers two primary setup methods: a standard setup using Node.js and Bun, and a more reproducible environment using Nix.

## Standard Setup

For the standard setup, you will need:

- **Node.js**: Version 20 or higher. We recommend using a version manager like `nvm` to manage your Node.js versions.
- **Bun**: A fast JavaScript all-in-one toolkit. Bun is used as the package manager and runtime for this project. You can find installation instructions on the [official Bun website](https://bun.sh/).
- **Git**: For version control.
- **Doppler**: For managing environment variables and secrets. You will need to create a Doppler account and project to store the necessary API keys and configuration.

## Nix-based Setup

For a more declarative and reproducible development environment, you can use Nix. The project includes a `flake.nix` file that defines all the necessary dependencies.

- **Nix**: The purely functional package manager. Follow the instructions on the [NixOS website](https://nixos.org/download.html) to install Nix on your system.
- **Direnv** (optional but recommended): To automatically load the Nix shell when you enter the project directory.

By using the Nix flake, the correct versions of Node.js, Bun, Doppler, and other development tools will be automatically provisioned for you.
