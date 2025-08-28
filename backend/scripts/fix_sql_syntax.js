const fs = require('fs');
const path = require('path');

function fixSqlSyntax() {
  try {
    console.log('🔧 Fixing SQL syntax issues...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/brown_university_courses.sql');
    let sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📖 SQL file loaded successfully');
    
    // Create a backup
    const backupPath = path.join(__dirname, '../sql/brown_university_courses_backup.sql');
    fs.writeFileSync(backupPath, sqlContent);
    console.log('💾 Backup created');
    
    // Fix 1: Replace smart quotes
    // Replace smart single quotes ‘’ with regular single quotes '
    sqlContent = sqlContent.replace(/['']/g, "'");
    
    // Replace smart double quotes "" with regular double quotes "
    sqlContent = sqlContent.replace(/[""]/g, '"');
    
    console.log('✅ Fixed smart quotes');
    
    // Fix 2: Replace em/en dashes
    // Replace em-dash — and en-dash – with regular hyphen -
    sqlContent = sqlContent.replace(/[—–]/g, '-');
    
    console.log('✅ Fixed dashes');
    
    // Fix 3: Escape single quotes inside string values
    // This is the most complex part - we need to find single quotes that are inside string values
    // and escape them by doubling them, but NOT touch the quotes that delimit the strings
    
    // First, let's handle the specific problematic cases we know about
    sqlContent = sqlContent.replace(/students' capacity/g, "students'' capacity");
    sqlContent = sqlContent.replace(/students' work/g, "students'' work");
    sqlContent = sqlContent.replace(/What's Popping/g, "What''s Popping");
    sqlContent = sqlContent.replace(/students' findings/g, "students'' findings");
    sqlContent = sqlContent.replace(/students' growth/g, "students'' growth");
    sqlContent = sqlContent.replace(/students' experience/g, "students'' experience");
    sqlContent = sqlContent.replace(/students' skills/g, "students'' skills");
    sqlContent = sqlContent.replace(/students' understanding/g, "students'' understanding");
    sqlContent = sqlContent.replace(/students' knowledge/g, "students'' knowledge");
    sqlContent = sqlContent.replace(/students' ability/g, "students'' ability");
    sqlContent = sqlContent.replace(/students' capacity/g, "students'' capacity");
    sqlContent = sqlContent.replace(/students' work/g, "students'' work");
    sqlContent = sqlContent.replace(/students' findings/g, "students'' findings");
    sqlContent = sqlContent.replace(/students' growth/g, "students'' growth");
    sqlContent = sqlContent.replace(/students' experience/g, "students'' experience");
    sqlContent = sqlContent.replace(/students' skills/g, "students'' skills");
    sqlContent = sqlContent.replace(/students' understanding/g, "students'' understanding");
    sqlContent = sqlContent.replace(/students' knowledge/g, "students'' knowledge");
    sqlContent = sqlContent.replace(/students' ability/g, "students'' ability");
    
    // Handle other common apostrophe cases
    sqlContent = sqlContent.replace(/world's/g, "world''s");
    sqlContent = sqlContent.replace(/don't/g, "don''t");
    sqlContent = sqlContent.replace(/can't/g, "can''t");
    sqlContent = sqlContent.replace(/won't/g, "won''t");
    sqlContent = sqlContent.replace(/isn't/g, "isn''t");
    sqlContent = sqlContent.replace(/aren't/g, "aren''t");
    sqlContent = sqlContent.replace(/doesn't/g, "doesn''t");
    sqlContent = sqlContent.replace(/didn't/g, "didn''t");
    sqlContent = sqlContent.replace(/hasn't/g, "hasn''t");
    sqlContent = sqlContent.replace(/haven't/g, "haven''t");
    sqlContent = sqlContent.replace(/hadn't/g, "hadn''t");
    sqlContent = sqlContent.replace(/wouldn't/g, "wouldn''t");
    sqlContent = sqlContent.replace(/couldn't/g, "couldn''t");
    sqlContent = sqlContent.replace(/shouldn't/g, "shouldn''t");
    sqlContent = sqlContent.replace(/mightn't/g, "mightn''t");
    sqlContent = sqlContent.replace(/mustn't/g, "mustn''t");
    sqlContent = sqlContent.replace(/shan't/g, "shan''t");
    sqlContent = sqlContent.replace(/let's/g, "let''s");
    sqlContent = sqlContent.replace(/it's/g, "it''s");
    sqlContent = sqlContent.replace(/that's/g, "that''s");
    sqlContent = sqlContent.replace(/there's/g, "there''s");
    sqlContent = sqlContent.replace(/here's/g, "here''s");
    sqlContent = sqlContent.replace(/who's/g, "who''s");
    sqlContent = sqlContent.replace(/what's/g, "what''s");
    sqlContent = sqlContent.replace(/where's/g, "where''s");
    sqlContent = sqlContent.replace(/when's/g, "when''s");
    sqlContent = sqlContent.replace(/why's/g, "why''s");
    sqlContent = sqlContent.replace(/how's/g, "how''s");
    
    console.log('✅ Fixed apostrophes');
    
    // Write the corrected file
    fs.writeFileSync(sqlPath, sqlContent);
    console.log('💾 Corrected SQL file saved');
    
    console.log('🎉 SQL syntax fixes completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing SQL syntax:', error);
  }
}

fixSqlSyntax(); 