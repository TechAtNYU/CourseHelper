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
          gum style --foreground "#a6e3a1" "📡 Starting Convex server..."
          bun dev:db &

          gum style --foreground "#a6e3a1" "🌐 Starting Next.js server..."
          bun dev &

          echo ""
          gum style \
             --italic \
            "Press Ctrl+C to stop both servers"
          echo ""
          wait
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            bun
            doppler

            git
            gh
            gum

            dev
          ];

          shellHook = ''
            gum spin --title "Installing dependencies..." -- bun install

            # Check and configure Doppler
            if ! doppler configure get token / >/dev/null 2>&1; then
              gum style --foreground "#f9e2af" "Doppler not configured yet"
              
              DOPPLER_TOKEN=$(gum input --password --placeholder "Enter your Doppler service token")
              
              if [ -n "$DOPPLER_TOKEN" ]; then
                echo "$DOPPLER_TOKEN" | doppler configure set token --scope /
                gum style --foreground "#a6e3a1" "✅ Doppler configured successfully"
                clear
              else
                gum style --foreground "#f38ba8" "⚠️ No token provided"
                gum style --foreground "#f38ba8" --italic "Configure later with: echo 'your-token' | doppler configure set token --scope /"
              fi
            fi

            gum style --foreground "#a6e3a1" \
              --align center --width 60 --padding "1 2" \
              "🚀 Development Environment Ready!"

            gum style --foreground "#cba6f7" --bold \
              --align center --width 60 --padding "0 2" \
              "📦 Node.js: $(node --version)
            🥖 Bun: $(bun --version)
            "

            gum style --bold "Available Commands:"

            gum style --margin "0 2" \
              "$(gum style --bold --foreground "#89b4fa" 'dev')             - Start both Next.js and Convex servers" \
              "$(gum style --bold --foreground "#89b4fa" 'bun dev')         - Start Next.js development server only" \
              "$(gum style --bold --foreground "#89b4fa" 'bun dev:db')      - Start Convex development server only" \
              "$(gum style --bold --foreground "#89b4fa" 'bun run build')   - Build the application" \
              "$(gum style --bold --foreground "#89b4fa" 'bun start')       - Start production server" \
              "$(gum style --bold --foreground "#89b4fa" 'bun check')       - Check code with Biome" \
              "$(gum style --bold --foreground "#89b4fa" 'bun check:types') - Run TypeScript type checking"
            echo ""
          '';
        };
      }
    );
}
