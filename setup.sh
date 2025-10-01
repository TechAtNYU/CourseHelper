#!/bin/bash

set -e

SOURCE_FILE="./packages/server/.env.local"
WEB_DEST_FILE="./apps/web/.env.local"
CHROME_DEST_FILE="./apps/chrome/.env"

echo "Copying and modifying environment file for web app..."
echo "Source: $SOURCE_FILE"
echo "Destination: $WEB_DEST_FILE"

sed 's/^CONVEX_URL=/NEXT_PUBLIC_CONVEX_URL=/' "$SOURCE_FILE" > "$WEB_DEST_FILE"

echo "Successfully copied $SOURCE_FILE to $WEB_DEST_FILE"
echo "Changed CONVEX_URL to NEXT_PUBLIC_CONVEX_URL"

echo "Copying and modifying environment file for chrome extension..."
echo "Source: $SOURCE_FILE"
echo "Destination: $CHROME_DEST_FILE"

sed 's/^CONVEX_URL=/VITE_CONVEX_URL=/' "$SOURCE_FILE" > "$CHROME_DEST_FILE"

echo "Successfully copied $SOURCE_FILE to $CHROME_DEST_FILE"
echo "Changed CONVEX_URL to VITE_CONVEX_URL"

SCRAPER_DEST_FILE="./apps/scraper/.env"

echo "Copying CONVEX_URL to scraper environment file..."
echo "Source: $SOURCE_FILE"
echo "Destination: $SCRAPER_DEST_FILE"

grep '^CONVEX_URL=' "$SOURCE_FILE" > "$SCRAPER_DEST_FILE"

echo "Successfully copied CONVEX_URL to $SCRAPER_DEST_FILE"

echo "Setting up Clerk JWT issuer domain..."
CLERK_JWT_ISSUER_DOMAIN=$(doppler secrets get CLERK_JWT_ISSUER_DOMAIN --plain)
echo "Retrieved CLERK_JWT_ISSUER_DOMAIN from Doppler: $CLERK_JWT_ISSUER_DOMAIN"

echo "Setting CLERK_JWT_ISSUER_DOMAIN in Convex environment..."
(cd ./packages/server && bunx convex env set CLERK_JWT_ISSUER_DOMAIN "$CLERK_JWT_ISSUER_DOMAIN")

echo "Setup complete!"
