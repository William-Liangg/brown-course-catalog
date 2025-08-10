const axios = require('axios');

// Brown University's official course catalog API
const BROWN_API_BASE = 'https://cab.brown.edu/asoc-api/';

async function fetchRealBrownCourses() {
  try {
    console.log('Fetching real Brown University course data...');
    
    // Get current academic year and semester
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Determine current semester (Brown's academic calendar)
    let semester;
    if (currentMonth >= 8 || currentMonth <= 0) { // August to December
      semester = 'fall';
    } else if (currentMonth >= 1 && currentMonth <= 4) { // January to April
      semester = 'spring';
    } else { // May to July
      semester = 'summer';
    }
    
    const year = currentMonth >= 8 ? currentYear + 1 : currentYear;
    
    console.log(`Fetching ${semester} ${year} courses from Brown's official API...`);
    
    // Fetch courses from Brown's official API
    const response = await axios.get(`${BROWN_API_BASE}?output=json&page=1&page_size=2000&year=${year}&semester=${semester}`);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid response from Brown API');
    }
    
    const courses = response.data.results;
    console.log(`Found ${courses.length} real courses from Brown University`);
    
    // Generate SQL insert statements for real courses
    let sqlStatements = [];
    let courseCount = 0;
    
    for (const course of courses) {
      try {
        // Parse meeting times from Brown's data structure
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
        
        // Create course code from subject and number
        const courseCode = `${course.subject} ${course.number}`;
        
        // Generate SQL insert statement
        const sql = `INSERT INTO courses (code, name, description, days, start_time, end_time, location) VALUES ('${courseCode.replace(/'/g, "''")}', '${course.title.replace(/'/g, "''")}', '${(course.description || 'No description available').replace(/'/g, "''")}', '${days}', ${startTime ? `'${startTime}'` : 'NULL'}, ${endTime ? `'${endTime}'` : 'NULL'}, '${location.replace(/'/g, "''")}');`;
        
        sqlStatements.push(sql);
        courseCount++;
        
        if (courseCount % 100 === 0) {
          console.log(`Processed ${courseCount} courses...`);
        }
        
      } catch (error) {
        console.error(`Error processing course ${course.subject} ${course.number}:`, error.message);
      }
    }
    
    // Write SQL file
    const fs = require('fs');
    const sqlContent = `-- Real Brown University Courses for ${semester} ${year}
-- Generated from Brown's official course catalog API
-- Total courses: ${courseCount}

-- Clear existing courses
DELETE FROM courses;

-- Insert real Brown University courses
${sqlStatements.join('\n')}

-- End of Brown University course data
`;

    fs.writeFileSync('backend/sql/real_brown_courses.sql', sqlContent);
    console.log(`\n✅ Successfully generated SQL file with ${courseCount} real Brown University courses!`);
    console.log('📁 File saved as: backend/sql/real_brown_courses.sql');
    console.log('\nTo apply these courses to your database, run:');
    console.log('psql -U postgres -d brown_courses -f backend/sql/real_brown_courses.sql');
    
    // Also display first few courses as preview
    console.log('\n📚 Sample of real courses found:');
    courses.slice(0, 10).forEach(course => {
      console.log(`  • ${course.subject} ${course.number}: ${course.title}`);
    });
    
    if (courses.length > 10) {
      console.log(`  ... and ${courses.length - 10} more courses`);
    }
    
  } catch (error) {
    console.error('❌ Error fetching Brown courses:', error.message);
    
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
    }
    
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Check if Brown\'s API is accessible');
    console.log('2. Verify the API endpoint is correct');
    console.log('3. Check if there are rate limiting issues');
  }
}

// Run the script
fetchRealBrownCourses()
  .then(() => {
    console.log('\n🎓 Course fetching complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  }); 