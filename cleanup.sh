#!/bin/bash

echo "🧹 Cleaning up BrunoTrack for deployment..."

# Remove debug images
echo "📸 Removing debug images..."
rm -f backend/*.png

# Remove test files from root
echo "🧪 Removing test files from root..."
rm -f test_*.js

# Remove backend test files
echo "🧪 Removing backend test files..."
rm -f backend/test-*.js

# Remove large SQL file
echo "🗄️ Removing large SQL file..."
rm -f backend/temp_insert.sql

# Remove cookie files
echo "🍪 Removing cookie files..."
rm -f cookies.txt backend/cookies.txt

# Remove fix SQL file
echo "🔧 Removing fix SQL file..."
rm -f backend/fix_sql.js

# Remove ALL scraper scripts (they're preserved in .gitignore)
echo "🕷️ Removing ALL scraper scripts..."
rm -f backend/scripts/brown_scraper*.js
rm -f backend/scripts/*_scraper*.js
rm -f backend/scripts/debug_*.js
rm -f backend/scripts/test_*.js
rm -f backend/scripts/run_scraper.js
rm -f backend/scripts/step_by_step_insert.js
rm -f backend/scripts/empty_courses.js
rm -f backend/scripts/add_additional_courses.js
rm -f backend/scripts/update_courses.js
rm -f backend/scripts/fetch_*.js
rm -f backend/scripts/export_courses_to_sql.js
rm -f backend/scripts/clear_schedule.js
rm -f backend/scripts/check_course_at_index.js

# Remove system files
echo "💻 Removing system files..."
rm -f .DS_Store

# Remove empty files (1 byte files)
echo "🗑️ Removing empty files..."
find . -maxdepth 2 -size 1c -name "*.js" -delete

# Remove any remaining temporary files
echo "🗑️ Removing temporary files..."
rm -f backend/scripts/*.tmp
rm -f backend/scripts/*.bak
rm -f *.tmp
rm -f *.bak

echo "✅ Cleanup complete! Ready for deployment."
echo "📊 Estimated space saved: ~1.5MB" 