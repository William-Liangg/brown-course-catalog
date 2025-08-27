const express = require('express');
const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/ai-recommend
router.post('/ai-recommend', async (req, res) => {
  try {
    const { major, interests } = req.body;

    console.log(`AI recommendation request for major: ${major}, interests: ${interests}`);

    // Generate embedding for the query
    let queryEmbedding;
    try {
      const queryText = `${major}: ${interests}`;
      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: queryText,
        encoding_format: 'float'
      });
      queryEmbedding = embeddingResponse.data[0].embedding;
    } catch (embeddingError) {
      console.error('Failed to generate query embedding:', embeddingError);
      return res.status(500).json({
        error: 'Failed to process query'
      });
    }

    // Fetch semantically similar courses using vector search
    let courses;
    try {
      const query = `
        SELECT id, code, name as title, description 
        FROM courses 
        WHERE embedding IS NOT NULL
        ORDER BY embedding <-> $1
        LIMIT 15
      `;
      
      const result = await pool.query(query, [JSON.stringify(queryEmbedding)]);
      courses = result.rows;
      
      if (courses.length === 0) {
        return res.status(404).json({
          error: 'No courses found in database'
        });
      }
    } catch (dbError) {
      console.error('Vector search failed:', dbError);
      return res.status(500).json({
        error: 'Failed to search courses'
      });
    }

    // Build course catalog context string
    const courseCatalog = courses.map(course => {
      const description = course.description ? course.description.substring(0, 200) + '...' : 'No description available';
      return `${course.code}: ${course.title} — ${description}`;
    }).join('\n');

    // Prepare OpenAI request
    const systemPrompt = `You are an academic advisor at Brown University. Recommend only real courses from the provided catalog. 
Respond strictly in JSON array format: 
[{ "code": "...", "title": "...", "reason": "..." }]

Important:
- Only recommend courses that exist in the provided catalog
- Provide 3-5 most relevant recommendations from the top 15 semantically similar courses
- Give specific reasons why each course matches the user's interests and major
- Use the exact course codes and titles from the catalog
- Focus on courses that best align with the student's specific interests`;

    const userPrompt = `Student major: ${major}
Student interests: ${interests}

Top 15 most semantically similar courses from Brown's database:
${courseCatalog}

Please recommend 3-5 courses that would be the best fit for this student based on their major and specific interests. Focus on courses that most closely match their academic goals.`;

    // Make OpenAI API call
    let aiResponse;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      aiResponse = completion.choices[0].message.content;
    } catch (openaiError) {
      console.error('OpenAI API call failed:', openaiError);
      return res.status(500).json({
        error: 'AI recommendation service unavailable'
      });
    }

    // Parse AI response safely
    let recommendations;
    try {
      // Clean the response - remove any markdown formatting
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recommendations = JSON.parse(cleanedResponse);
      
      // Validate the response structure
      if (!Array.isArray(recommendations)) {
        throw new Error('AI response is not an array');
      }
      
      // Validate each recommendation has required fields
      recommendations.forEach((rec, index) => {
        if (!rec.code || !rec.title || !rec.reason) {
          throw new Error(`Invalid recommendation structure at index ${index}`);
        }
      });
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', aiResponse);
      return res.status(500).json({
        error: 'AI recommendation failed - invalid response format'
      });
    }

    // Return successful response
    res.json({
      recommendations: recommendations,
      totalCourses: courses.length,
      major: major,
      interests: interests,
      searchMethod: 'semantic_vector_search'
    });

  } catch (error) {
    console.error('Unexpected error in AI recommendation:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /api/ai-recommend/health - Health check endpoint
router.get('/ai-recommend/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    
    // Test OpenAI connection (optional - you might want to remove this to avoid API calls on health check)
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o-mini',
    //   messages: [{ role: 'user', content: 'Hello' }],
    //   max_tokens: 5
    // });
    
    res.json({
      status: 'healthy',
      database: 'connected',
      openai: 'configured'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router; 