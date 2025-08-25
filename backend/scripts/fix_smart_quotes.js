const fs = require('fs');
const path = require('path');

function fixSmartQuotes() {
  try {
    console.log('🔧 Replacing smart quotes with regular quotes...');
    
    const sqlPath = path.join(__dirname, '../sql/brown_university_courses.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Replace smart quotes with double regular quotes
    let fixedContent = sqlContent
      .replace(/"/g, "''")  // Replace all smart double quotes with two regular single quotes
      .replace(/"/g, "''"); // Replace any remaining smart double quotes with two regular single quotes
    
    fs.writeFileSync(sqlPath, fixedContent);
    
    console.log('✅ Successfully replaced smart quotes with regular quotes');
    
  } catch (error) {
    console.error('❌ Error fixing smart quotes:', error);
  }
}

fixSmartQuotes(); 