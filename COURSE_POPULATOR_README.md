# Course Populator for Brown University Course Catalog

This tool populates the local PostgreSQL database with Brown University course data from the SQL file.

## What it does

The course populator (`course-populator.cjs`) reads the Brown University courses from `backend/sql/brown_university_courses.sql` and inserts them into your local database with proper mapping to the database schema.

## Features

- ✅ **Proper SQL parsing**: Correctly parses the complex SQL INSERT statements
- ✅ **Data cleaning**: Handles quotes, escapes, and null values
- ✅ **Schema mapping**: Maps SQL columns to database schema
- ✅ **Department extraction**: Automatically extracts department from course codes
- ✅ **Error handling**: Skips problematic records and reports errors
- ✅ **Progress tracking**: Shows insertion progress every 100 courses
- ✅ **Sample output**: Shows sample courses with professors after completion

## Usage

### Quick Start
```bash
npm run populate
```

### Manual Run
```bash
node course-populator.cjs
```

## Database Schema

The populator maps data to this schema:

| SQL Column | Database Column | Description |
|------------|----------------|-------------|
| `code` | `code` | Course code (e.g., "CSCI 0150") |
| `name` | `name` | Course name |
| `description` | `description` | Course description |
| `days` | `days` | Meeting days (e.g., "MWF") |
| `start_time` | `start_time` | Class start time |
| `end_time` | `end_time` | Class end time |
| `location` | `location` | Class location |
| `professor` | `professor` | Instructor name |
| - | `department` | Auto-extracted from course code |

## Sample Output

```
🚀 Starting course population...
✅ Connected to database
✅ Cleared existing courses
📚 Reading Brown University courses from SQL file...
📋 Found columns: ['code', 'name', 'description', 'days', 'start_time', 'end_time', 'location', 'professor']
📝 Found 1296 course records to process
📚 Inserted 100 courses...
📚 Inserted 200 courses...
...
✅ Successfully loaded 1208 courses from Brown University database
⚠️  61 courses had errors and were skipped
🎉 Course population complete!
📚 Total courses in database: 1208

📋 Sample courses with professors:
  AFRI 0090: An Introduction to Africana Studies - Francoise Hamlin (AFRI)
  AFRI 0300: Performing Ethnography and the Politics of Culture - Lisa Biggs (AFRI)
  AFRI 0410: After the Uprisings: Abolition and Black Studies - Justin Lang (AFRI)
  AFRI 0420: Cannabis Legalization: Race, Education, and Policing - Noliwe Rooks (AFRI)
  AFRI 0670: Global Black Radicalism - Brian Meeks (AFRI)
```

## Error Handling

The populator handles various data issues:

- **Invalid time formats**: Skips courses with malformed time data
- **Long values**: Skips courses with values too long for database columns
- **Missing data**: Skips courses without essential fields (code, name)
- **SQL parsing errors**: Gracefully handles complex SQL structures

## Verification

After running the populator, you can verify the data:

### Check total courses
```bash
curl -X GET http://localhost:3001/api/courses | jq '.courses | length'
```

### Check courses with professors
```bash
curl -X GET http://localhost:3001/api/courses | jq '.courses[] | select(.professor != null) | {code, name, professor}' | head -20
```

### Test login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}'
```

## Requirements

- PostgreSQL database running locally
- `env.local` file with `DATABASE_URL`
- `backend/sql/brown_university_courses.sql` file
- Node.js with required dependencies

## Troubleshooting

### Database connection issues
- Ensure PostgreSQL is running
- Check `env.local` has correct `DATABASE_URL`
- Verify database exists

### SQL file not found
- Ensure `backend/sql/brown_university_courses.sql` exists
- Check file permissions

### Parsing errors
- The tool handles most SQL parsing issues automatically
- Check console output for specific error messages
- Some courses may be skipped due to data quality issues

## Integration

This populator is part of the complete local development setup:

1. **Setup database**: `npm run setup`
2. **Populate courses**: `npm run populate`
3. **Start servers**: `npm run dev`
4. **Access app**: http://localhost:5173

The populated courses will be available in the frontend with full professor information displayed on course cards. 