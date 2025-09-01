/**
 * Subject to Department Mapper
 * Maps user input subjects to Brown University department codes
 * for precise course filtering in the chatbot
 */

const subjectToDepartmentMap = {
  // Computer Science variations
  'computer science': 'CSCI',
  'comp sci': 'CSCI',
  'cs': 'CSCI',
  'csci': 'CSCI',
  'programming': 'CSCI',
  'software': 'CSCI',
  'coding': 'CSCI',
  'algorithms': 'CSCI',
  'data structures': 'CSCI',
  'computer engineering': 'CSCI',
  
  // Mathematics variations
  'math': 'MATH',
  'mathematics': 'MATH',
  'calculus': 'MATH',
  'linear algebra': 'MATH',
  'statistics': 'MATH',
  'stat': 'MATH',
  'applied math': 'APMA',
  'applied mathematics': 'APMA',
  'apma': 'APMA',
  
  // Economics variations
  'economics': 'ECON',
  'econ': 'ECON',
  'finance': 'ECON',
  'business': 'ECON',
  'microeconomics': 'ECON',
  'macroeconomics': 'ECON',
  
  // Biology variations
  'biology': 'BIOL',
  'bio': 'BIOL',
  'life sciences': 'BIOL',
  'genetics': 'BIOL',
  'neuroscience': 'NEUR',
  'neur': 'NEUR',
  'biochemistry': 'BIOL',
  
  // Psychology variations
  'psychology': 'CLPS',
  'psych': 'CLPS',
  'cognitive': 'CLPS',
  'behavioral': 'CLPS',
  'neuroscience': 'NEUR',
  'brain': 'NEUR',
  
  // Physics variations
  'physics': 'PHYS',
  'physical sciences': 'PHYS',
  'mechanics': 'PHYS',
  'thermodynamics': 'PHYS',
  
  // Chemistry variations
  'chemistry': 'CHEM',
  'chem': 'CHEM',
  'organic chemistry': 'CHEM',
  'inorganic chemistry': 'CHEM',
  
  // Engineering variations
  'engineering': 'ENGN',
  'engn': 'ENGN',
  'mechanical': 'ENGN',
  'electrical': 'ENGN',
  'civil': 'ENGN',
  'biomedical': 'ENGN',
  
  // History variations
  'history': 'HIST',
  'historical': 'HIST',
  'hist': 'HIST',
  'american history': 'HIST',
  'world history': 'HIST',
  
  // English variations
  'english': 'ENGL',
  'literature': 'ENGL',
  'writing': 'ENGL',
  'engl': 'ENGL',
  'creative writing': 'ENGL',
  'poetry': 'ENGL',
  
  // Philosophy variations
  'philosophy': 'PHIL',
  'philosophical': 'PHIL',
  'ethics': 'PHIL',
  'phil': 'PHIL',
  'logic': 'PHIL',
  
  // Political Science variations
  'political science': 'POLS',
  'politics': 'POLS',
  'government': 'POLS',
  'pols': 'POLS',
  'international relations': 'INTL',
  'intl': 'INTL',
  
  // Sociology variations
  'sociology': 'SOC',
  'social': 'SOC',
  'society': 'SOC',
  'soc': 'SOC',
  
  // Anthropology variations
  'anthropology': 'ANTH',
  'cultural': 'ANTH',
  'human societies': 'ANTH',
  'anth': 'ANTH',
  
  // Africana Studies
  'africana': 'AFRI',
  'afri': 'AFRI',
  'african american': 'AFRI',
  'black studies': 'AFRI',
  
  // Art History
  'art history': 'HIAA',
  'hiaa': 'HIAA',
  'art': 'HIAA',
  'visual arts': 'HIAA',
  
  // Classics
  'classics': 'CLAS',
  'classical': 'CLAS',
  'greek': 'CLAS',
  'latin': 'CLAS',
  'clas': 'CLAS',
  
  // Comparative Literature
  'comparative literature': 'COLT',
  'colt': 'COLT',
  'world literature': 'COLT',
  
  // East Asian Studies
  'east asian': 'EAST',
  'east': 'EAST',
  'chinese': 'EAST',
  'japanese': 'EAST',
  'korean': 'EAST',
  
  // French Studies
  'french': 'FREN',
  'fren': 'FREN',
  'france': 'FREN',
  
  // German Studies
  'german': 'GRMN',
  'grmn': 'GRMN',
  'germany': 'GRMN',
  
  // Hispanic Studies
  'hispanic': 'HISP',
  'hisp': 'HISP',
  'spanish': 'HISP',
  'latin american': 'HISP',
  
  // Italian Studies
  'italian': 'ITAL',
  'ital': 'ITAL',
  'italy': 'ITAL',
  
  // Portuguese and Brazilian Studies
  'portuguese': 'POBS',
  'pobs': 'POBS',
  'brazil': 'POBS',
  
  // Slavic Studies
  'slavic': 'SLAV',
  'slav': 'SLAV',
  'russian': 'SLAV',
  
  // Theatre Arts and Performance Studies
  'theatre': 'TAPS',
  'taps': 'TAPS',
  'drama': 'TAPS',
  'performance': 'TAPS',
  'acting': 'TAPS',
  
  // Visual Arts
  'visual arts': 'VISA',
  'visa': 'VISA',
  'drawing': 'VISA',
  'painting': 'VISA',
  'sculpture': 'VISA',
  'photography': 'VISA',
  
  // Music
  'music': 'MUSC',
  'musc': 'MUSC',
  'composition': 'MUSC',
  'performance': 'MUSC',
  'theory': 'MUSC',
  
  // Religious Studies
  'religious studies': 'RELS',
  'religion': 'RELS',
  'rels': 'RELS',
  'theology': 'RELS',
  
  // Gender and Sexuality Studies
  'gender': 'GNSS',
  'gnss': 'GNSS',
  'women': 'GNSS',
  'feminism': 'GNSS',
  'sexuality': 'GNSS',
  
  // Environmental Studies
  'environmental': 'ENVS',
  'envs': 'ENVS',
  'ecology': 'ENVS',
  'climate': 'ENVS',
  'sustainability': 'ENVS',
  
  // Public Health
  'public health': 'PHP',
  'php': 'PHP',
  'health': 'PHP',
  'epidemiology': 'PHP',
  
  // Urban Studies
  'urban': 'URBN',
  'urbn': 'URBN',
  'city': 'URBN',
  'urban planning': 'URBN'
};

/**
 * Maps user input to department code
 * @param {string} userInput - User's input text
 * @returns {string|null} - Department code or null if no match
 */
function mapSubjectToDepartment(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }
  
  const lowerInput = userInput.toLowerCase().trim();
  
  // Direct match
  if (subjectToDepartmentMap[lowerInput]) {
    return subjectToDepartmentMap[lowerInput];
  }
  
  // Partial match - find the best match
  for (const [subject, department] of Object.entries(subjectToDepartmentMap)) {
    if (lowerInput.includes(subject) || subject.includes(lowerInput)) {
      return department;
    }
  }
  
  // Word-based matching for multi-word subjects
  const words = lowerInput.split(/\s+/);
  for (const word of words) {
    if (word.length > 2 && subjectToDepartmentMap[word]) {
      return subjectToDepartmentMap[word];
    }
  }
  
  return null;
}

/**
 * Gets all possible department codes for a given subject
 * @param {string} userInput - User's input text
 * @returns {string[]} - Array of department codes
 */
function getAllDepartmentsForSubject(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return [];
  }
  
  const lowerInput = userInput.toLowerCase().trim();
  const departments = new Set();
  
  for (const [subject, department] of Object.entries(subjectToDepartmentMap)) {
    if (lowerInput.includes(subject) || subject.includes(lowerInput)) {
      departments.add(department);
    }
  }
  
  return Array.from(departments);
}

/**
 * Checks if a subject maps to a specific department
 * @param {string} userInput - User's input text
 * @param {string} department - Department code to check
 * @returns {boolean} - True if the subject maps to the department
 */
function isSubjectInDepartment(userInput, department) {
  const mappedDepartment = mapSubjectToDepartment(userInput);
  return mappedDepartment === department;
}

module.exports = {
  mapSubjectToDepartment,
  getAllDepartmentsForSubject,
  isSubjectInDepartment,
  subjectToDepartmentMap
}; 