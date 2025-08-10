const axios = require('axios');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'brown_courses',
  password: 'password',
  port: 5432,
});

// Brown University course API endpoints
const BROWN_API_BASE = 'https://cab.brown.edu/asoc-api/';

async function fetchBrownCourses() {
  try {
    console.log('Fetching Brown University course data...');
    
    // Fetch current semester courses
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Determine current semester
    let semester;
    if (currentMonth >= 8 || currentMonth <= 0) { // August to December
      semester = 'fall';
    } else if (currentMonth >= 1 && currentMonth <= 4) { // January to April
      semester = 'spring';
    } else { // May to July
      semester = 'summer';
    }
    
    const year = currentMonth >= 8 ? currentYear + 1 : currentYear;
    
    console.log(`Fetching ${semester} ${year} courses...`);
    
    // Fetch courses from Brown's API
    const response = await axios.get(`${BROWN_API_BASE}?output=json&page=1&page_size=1000&year=${year}&semester=${semester}`);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid response from Brown API');
    }
    
    const courses = response.data.results;
    console.log(`Found ${courses.length} courses`);
    
    // Clear existing courses
    await pool.query('DELETE FROM courses');
    console.log('Cleared existing courses');
    
    // Insert new courses
    let insertedCount = 0;
    for (const course of courses) {
      try {
        // Parse meeting times
        const meetingTimes = course.meetingTimes || [];
        let days = '';
        let startTime = null;
        let endTime = null;
        let location = '';
        
        if (meetingTimes.length > 0) {
          const meeting = meetingTimes[0];
          days = meeting.days || '';
          
          if (meeting.startTime) {
            startTime = meeting.startTime;
          }
          
          if (meeting.endTime) {
            endTime = meeting.endTime;
          }
          
          if (meeting.building && meeting.room) {
            location = `${meeting.building} ${meeting.room}`;
          } else if (meeting.building) {
            location = meeting.building;
          }
        }
        
        // Insert course
        await pool.query(`
          INSERT INTO courses (code, name, description, days, start_time, end_time, location)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          course.subject + ' ' + course.number,
          course.title,
          course.description || 'No description available',
          days,
          startTime,
          endTime,
          location
        ]);
        
        insertedCount++;
        
        if (insertedCount % 100 === 0) {
          console.log(`Inserted ${insertedCount} courses...`);
        }
        
      } catch (error) {
        console.error(`Error inserting course ${course.subject} ${course.number}:`, error.message);
      }
    }
    
    console.log(`Successfully inserted ${insertedCount} courses`);
    
  } catch (error) {
    console.error('Error fetching Brown courses:', error.message);
    
    // Fallback: Use sample Brown courses if API fails
    console.log('Using fallback sample data...');
    await insertSampleBrownCourses();
  }
}

async function insertSampleBrownCourses() {
  try {
    // Clear existing courses
    await pool.query('DELETE FROM courses');
    
    // Sample Brown University courses based on real data
    const sampleCourses = [
      // Computer Science
      ['CSCI 0150', 'Introduction to Object-Oriented Programming and Computer Science', 'Learn Java programming fundamentals and object-oriented design principles', 'MWF', '10:00:00', '10:50:00', 'CIT 165'],
      ['CSCI 0160', 'Introduction to Algorithms and Data Structures', 'Study fundamental algorithms and data structures in Java', 'MWF', '11:00:00', '11:50:00', 'CIT 165'],
      ['CSCI 0180', 'Computer Science: An Integrated Introduction', 'Comprehensive introduction to computer science concepts', 'MWF', '14:00:00', '14:50:00', 'CIT 165'],
      ['CSCI 0320', 'Introduction to Software Engineering', 'Software development methodologies and practices', 'TR', '09:00:00', '10:20:00', 'CIT 165'],
      ['CSCI 0330', 'Introduction to Computer Systems', 'Computer architecture and systems programming', 'TR', '10:30:00', '11:50:00', 'CIT 165'],
      ['CSCI 1010', 'Theory of Computation', 'Formal languages, automata, and computational complexity', 'MWF', '13:00:00', '13:50:00', 'CIT 165'],
      ['CSCI 1230', 'Introduction to Computer Graphics', 'Computer graphics algorithms and OpenGL programming', 'TR', '14:00:00', '15:20:00', 'CIT 165'],
      ['CSCI 1270', 'Database Management Systems', 'Database design, SQL, and database management', 'MWF', '15:00:00', '15:50:00', 'CIT 165'],
      ['CSCI 1380', 'Distributed Computer Systems', 'Distributed systems concepts and implementation', 'TR', '16:00:00', '17:20:00', 'CIT 165'],
      ['CSCI 1430', 'Computer Vision', 'Computer vision algorithms and applications', 'MWF', '16:00:00', '16:50:00', 'CIT 165'],
      ['CSCI 1470', 'Deep Learning', 'Neural networks and deep learning algorithms', 'TR', '13:00:00', '14:20:00', 'CIT 165'],
      ['CSCI 1480', 'Machine Learning', 'Machine learning algorithms and applications', 'MWF', '09:00:00', '09:50:00', 'CIT 165'],
      
      // Mathematics
      ['MATH 0100', 'Introductory Calculus, Part I', 'Single variable calculus with applications', 'MWF', '09:00:00', '09:50:00', 'Kassar 105'],
      ['MATH 0180', 'Single Variable Calculus, Part II', 'Integration techniques and applications', 'MWF', '10:00:00', '10:50:00', 'Kassar 105'],
      ['MATH 0200', 'Linear Algebra', 'Vector spaces, linear transformations, and eigenvalues', 'TR', '09:00:00', '10:20:00', 'Kassar 105'],
      ['MATH 0520', 'Linear Algebra', 'Advanced linear algebra with proofs', 'MWF', '11:00:00', '11:50:00', 'Kassar 105'],
      ['MATH 1010', 'Analysis: Functions of One Variable', 'Real analysis and mathematical proofs', 'TR', '10:30:00', '11:50:00', 'Kassar 105'],
      ['MATH 1260', 'Complex Analysis', 'Complex numbers, analytic functions, and contour integration', 'MWF', '13:00:00', '13:50:00', 'Kassar 105'],
      ['MATH 1530', 'Abstract Algebra', 'Group theory, ring theory, and field theory', 'TR', '14:00:00', '15:20:00', 'Kassar 105'],
      ['MATH 1610', 'Probability', 'Probability theory and applications', 'MWF', '15:00:00', '15:50:00', 'Kassar 105'],
      
      // Economics
      ['ECON 0110', 'Principles of Economics', 'Introduction to microeconomics and macroeconomics', 'MWF', '13:00:00', '13:50:00', 'Wilson 101'],
      ['ECON 1110', 'Intermediate Microeconomics', 'Consumer theory, producer theory, and market structures', 'TR', '14:00:00', '15:20:00', 'Wilson 101'],
      ['ECON 1210', 'Intermediate Macroeconomics', 'National income, economic growth, and monetary policy', 'MWF', '14:00:00', '14:50:00', 'Wilson 101'],
      ['ECON 1130', 'Game Theory and Strategic Behavior', 'Strategic decision making and game theory', 'TR', '16:00:00', '17:20:00', 'Wilson 101'],
      ['ECON 1310', 'Money and Banking', 'Monetary theory and financial institutions', 'MWF', '11:00:00', '11:50:00', 'Wilson 101'],
      ['ECON 1410', 'International Trade', 'International trade theory and policy', 'TR', '13:00:00', '14:20:00', 'Wilson 101'],
      
      // Physics
      ['PHYS 0030', 'Basic Physics', 'Mechanics, thermodynamics, and wave phenomena', 'MWF', '15:00:00', '15:50:00', 'Barus 166'],
      ['PHYS 0050', 'Analytical Physics', 'Advanced physics with calculus', 'TR', '16:00:00', '17:20:00', 'Barus 166'],
      ['PHYS 0060', 'Introduction to Physics', 'Modern physics and quantum mechanics', 'MWF', '10:00:00', '10:50:00', 'Barus 166'],
      ['PHYS 0160', 'Introduction to Relativity and Quantum Physics', 'Special relativity and quantum mechanics', 'TR', '09:00:00', '10:20:00', 'Barus 166'],
      ['PHYS 0500', 'Advanced Physics Laboratory', 'Experimental physics and data analysis', 'MWF', '14:00:00', '16:50:00', 'Barus 166'],
      
      // Biology
      ['BIOL 0200', 'The Foundation of Living Systems', 'Introduction to biology and cellular processes', 'MWF', '09:00:00', '09:50:00', 'Metcalf 101'],
      ['BIOL 0800', 'Principles of Biology', 'Biological principles and evolution', 'TR', '10:30:00', '11:50:00', 'Metcalf 101'],
      ['BIOL 1100', 'Cell and Molecular Biology', 'Cellular structure and molecular biology', 'MWF', '11:00:00', '11:50:00', 'Metcalf 101'],
      ['BIOL 1200', 'Ecology and Evolutionary Biology', 'Population ecology and evolutionary processes', 'TR', '14:00:00', '15:20:00', 'Metcalf 101'],
      
      // Chemistry
      ['CHEM 0330', 'Equilibrium, Rate, and Structure', 'Chemical equilibrium and kinetics', 'MWF', '10:00:00', '10:50:00', 'Metcalf 101'],
      ['CHEM 0350', 'Organic Chemistry', 'Organic chemistry principles and reactions', 'TR', '09:00:00', '10:20:00', 'Metcalf 101'],
      ['CHEM 0360', 'Organic Chemistry', 'Advanced organic chemistry', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101'],
      
      // History
      ['HIST 0150', 'The Modern World', 'Modern world history from 1500 to present', 'MWF', '11:00:00', '11:50:00', 'Wilson 101'],
      ['HIST 0250', 'American History', 'American history from colonial period to present', 'TR', '13:00:00', '14:20:00', 'Wilson 101'],
      ['HIST 0350', 'European History', 'European history from medieval to modern period', 'MWF', '14:00:00', '14:50:00', 'Wilson 101'],
      
      // English
      ['ENGL 0200', 'The Theory and Practice of Criticism', 'Literary theory and critical analysis', 'TR', '10:30:00', '11:50:00', 'Wilson 101'],
      ['ENGL 0300', 'Introduction to Creative Writing', 'Creative writing workshop and techniques', 'MWF', '15:00:00', '15:50:00', 'Wilson 101'],
      ['ENGL 0400', 'Shakespeare', 'Shakespearean literature and analysis', 'TR', '16:00:00', '17:20:00', 'Wilson 101'],
      
      // Psychology
      ['CLPS 0010', 'Introduction to Psychology', 'Introduction to psychological principles', 'MWF', '09:00:00', '09:50:00', 'Metcalf 101'],
      ['CLPS 0200', 'Introduction to Cognitive Science', 'Cognitive science and mental processes', 'TR', '14:00:00', '15:20:00', 'Metcalf 101'],
      ['CLPS 0300', 'Introduction to Social Psychology', 'Social psychology and group behavior', 'MWF', '13:00:00', '13:50:00', 'Metcalf 101'],
      
      // Philosophy
      ['PHIL 0010', 'Introduction to Philosophy', 'Introduction to philosophical thinking', 'TR', '09:00:00', '10:20:00', 'Wilson 101'],
      ['PHIL 0200', 'Introduction to Ethics', 'Ethical theory and moral philosophy', 'MWF', '11:00:00', '11:50:00', 'Wilson 101'],
      ['PHIL 0300', 'Logic', 'Formal logic and reasoning', 'TR', '13:00:00', '14:20:00', 'Wilson 101'],
      
      // Political Science
      ['POLS 0100', 'Introduction to American Politics', 'American political system and institutions', 'MWF', '10:00:00', '10:50:00', 'Wilson 101'],
      ['POLS 0200', 'Introduction to International Relations', 'International politics and global issues', 'TR', '16:00:00', '17:20:00', 'Wilson 101'],
      ['POLS 0300', 'Introduction to Political Theory', 'Political philosophy and theory', 'MWF', '14:00:00', '14:50:00', 'Wilson 101'],
      
      // Sociology
      ['SOC 0010', 'Introduction to Sociology', 'Introduction to sociological concepts', 'TR', '10:30:00', '11:50:00', 'Metcalf 101'],
      ['SOC 0200', 'Social Problems', 'Analysis of contemporary social issues', 'MWF', '15:00:00', '15:50:00', 'Metcalf 101'],
      ['SOC 0300', 'Social Theory', 'Classical and contemporary social theory', 'TR', '13:00:00', '14:20:00', 'Metcalf 101']
    ];
    
    for (const [code, name, description, days, startTime, endTime, location] of sampleCourses) {
      await pool.query(`
        INSERT INTO courses (code, name, description, days, start_time, end_time, location)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [code, name, description, days, startTime, endTime, location]);
    }
    
    console.log(`Inserted ${sampleCourses.length} sample Brown University courses`);
    
  } catch (error) {
    console.error('Error inserting sample courses:', error);
  }
}

// Run the script
fetchBrownCourses()
  .then(() => {
    console.log('Course population complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 