// Test the current logic and show how to fix it for full names
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
  
  // Get the text that contains the concatenated name + username
  // This is everything before the @brown.edu part
  const textBeforeAt = cleaned.split('@')[0];
  
  console.log('Text before @:', JSON.stringify(textBeforeAt));
  
  // Now separate the display name from the username
  const result = separateNameFromUsername(textBeforeAt, username);
  
  return result;
}

function separateNameFromUsername(fullText, username) {
  // fullText contains something like "Brian Meeksbrian_meeks" 
  // username is "brian_meeks" or similar
  
  console.log(`Separating: "${fullText}" with username: "${username}"`);
  
  // Strategy: Find where the username pattern appears and work backwards to word boundaries
  const usernameNormalized = username.toLowerCase().replace(/[._-]/g, '');
  
  // Split fullText into words to preserve boundaries
  const words = fullText.split(/\s+/);
  
  console.log(`Words: [${words.map(w => `"${w}"`).join(', ')}]`);
  
  // Try to find the username pattern in the concatenated words
  let foundAtWordIndex = -1;
  let foundAtCharIndex = -1;
  
  for (let i = 0; i < words.length; i++) {
    const wordNormalized = words[i].toLowerCase().replace(/[._-]/g, '');
    const usernameIndex = wordNormalized.indexOf(usernameNormalized);
    
    if (usernameIndex >= 0) {
      foundAtWordIndex = i;
      foundAtCharIndex = usernameIndex;
      console.log(`Found username pattern in word ${i} ("${words[i]}") at char ${usernameIndex}`);
      break;
    }
  }
  
  if (foundAtWordIndex >= 0 && foundAtCharIndex > 0) {
    // Extract the clean part of the word where username starts
    const cleanWordPart = words[foundAtWordIndex].substring(0, foundAtCharIndex);
    
    // Combine all words before this one, plus the clean part
    const resultWords = words.slice(0, foundAtWordIndex).concat([cleanWordPart]);
    const result = resultWords.join(' ').trim();
    
    console.log(`Extracted clean name: "${result}"`);
    return result;
  }
  
  // Fallback strategies for edge cases
  
  // Try looking for the pattern across word boundaries
  const fullTextNormalized = fullText.toLowerCase().replace(/[._-\s]/g, '');
  const usernameIndex = fullTextNormalized.indexOf(usernameNormalized);
  
  if (usernameIndex > 0) {
    // Map back to original text by counting characters with spaces
    let charCount = 0;
    let originalIndex = 0;
    
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i].toLowerCase();
      if (char.match(/[a-z]/)) {  // Only count letters
        if (charCount === usernameIndex) {
          originalIndex = i;
          break;
        }
        charCount++;
      }
    }
    
    if (originalIndex > 0) {
      const result = fullText.substring(0, originalIndex).trim();
      console.log(`Mapped back to original index ${originalIndex}: "${result}"`);
      return result;
    }
  }
  
  // Final fallbacks
  if (words.length >= 2) {
    const lastName = words[words.length - 1];
    const possibleSplit = findSplitPoint(lastName, username);
    
    if (possibleSplit > 0) {
      const cleanLastName = lastName.substring(0, possibleSplit);
      const otherWords = words.slice(0, -1);
      const result = [...otherWords, cleanLastName].join(' ');
      console.log(`Split strategy worked: "${result}"`);
      return result;
    }
  }
  
  console.log(`All strategies failed, parsing username`);
  return parseEmailUsername(username);
}

function findSplitPoint(lastName, username) {
  // Try to find where the original name ends and username begins
  // Example: "Smithjsmith" with username "jsmith"
  
  const lastNameLower = lastName.toLowerCase();
  const usernameNormalized = username.toLowerCase().replace(/[._-]/g, '');
  
  // Look for patterns where username appears as suffix
  for (let i = 1; i < lastName.length - 1; i++) {
    const prefix = lastNameLower.substring(0, i);
    const suffix = lastNameLower.substring(i);
    
    // Check if suffix matches start of username
    if (usernameNormalized.startsWith(suffix) && suffix.length >= 2) {
      return i;
    }
  }
  
  return -1;
}

function cleanDisplayName(name) {
  // Clean up the extracted display name
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

// Test the current logic
console.log("=== CURRENT LOGIC (only first name) ===");
const testCase = "Instructors\nFrancoise Hamlinfrancoise_hamlin@brown.edu";
console.log(`Original: "${testCase}"`);
const currentResult = cleanInstructorName(testCase);
console.log(`Current result: "${currentResult}"`);
console.log();

// Now let's create a better approach that extracts the full name
console.log("=== IMPROVED LOGIC (full name) ===");

function extractFullName(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Remove "Instructors" prefix and clean up
  let cleaned = text.replace(/^Instructors\s*\n?/i, '').trim();
  
  // Find email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@brown\.edu)/g;
  const emailMatches = cleaned.match(emailRegex);
  
  if (!emailMatches || emailMatches.length === 0) {
    return cleaned;
  }
  
  // Use the first email found
  const email = emailMatches[0];
  const username = email.split('@')[0];
  
  console.log('Email found:', email);
  console.log('Username:', username);
  
  // Get the text that contains the concatenated name + username
  const textBeforeAt = cleaned.split('@')[0];
  
  console.log('Text before @:', JSON.stringify(textBeforeAt));
  
  // NEW APPROACH: Extract the full name by removing the concatenated part
  const result = extractFullNameFromText(textBeforeAt, username);
  
  return result;
}

function extractFullNameFromText(fullText, username) {
  console.log(`Extracting full name from: "${fullText}" with username: "${username}"`);
  
  // Split into words
  const words = fullText.split(/\s+/);
  console.log(`Words: [${words.map(w => `"${w}"`).join(', ')}]`);
  
  // Find which word contains the concatenated username
  let concatenatedWordIndex = -1;
  let concatenatedWord = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLower = word.toLowerCase().replace(/[._-]/g, '');
    const usernameLower = username.toLowerCase().replace(/[._-]/g, '');
    
    if (wordLower.includes(usernameLower)) {
      concatenatedWordIndex = i;
      concatenatedWord = word;
      console.log(`Found concatenated word at index ${i}: "${word}"`);
      break;
    }
  }
  
  if (concatenatedWordIndex >= 0) {
    // Extract the clean part of the concatenated word
    const cleanPart = extractCleanPartFromWord(concatenatedWord, username);
    console.log(`Clean part extracted: "${cleanPart}"`);
    
    // Combine all words before the concatenated word, plus the clean part
    const resultWords = words.slice(0, concatenatedWordIndex).concat([cleanPart]);
    const result = resultWords.join(' ').trim();
    
    console.log(`Full name result: "${result}"`);
    return result;
  }
  
  // Fallback: return the original text
  console.log(`No concatenation found, returning original: "${fullText}"`);
  return fullText;
}

function extractCleanPartFromWord(word, username) {
  console.log(`Extracting clean part from word: "${word}" with username: "${username}"`);
  
  const wordLower = word.toLowerCase().replace(/[._-]/g, '');
  const usernameLower = username.toLowerCase().replace(/[._-]/g, '');
  
  // Find where the username starts in the word
  const usernameStartIndex = wordLower.indexOf(usernameLower);
  
  if (usernameStartIndex > 0) {
    // Extract everything before the username
    const cleanPart = word.substring(0, usernameStartIndex);
    console.log(`Username starts at index ${usernameStartIndex}, clean part: "${cleanPart}"`);
    return cleanPart;
  }
  
  // If username is not found, return the original word
  console.log(`Username not found in word, returning original: "${word}"`);
  return word;
}

// Test the improved logic
const improvedResult = extractFullName(testCase);
console.log(`Improved result: "${improvedResult}"`); 