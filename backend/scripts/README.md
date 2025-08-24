# Scripts Directory

This directory contains various utility scripts for managing the Brown University course catalog database. These scripts are kept locally for development and maintenance purposes but are not committed to the repository.

## Available Scripts

### Course Scraping Scripts
- `brown_scraper_optimized.js` - Main optimized scraper for importing courses from Brown's website
- `brown_scraper_*.js` - Various versions and iterations of the course scraper
- `fetch_*.js` - Scripts for fetching course data from Brown's API

### Database Management Scripts
- `clear_schedule.js` - Clears all scheduled courses from the database
- `check_course_at_index.js` - Checks course data at a specific index
- `debug_*.js` - Debugging scripts for database operations
- `test_*.js` - Testing scripts for database functionality
- `export_courses_to_sql.js` - Exports courses to SQL file
- `add_additional_courses.js` - Adds additional courses to database
- `update_courses.js` - Updates existing course data
- `empty_courses.js` - Empties the courses table

### Utility Scripts
- `run_scraper.js` - Wrapper script for running scrapers
- `step_by_step_insert.js` - Step-by-step course insertion script

## Usage

These scripts are intended for:
- Development and testing
- Database maintenance
- Course data import/export
- Debugging database issues

## Note

These scripts are excluded from version control via `.gitignore` to keep the repository clean and prevent accidental commits of development tools. They remain available locally for ongoing development work. 