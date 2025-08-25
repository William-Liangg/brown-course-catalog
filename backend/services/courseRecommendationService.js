const { Pool } = require('pg');
require('dotenv').config();

class CourseRecommendationService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async getCourseRecommendations(major) {
    try {
      const majorMap = {
        'computer science': ['CSCI'],
        'math': ['MATH', 'APMA'],
        'economics': ['ECON'],
        'biology': ['BIOL'],
        'psychology': ['CLPS', 'PSYC']
      };

      const majorLower = major.toLowerCase();
      const coursePrefixes = majorMap[majorLower];

      if (!coursePrefixes) {
        return {
          success: false,
          error: 'Major not supported'
        };
      }

      // Build the WHERE clause for multiple prefixes
      const whereClause = coursePrefixes.map(prefix => `code LIKE '${prefix}%'`).join(' OR ');

      const query = `
        SELECT code, name, description, professor, days, start_time, end_time, location
        FROM courses 
        WHERE ${whereClause}
        ORDER BY 
          CASE 
            WHEN code LIKE '%000%' OR code LIKE '%100%' THEN 1
            WHEN code LIKE '%200%' OR code LIKE '%300%' THEN 2
            ELSE 3
          END,
          code
        LIMIT 10
      `;

      const result = await this.pool.query(query);
      
      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'No courses found for this major'
        };
      }

      // Group courses by level
      const introCourses = result.rows.filter(course => 
        course.code.match(/\d{4}/) && 
        parseInt(course.code.match(/\d{4}/)[0]) < 1000
      ).slice(0, 4);

      const intermediateCourses = result.rows.filter(course => 
        course.code.match(/\d{4}/) && 
        parseInt(course.code.match(/\d{4}/)[0]) >= 1000 && 
        parseInt(course.code.match(/\d{4}/)[0]) < 2000
      ).slice(0, 3);

      const advancedCourses = result.rows.filter(course => 
        course.code.match(/\d{4}/) && 
        parseInt(course.code.match(/\d{4}/)[0]) >= 2000
      ).slice(0, 3);

      // Format recommendations
      const recommendations = [];
      
      if (introCourses.length > 0) {
        recommendations.push('**Introductory Courses:**');
        introCourses.forEach(course => {
          recommendations.push(`- **${course.code}**: ${course.name}`);
        });
        recommendations.push('');
      }

      if (intermediateCourses.length > 0) {
        recommendations.push('**Intermediate Courses:**');
        intermediateCourses.forEach(course => {
          recommendations.push(`- **${course.code}**: ${course.name}`);
        });
        recommendations.push('');
      }

      if (advancedCourses.length > 0) {
        recommendations.push('**Advanced Courses:**');
        advancedCourses.forEach(course => {
          recommendations.push(`- **${course.code}**: ${course.name}`);
        });
      }

      return {
        success: true,
        data: {
          courses: result.rows,
          recommendations: recommendations.join('\n'),
          totalCourses: result.rows.length,
          major: major,
          source: 'Brown University Course Database'
        }
      };

    } catch (error) {
      console.error('Error getting course recommendations:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  async getPopularCourses(major) {
    try {
      const majorMap = {
        'computer science': ['CSCI'],
        'math': ['MATH', 'APMA'],
        'economics': ['ECON'],
        'biology': ['BIOL'],
        'psychology': ['CLPS', 'PSYC']
      };

      const majorLower = major.toLowerCase();
      const coursePrefixes = majorMap[majorLower];

      if (!coursePrefixes) {
        return {
          success: false,
          error: 'Major not supported'
        };
      }

      const whereClause = coursePrefixes.map(prefix => `code LIKE '${prefix}%'`).join(' OR ');

      // Get courses with professors (more likely to be regularly offered)
      const query = `
        SELECT code, name, professor, days, start_time, end_time
        FROM courses 
        WHERE (${whereClause}) AND professor != 'TBD' AND professor != 'TBA'
        ORDER BY 
          CASE 
            WHEN code LIKE '%000%' OR code LIKE '%100%' THEN 1
            WHEN code LIKE '%200%' OR code LIKE '%300%' THEN 2
            ELSE 3
          END,
          code
        LIMIT 8
      `;

      const result = await this.pool.query(query);
      
      return {
        success: true,
        data: {
          courses: result.rows,
          totalCourses: result.rows.length,
          major: major
        }
      };

    } catch (error) {
      console.error('Error getting popular courses:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  async searchCourses(searchTerm) {
    try {
      const query = `
        SELECT code, name, description, professor, days, start_time, end_time, location
        FROM courses 
        WHERE 
          LOWER(name) LIKE LOWER($1) OR 
          LOWER(code) LIKE LOWER($1) OR 
          LOWER(description) LIKE LOWER($1)
        ORDER BY code
        LIMIT 15
      `;

      const result = await this.pool.query(query, [`%${searchTerm}%`]);
      
      return {
        success: true,
        data: {
          courses: result.rows,
          totalCourses: result.rows.length,
          searchTerm: searchTerm
        }
      };

    } catch (error) {
      console.error('Error searching courses:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }
}

module.exports = new CourseRecommendationService(); 