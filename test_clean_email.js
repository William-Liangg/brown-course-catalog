// Test the clean email extraction approach
function extractProfessorName(originalText) {
  console.log('Original text:', JSON.stringify(originalText));
  
  let professor = originalText;
  
  // Remove newlines and normalize whitespace first
  professor = professor.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Remove "Instructors" prefix first
  if (professor.startsWith('Instructors')) {
    professor = professor.replace('Instructors', '').trim();
  }
  
  // Use improved approach: Extract clean email and rebuild name
  // 1️⃣ Extract email
  const emailMatch = professor.match(/[\w\.-]+@[\w\.-]+/);
  const email = emailMatch ? emailMatch[0] : '';
  
  console.log('Email found:', email);
  
  if (email) {
    // 2️⃣ Extract username and find the clean parts
    const username = email.split('@')[0];
    
    // Look for the clean email pattern (e.g., brian_meeks from Meeksbrian_meeks)
    // The clean pattern should be shorter and more reasonable
    const allEmailMatches = professor.match(/[\w\.-]+@[\w\.-]+/g) || [];
    let cleanEmail = email;
    
    console.log('All email matches:', allEmailMatches);
    
    // If we have multiple email matches, choose the shortest one (likely the clean one)
    if (allEmailMatches.length > 1) {
      cleanEmail = allEmailMatches.reduce((shortest, current) => 
        current.length < shortest.length ? current : shortest
      );
    }
    
    console.log('Clean email chosen:', cleanEmail);
    
    const cleanUsername = cleanEmail.split('@')[0];
    const parts = cleanUsername.split(/[_\.-]/).map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).filter(part => part);
    
    console.log('Clean username:', cleanUsername);
    console.log('Email parts:', parts);
    
    // 3️⃣ Extract the clean name part (before the email)
    const namePart = professor.replace(email, '').trim();
    
    console.log('Name part (after removing email):', JSON.stringify(namePart));
    
    // 4️⃣ Choose the better option: clean name part or reconstructed from email
    if (namePart && namePart.includes(' ') && namePart.split(' ').length >= 2) {
      // Use the clean name part if it has multiple words
      console.log('Using clean name part');
      professor = namePart;
    } else {
      // Use the reconstructed name from email
      console.log('Using reconstructed email name');
      professor = parts.join(' ');
    }
  } else {
    // No email found, just clean up any remaining email patterns
    const emailPattern = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/;
    professor = professor.replace(emailPattern, '').trim();
    console.log('No email found, cleaned result:', JSON.stringify(professor));
  }
  
  console.log('Final result:', JSON.stringify(professor));
  return professor;
}

// Test cases
const professors = [
  "Instructors\nBrian Meeksbrian_meeks@brown.edu",
  "Instructors\nLisa Biggslisa_biggs@brown.edu", 
  "Instructors\nJustin Langjustin_a_lang@brown.edu",
  "Instructors\nLisa Di Carlo Lisalisa_di_carlo@brown.edu"
];

professors.forEach((profText, index) => {
  console.log(`=== Test ${index + 1} ===`);
  extractProfessorName(profText);
  console.log('');
}); 