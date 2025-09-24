#!/bin/bash

set -e

echo "Setting up Convex server..."
(cd ./packages/server && bun convex dev --until-success)

SOURCE_FILE="./packages/server/.env.local"
DEST_FILE="./apps/web/.env.local"

if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file $SOURCE_FILE does not exist"
    exit 1
fi

echo "Copying and modifying environment file..."
echo "Source: $SOURCE_FILE"
echo "Destination: $DEST_FILE"

sed 's/^CONVEX_URL=/NEXT_PUBLIC_CONVEX_URL=/' "$SOURCE_FILE" > "$DEST_FILE"

echo "Successfully copied $SOURCE_FILE to $DEST_FILE"
echo "Changed CONVEX_URL to NEXT_PUBLIC_CONVEX_URL"
