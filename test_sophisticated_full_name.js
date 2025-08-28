// Test the sophisticated logic for extracting full names
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
  // fullText contains something like "Francoise Hamlinfrancoise_hamlin" 
  // username is "Hamlinfrancoise_hamlin" or similar
  
  console.log(`Separating: "${fullText}" with username: "${username}"`);
  
  // Strategy: The username often contains parts of the actual name
  // We need to reconstruct the real name from both the display text and username
  
  const words = fullText.split(/\s+/);
  console.log(`Words: [${words.map(w => `"${w}"`).join(', ')}]`);
  
  // Parse the username to understand its structure
  const usernameParts = username.toLowerCase().replace(/[._-]/g, ' ').split(/\s+/).filter(p => p.length > 0);
  console.log(`Username parts: [${usernameParts.map(p => `"${p}"`).join(', ')}]`);
  
  // Try to identify which parts of the username correspond to actual name parts
  const realNameParts = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLower = word.toLowerCase();
    
    if (i === words.length - 1) {
      // This is potentially the last word that contains the concatenated username
      // Try to extract the real last name from it
      const realLastName = extractRealLastName(word, usernameParts, wordLower);
      if (realLastName) {
        realNameParts.push(realLastName);
      }
    } else {
      // These are clean first/middle names
      realNameParts.push(word);
    }
  }
  
  const result = realNameParts.join(' ').trim();
  console.log(`Reconstructed name: "${result}"`);
  return result;
}

function extractRealLastName(lastWord, usernameParts, wordLower) {
  // The last word might be something like "Hamlinfrancoise_hamlin"
  // We need to find where the real last name ends
  
  console.log(`Extracting real last name from: "${lastWord}"`);
  
  // Strategy 1: Look for the username pattern starting within the word
  for (const usernamePart of usernameParts) {
    if (usernamePart.length >= 3) { // Only consider meaningful parts
      const index = wordLower.indexOf(usernamePart);
      if (index > 0) {
        // Found a username part starting at position > 0
        // Everything before this is likely the real last name
        const realLastName = lastWord.substring(0, index);
        console.log(`Found username part "${usernamePart}" at index ${index}, real last name: "${realLastName}"`);
        return realLastName;
      }
    }
  }
  
  // Strategy 2: Look for repeated patterns
  // e.g., "Hamlinfrancoise_hamlin" - "hamlin" appears twice
  for (let i = 1; i < lastWord.length / 2; i++) {
    const prefix = wordLower.substring(0, i);
    if (prefix.length >= 3) {
      const remaining = wordLower.substring(i);
      // Check if prefix appears later in the remaining text
      if (remaining.includes(prefix)) {
        const realLastName = lastWord.substring(0, i);
        console.log(`Found repeated pattern "${prefix}", real last name: "${realLastName}"`);
        return realLastName;
      }
    }
  }
  
  // Strategy 3: If no clear pattern, try to find a reasonable split point
  // Look for common patterns like a lowercase letter followed by uppercase
  for (let i = 1; i < lastWord.length - 1; i++) {
    const char = lastWord[i];
    const prevChar = lastWord[i-1];
    
    if (char.match(/[a-z]/) && prevChar.match(/[a-z]/) && 
      i < lastWord.length - 3) { // Don't split too close to the end
      
      const potentialName = lastWord.substring(0, i + 1);
      const remaining = lastWord.substring(i + 1);
      
      // Check if remaining part looks like it could be a username
      if (remaining.length >= 4 && remaining.toLowerCase() !== potentialName.toLowerCase()) {
        console.log(`Found potential split at index ${i + 1}, real last name: "${potentialName}"`);
        return potentialName;
      }
    }
  }
  
  // Fallback: return the whole word
  console.log(`No clear split found, returning whole word: "${lastWord}"`);
  return lastWord;
}

// Test cases
const tests = [
  "Instructors\nFrancoise Hamlinfrancoise_hamlin@brown.edu",
  "Instructors\nLisa Biggslisa_biggs@brown.edu",
  "Instructors\nJustin Langjustin_a_lang@brown.edu",
  "Instructors\nLisa Di Carlo Lisalisa_di_carlo@brown.edu"
];

tests.forEach((test, index) => {
  console.log(`=== Test ${index + 1} ===`);
  console.log(`Original: "${test}"`);
  const result = cleanInstructorName(test);
  console.log(`Result: "${result}"`);
  console.log();
}); 