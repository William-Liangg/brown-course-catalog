const fs = require('fs');

// Read the SQL file
let content = fs.readFileSync('sql/brown_university_courses.sql', 'utf8');

// Fix smart quotes
content = content.replace(/['']/g, "'");
content = content.replace(/[""]/g, '"');

// Fix em/en dashes
content = content.replace(/[—–]/g, '-');

// Fix unescaped apostrophes in text (but not in SQL syntax)
// This regex finds apostrophes that are inside string values and not already escaped
content = content.replace(/(?<='[^']*)'s(?=[^']*')/g, "''s");
content = content.replace(/(?<='[^']*)'t(?=[^']*')/g, "''t");
content = content.replace(/(?<='[^']*)'re(?=[^']*')/g, "''re");
content = content.replace(/(?<='[^']*)'ll(?=[^']*')/g, "''ll");
content = content.replace(/(?<='[^']*)'ve(?=[^']*')/g, "''ve");
content = content.replace(/(?<='[^']*)'d(?=[^']*')/g, "''d");
content = content.replace(/(?<='[^']*)'m(?=[^']*')/g, "''m");

// Write the fixed content back
fs.writeFileSync('sql/brown_university_courses.sql', content);

console.log('SQL file fixed!'); 