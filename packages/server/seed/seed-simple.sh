#!/bin/bash

# Simple Database Seeding Script for AlbertPlus using Convex CLI
# This script uses the convex import command to seed data from JSONL files
#
# Usage:
#   chmod +x seed-simple.sh
#   ./seed-simple.sh
#
# Requirements:
#   - Convex CLI installed
#   - Convex deployment configured

echo "🌱 Starting database seeding with Convex CLI..."
echo ""

# Seed appConfigs
echo "📝 Seeding appConfigs..."
convex import --table appConfigs --replace appConfigs.jsonl
if [ $? -eq 0 ]; then
  echo "  ✓ appConfigs seeded successfully"
else
  echo "  ✗ Failed to seed appConfigs"
fi
echo ""

# Seed programs
echo "📚 Seeding programs..."
convex import --table programs --replace programs.jsonl
if [ $? -eq 0 ]; then
  echo "  ✓ programs seeded successfully"
else
  echo "  ✗ Failed to seed programs"
fi
echo ""

# Seed courses
echo "📖 Seeding courses..."
convex import --table courses --replace courses.jsonl
if [ $? -eq 0 ]; then
  echo "  ✓ courses seeded successfully"
else
  echo "  ✗ Failed to seed courses"
fi
echo ""

# Seed courseOfferings
echo "🗓️  Seeding course offerings..."
convex import --table courseOfferings --replace courseOfferings.jsonl
if [ $? -eq 0 ]; then
  echo "  ✓ courseOfferings seeded successfully"
else
  echo "  ✗ Failed to seed courseOfferings"
fi
echo ""

# Seed userCourseOfferings
echo "🎯 Seeding user course offerings..."
convex import --table userCourseOfferings --replace userCourseOfferings.jsonl
if [ $? -eq 0 ]; then
  echo "  ✓ userCourseOfferings seeded successfully"
else
  echo "  ✗ Failed to seed userCourseOfferings"
fi
echo ""

echo "✅ Basic database seeding completed!"
echo ""
echo "⚠️  Note: Prerequisites, requirements, students, and userCourses require"
echo "   custom mutations due to complex relationships. Use the Node.js script"
echo "   (seed.js) for complete seeding, or create custom Convex mutations."
