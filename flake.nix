{
  description = "Dev Team Fall 25 Flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        dev = pkgs.writeShellScriptBin "dev" ''
          #!${pkgs.bash}/bin/bash

          echo "🚀 Starting development servers..."
          echo ""

          cleanup() {
            echo ""
            echo "🛑 Shutting down servers..."
            jobs -p | xargs -r kill
            exit 0
          }

          trap cleanup SIGINT SIGTERM

          echo "📡 Starting Convex server..."
          bun dev:db

          sleep 2

          echo "🌐 Starting Next.js server..."
          bun dev

          echo ""
          echo "✅ Both servers are starting up!"
          echo ""
          echo "Press Ctrl+C to stop both servers"

          wait
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            bun

            git

            dev
          ];

          shellHook = ''
            bun install
            echo "🚀 Development environment loaded!"
            echo "📦 Node.js: $(node --version)"
            echo "🥖 Bun: $(bun --version)"
            echo ""
            echo "Available commands:"
            echo "  dev             - Start both Next.js and Convex servers"
            echo "  bun dev         - Start Next.js development server only"
            echo "  bun dev:db      - Start Convex development server only"
            echo "  bun build       - Build the application"
            echo "  bun start       - Start production server"
            echo "  bun check       - Check code with Biome"
            echo "  bun check:types - Run TypeScript type checking"
            echo ""
          '';
        };
      }
    );
}
