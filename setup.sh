#!/bin/bash

set -e

SOURCE_FILE="./packages/server/.env.local"
DEST_FILE="./apps/web/.env.local"

echo "Copying and modifying environment file..."
echo "Source: $SOURCE_FILE"
echo "Destination: $DEST_FILE"

sed 's/^CONVEX_URL=/NEXT_PUBLIC_CONVEX_URL=/' "$SOURCE_FILE" > "$DEST_FILE"

echo "Successfully copied $SOURCE_FILE to $DEST_FILE"
echo "Changed CONVEX_URL to NEXT_PUBLIC_CONVEX_URL"

echo "Setting up Clerk JWT issuer domain..."
CLERK_JWT_ISSUER_DOMAIN=$(doppler secrets get CLERK_JWT_ISSUER_DOMAIN --plain)
echo "Retrieved CLERK_JWT_ISSUER_DOMAIN from Doppler: $CLERK_JWT_ISSUER_DOMAIN"

echo "Setting CLERK_JWT_ISSUER_DOMAIN in Convex environment..."
(cd ./packages/server && bunx convex env set CLERK_JWT_ISSUER_DOMAIN "$CLERK_JWT_ISSUER_DOMAIN")

echo "Setup complete!"
