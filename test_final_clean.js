// Test the final clean instructor name approach
function cleanInstructorName(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Remove "Instructors" prefix and clean up
  let cleaned = text.replace(/^Instructors\s*\n?/i, '').trim();
  
  // Find email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@brown\.edu)/g;
  const emailMatches = cleaned.match(emailRegex);
  
  if (!emailMatches || emailMatches.length === 0) {
    // No email found, return the cleaned text as-is
    return cleaned;
  }
  
  // Use the first email found
  const email = emailMatches[0];
  
  // Extract the text before the email (this should be the display name)
  const beforeEmail = cleaned.split(email)[0].trim();
  
  if (beforeEmail && beforeEmail.length > 0) {
    // We have text before the email, use that as the name
    return beforeEmail;
  }
  
  // Fallback: try to reconstruct name from email username
  const username = email.split('@')[0];
  
  // Try to parse the email username intelligently
  return parseEmailUsername(username);
}

function parseEmailUsername(username) {
  // Remove common separators and split
  const parts = username.split(/[._-]+/);
  
  // Filter out empty parts and single characters (except common initials)
  const meaningfulParts = parts.filter(part => 
    part.length > 1 || /^[A-Z]$/i.test(part)
  );
  
  // Capitalize each part properly
  const capitalizedParts = meaningfulParts.map(part => {
    // Handle single letters (initials)
    if (part.length === 1) {
      return part.toUpperCase();
    }
    
    // Handle common name patterns
    if (part.toLowerCase() === 'di' || part.toLowerCase() === 'de' || 
      part.toLowerCase() === 'la' || part.toLowerCase() === 'le') {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }
    
    // Regular capitalization
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  
  return capitalizedParts.join(' ');
}

// Test cases
function runTests() {
  const tests = [
    "Instructors\nBrian Meeksbrian_meeks@brown.edu",
    "Instructors\nLisa Biggslisa_biggs@brown.edu", 
    "Instructors\nJustin Langjustin_a_lang@brown.edu",
    "Instructors\nLisa Di Carlo Lisalisa_di_carlo@brown.edu",
    "Instructors\nJohn Smithjsmith@brown.edu",
    "Instructors\nMary O'Connor Marymary_oconnor@brown.edu"
  ];
  
  tests.forEach((test, index) => {
    console.log(`=== Test ${index + 1} ===`);
    console.log(`Original: "${test}"`);
    const result = cleanInstructorName(test);
    console.log(`Result: "${result}"`);
    console.log();
  });
}

// Run tests
runTests(); 