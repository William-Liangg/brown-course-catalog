// Test the separate approach for professor name extraction
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
  const username = email.split('@')[0];
  
  console.log('Email found:', email);
  console.log('Username:', username);
  
  // The tricky part: names are concatenated directly with email
  // We need to find where the name ends and email username begins
  
  // Remove the email from the text to get everything before it
  const beforeEmail = cleaned.replace(email, '').trim();
  
  console.log('Text before email:', JSON.stringify(beforeEmail));
  
  // Try to intelligently separate the display name from the email username
  const result = separateNameFromUsername(beforeEmail, username);
  
  return result;
}

function separateNameFromUsername(textWithUsername, username) {
  // The text contains both the display name AND the email username concatenated
  // Example: "Lisa Biggslisa_biggs" where username is "lisa_biggs"
  
  // Strategy: find where the username pattern starts in the text
  const usernamePattern = username.toLowerCase().replace(/[._-]/g, '');
  const textLower = textWithUsername.toLowerCase().replace(/[._-\s]/g, '');
  
  console.log('Username pattern:', usernamePattern);
  console.log('Text lower:', textLower);
  
  // Find where the username pattern appears in the text
  const usernameIndex = textLower.indexOf(usernamePattern);
  
  console.log('Username index:', usernameIndex);
  
  if (usernameIndex > 0) {
    // Extract everything before the username pattern
    const displayName = textWithUsername.substring(0, usernameIndex).trim();
    console.log('Display name extracted:', JSON.stringify(displayName));
    return cleanDisplayName(displayName);
  }
  
  // Fallback: if we can't separate cleanly, try to parse the username
  console.log('Using fallback: parse email username');
  return parseEmailUsername(username);
}

function cleanDisplayName(name) {
  // Clean up the display name by removing extra whitespace and normalizing
  return name.replace(/\s+/g, ' ').trim();
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