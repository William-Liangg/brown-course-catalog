const fs = require('fs');
const path = require('path');

function escapeQuotesInDescriptions() {
  try {
    console.log('🔧 Escaping single quotes in course descriptions...');
    
    const sqlPath = path.join(__dirname, '../sql/brown_university_courses.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the content into lines
    const lines = sqlContent.split('\n');
    let modifiedLines = [];
    
    for (let line of lines) {
      // Check if this line contains course data (starts with INSERT)
      if (line.trim().startsWith('INSERT INTO courses')) {
        // Find the description field (it's the 3rd field in the VALUES)
        // Pattern: INSERT INTO courses (code, name, description, days, start_time, end_time, location, professor) VALUES
        // We need to find the description part which is between the 2nd and 3rd comma in the VALUES section
        
        // Split by VALUES to get the data part
        const parts = line.split('VALUES');
        if (parts.length === 2) {
          const header = parts[0];
          const dataPart = parts[1];
          
          // Find all the course entries in this line
          const courseMatches = dataPart.match(/\([^)]+\)/g);
          if (courseMatches) {
            let modifiedDataPart = dataPart;
            
            for (let match of courseMatches) {
              // Split the course entry by commas, but be careful with commas inside quotes
              const fields = [];
              let currentField = '';
              let inQuotes = false;
              let quoteCount = 0;
              
              for (let i = 1; i < match.length - 1; i++) { // Skip the opening and closing parentheses
                const char = match[i];
                
                if (char === "'") {
                  quoteCount++;
                  if (quoteCount % 2 === 1) {
                    inQuotes = true;
                  } else {
                    inQuotes = false;
                  }
                  currentField += char;
                } else if (char === ',' && !inQuotes) {
                  fields.push(currentField.trim());
                  currentField = '';
                } else {
                  currentField += char;
                }
              }
              fields.push(currentField.trim()); // Add the last field
              
              // Escape single quotes in the description field (3rd field, index 2)
              if (fields.length >= 3) {
                const description = fields[2];
                if (description.startsWith("'") && description.endsWith("'")) {
                  // Remove the outer quotes, escape internal quotes, then add back outer quotes
                  const content = description.slice(1, -1);
                  const escapedContent = content.replace(/'/g, "''");
                  fields[2] = "'" + escapedContent + "'";
                }
              }
              
              // Reconstruct the course entry
              const newMatch = '(' + fields.join(', ') + ')';
              modifiedDataPart = modifiedDataPart.replace(match, newMatch);
            }
            
            line = header + 'VALUES' + modifiedDataPart;
          }
        }
      }
      
      modifiedLines.push(line);
    }
    
    fs.writeFileSync(sqlPath, modifiedLines.join('\n'));
    
    console.log('✅ Successfully escaped single quotes in course descriptions');
    
  } catch (error) {
    console.error('❌ Error escaping quotes:', error);
  }
}

escapeQuotesInDescriptions(); 