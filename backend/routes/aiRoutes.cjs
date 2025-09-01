const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory session storage (in production, use Redis or database)
const sessionContexts = new Map();

// Helper function to get session context
const getSessionContext = (sessionId) => {
  if (!sessionContexts.has(sessionId)) {
    sessionContexts.set(sessionId, {
      major: null,
      interests: [],
      previousMessages: [],
      userPreferences: {},
      conversationHistory: []
    });
  }
  return sessionContexts.get(sessionId);
};

// Helper function to update session context
const updateSessionContext = (sessionId, updates) => {
  const context = getSessionContext(sessionId);
  Object.assign(context, updates);
  sessionContexts.set(sessionId, context);
};

// Helper function to extract major from text
const extractMajor = (text) => {
  const majorKeywords = {
    'computer science': ['computer science', 'cs', 'csci', 'programming', 'software', 'coding', 'algorithms', 'data structures'],
    'mathematics': ['math', 'mathematics', 'calculus', 'linear algebra', 'statistics'],
    'economics': ['economics', 'econ', 'finance', 'business'],
    'biology': ['biology', 'bio', 'life sciences', 'genetics'],
    'psychology': ['psychology', 'psych', 'psychology', 'cognitive', 'behavioral'],
    'physics': ['physics', 'physical sciences'],
    'chemistry': ['chemistry', 'chem'],
    'engineering': ['engineering', 'mechanical', 'electrical', 'civil'],
    'history': ['history', 'historical'],
    'english': ['english', 'literature', 'writing'],
    'philosophy': ['philosophy', 'philosophical', 'ethics'],
    'political science': ['political science', 'politics', 'government'],
    'sociology': ['sociology', 'social', 'society'],
    'anthropology': ['anthropology', 'cultural', 'human societies']
  };

  const lowerText = text.toLowerCase();
  for (const [major, keywords] of Object.entries(majorKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return major;
    }
  }
  return null;
};

// Helper function to get relevant courses by major
const getRelevantCoursesByMajor = async (major) => {
  const majorCourseMappings = {
    'computer science': ['CSCI', 'APMA', 'ENGN'],
    'mathematics': ['MATH', 'APMA', 'STAT'],
    'economics': ['ECON', 'POLS'],
    'biology': ['BIOL', 'NEUR'],
    'psychology': ['CLPS', 'PSYC'],
    'physics': ['PHYS'],
    'chemistry': ['CHEM'],
    'engineering': ['ENGN', 'APMA'],
    'history': ['HIST'],
    'english': ['ENGL', 'LITR'],
    'philosophy': ['PHIL'],
    'political science': ['POLS', 'INTL'],
    'sociology': ['SOC'],
    'anthropology': ['ANTH']
  };

  const coursePrefixes = majorCourseMappings[major] || [];
  if (coursePrefixes.length === 0) return [];

  const query = `
    SELECT code, name, description, professor, days, start_time, end_time, location
    FROM courses 
    WHERE ${coursePrefixes.map(prefix => `code LIKE '${prefix}%'`).join(' OR ')}
    ORDER BY code
    LIMIT 50
  `;

  const result = await pool.query(query);
  return result.rows;
};

// Helper function to validate course responses against real database
const validateCourseResponse = async (response, relevantCourses) => {
  // Extract any course codes mentioned in the response (e.g., CSCI 0150, MATH 0090)
  const courseCodePattern = /([A-Z]{2,4}\s+\d{4})/g;
  const mentionedCourses = response.match(courseCodePattern) || [];
  
  // Check if any mentioned courses don't exist in our database
  const invalidCourses = mentionedCourses.filter(code => {
    return !relevantCourses.some(course => course.code === code);
  });
  
  if (invalidCourses.length > 0) {
    console.log(`⚠️ AI mentioned invalid courses: ${invalidCourses.join(', ')}`);
    // Replace invalid course mentions with a generic message
    let sanitizedResponse = response;
    invalidCourses.forEach(code => {
      sanitizedResponse = sanitizedResponse.replace(
        new RegExp(code, 'g'), 
        'a course in our catalog'
      );
    });
    return sanitizedResponse;
  }
  
  return response;
};

// AI-powered course recommendations with enhanced context
router.post('/ai-recommend', async (req, res) => {
  try {
    const { major, interests, sessionId = 'default' } = req.body;
    
    if (!interests) {
      return res.status(400).json({ error: 'Interests are required' });
    }

    console.log(`🤖 AI recommendation request for major: ${major}, interests: ${interests}, session: ${sessionId}`);

    // Get or create session context
    const context = getSessionContext(sessionId);
    
    // Update context with new information
    const detectedMajor = major || extractMajor(interests) || context.major;
    updateSessionContext(sessionId, {
      major: detectedMajor,
      interests: [...new Set([...context.interests, interests])],
      conversationHistory: [...context.conversationHistory, { type: 'user', content: interests }]
    });

    // Get relevant courses based on major
    let relevantCourses = [];
    if (detectedMajor) {
      relevantCourses = await getRelevantCoursesByMajor(detectedMajor);
    }

    // If no relevant courses found, get some general courses
    if (relevantCourses.length === 0) {
      const generalResult = await pool.query('SELECT code, name, description FROM courses ORDER BY code LIMIT 30');
      relevantCourses = generalResult.rows;
    }

    // Check if OpenAI API key is configured or if we want to force database-only mode
    const forceDatabaseOnly = process.env.FORCE_DATABASE_ONLY === 'true';
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here' || process.env.OPENAI_API_KEY === 'sk-dummy-key-for-local-development' || forceDatabaseOnly) {
      console.log('🔒 Using database-only mode for recommendations - no AI responses');
      
      // Enhanced database-only recommendations with major-specific filtering
      const interestKeywords = interests.toLowerCase().split(' ');
      const recommendations = relevantCourses
        .filter(course => 
          interestKeywords.some(keyword => 
            course.name.toLowerCase().includes(keyword) || 
            (course.description && course.description.toLowerCase().includes(keyword)) ||
            course.code.toLowerCase().includes(keyword)
          )
        )
        .slice(0, 5)
        .map(course => ({
          code: course.code,
          title: course.name,
          reason: `This course matches your interests in ${interests} and aligns with your ${detectedMajor || 'academic'} goals. This is a real course from our Brown University database.`,
          confidence: 'high'
        }));

      if (recommendations.length === 0) {
        const generalRecommendations = relevantCourses.slice(0, 3).map(course => ({
          code: course.code,
          title: course.name,
          reason: `Here's a great ${detectedMajor || 'introductory'} course that might interest you! This is a real course from our Brown University database.`,
          confidence: 'medium'
        }));
        
        return res.json({ recommendations: generalRecommendations, context: { major: detectedMajor } });
      }

      return res.json({ recommendations, context: { major: detectedMajor } });
    }

    // Use OpenAI for intelligent recommendations
    try {
      // Build course catalog context string
      const courseCatalog = relevantCourses.map(course => {
        const description = course.description ? course.description.substring(0, 150) + '...' : 'No description available';
        return `${course.code}: ${course.name} — ${description}`;
      }).join('\n');

      // Enhanced system prompt with domain knowledge
      const systemPrompt = `You are an expert academic advisor at Brown University with deep knowledge of the course catalog and academic requirements.

DOMAIN KNOWLEDGE:
- Brown University uses course codes like CSCI (Computer Science), MATH (Mathematics), ECON (Economics), etc.
- Course levels: 0000-0999 (introductory), 1000-1999 (intermediate), 2000+ (advanced)
- Popular CS courses: CSCI 0150 (Intro to OOP), CSCI 0160 (Data Structures), CSCI 0320 (Software Engineering)
- Popular Math courses: MATH 0090 (Calculus I), MATH 0100 (Calculus II), MATH 0520 (Linear Algebra)

IMPORTANT RULES:
1. ONLY recommend courses that exist in the provided catalog
2. Prioritize courses that match the student's major and interests
3. Provide 3-5 most relevant recommendations
4. Give specific, detailed reasons why each course matches their interests
5. Use the exact course codes and titles from the catalog
6. If the student mentions computer science, prioritize CSCI and APMA courses
7. If unsure about a course, don't recommend it
8. Be enthusiastic but accurate
9. Consider course level appropriateness (intro vs advanced)

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "code": "CSCI 1650",
      "title": "Software Engineering",
      "reason": "This course is perfect for you because...",
      "confidence": "high"
    }
  ],
  "context": {
    "major": "computer science",
    "suggestedNextSteps": "Consider also looking at..."
  }
}`;

      const userPrompt = `Student major: ${detectedMajor || 'Not specified'}
Student interests: ${interests}
Previous interests: ${context.interests.join(', ')}
Session context: ${context.conversationHistory.length} previous messages

Available relevant courses from Brown's database:
${courseCatalog}

Please recommend 3-5 courses that would be the best fit for this student based on their major, current interests, and previous conversation context. Focus on courses that most closely match their academic goals and provide specific reasons for each recommendation.`;

      // Make OpenAI API call
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiResponse = completion.choices[0].message.content;
      
      // Parse AI response safely and validate against real courses
      let recommendations = [];
      let contextInfo = {};
      try {
        // Clean the response - remove any markdown formatting
        const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedResponse);
        const aiRecommendations = parsed.recommendations || [];
        contextInfo = parsed.context || {};
        
        // STRICT VALIDATION: Only return courses that actually exist in our database
        recommendations = aiRecommendations
          .filter(rec => {
            // Find the exact course in our database
            const realCourse = relevantCourses.find(course => 
              course.code === rec.code && course.name === rec.title
            );
            return realCourse !== undefined;
          })
          .map(rec => {
            // Get the real course data from our database
            const realCourse = relevantCourses.find(course => 
              course.code === rec.code && course.name === rec.title
            );
            return {
              code: realCourse.code,
              title: realCourse.name,
              reason: rec.reason || `This course matches your interests in ${interests}.`,
              confidence: 'high'
            };
          });
        
        // If AI hallucinated too many fake courses, fall back to keyword-based recommendations
        if (recommendations.length < 2) {
          console.log('⚠️ AI returned too few valid courses, using fallback system');
          const interestKeywords = interests.toLowerCase().split(' ');
          recommendations = relevantCourses
            .filter(course => 
              interestKeywords.some(keyword => 
                course.name.toLowerCase().includes(keyword) || 
                (course.description && course.description.toLowerCase().includes(keyword)) ||
                course.code.toLowerCase().includes(keyword)
              )
            )
            .slice(0, 5)
            .map(course => ({
              code: course.code,
              title: course.name,
              reason: `This course matches your interests in ${interests}.`,
              confidence: 'medium'
            }));
        }
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.log('Raw AI response:', aiResponse);
        
        // Fallback to keyword-based recommendations
        const interestKeywords = interests.toLowerCase().split(' ');
        recommendations = relevantCourses
          .filter(course => 
            interestKeywords.some(keyword => 
              course.name.toLowerCase().includes(keyword) || 
              (course.description && course.description.toLowerCase().includes(keyword)) ||
              course.code.toLowerCase().includes(keyword)
            )
          )
          .slice(0, 5)
          .map(course => ({
            code: course.code,
            title: course.name,
            reason: `This course matches your interests in ${interests}.`,
            confidence: 'medium'
          }));
      }

      // Update session with bot response
      updateSessionContext(sessionId, {
        conversationHistory: [...context.conversationHistory, { type: 'bot', content: 'Provided course recommendations' }]
      });

      console.log(`✅ AI generated ${recommendations.length} recommendations for ${detectedMajor}`);
      res.json({ recommendations, context: { major: detectedMajor, ...contextInfo } });

    } catch (openaiError) {
      console.error('OpenAI API call failed:', openaiError);
      
      // Enhanced fallback with major-specific filtering
      const interestKeywords = interests.toLowerCase().split(' ');
      const recommendations = relevantCourses
        .filter(course => 
          interestKeywords.some(keyword => 
            course.name.toLowerCase().includes(keyword) || 
            (course.description && course.description.toLowerCase().includes(keyword)) ||
            course.code.toLowerCase().includes(keyword)
          )
        )
        .slice(0, 5)
        .map(course => ({
          code: course.code,
          title: course.name,
          reason: `This course matches your interests in ${interests}.`,
          confidence: 'medium'
        }));

      res.json({ recommendations, context: { major: detectedMajor } });
    }

  } catch (error) {
    console.error('❌ Error generating AI recommendations:', error);
    res.status(500).json({ error: 'Failed to generate course recommendations' });
  }
});

// Enhanced chat endpoint with context management
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get session context
    const context = getSessionContext(sessionId);
    
    // Update context with new message
    updateSessionContext(sessionId, {
      conversationHistory: [...context.conversationHistory, { type: 'user', content: message }]
    });

        // Check if OpenAI API key is configured or if we want to force database-only mode
    const forceDatabaseOnly = process.env.FORCE_DATABASE_ONLY === 'true';
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here' || process.env.OPENAI_API_KEY === 'sk-dummy-key-for-local-development' || forceDatabaseOnly) {
      console.log('🔒 Using database-only mode - no AI responses');
      
      // Enhanced database-only responses
      const interestKeywords = message.toLowerCase().split(' ');
      let relevantCourses = [];
      
      if (context.major) {
        relevantCourses = await getRelevantCoursesByMajor(context.major);
      } else {
        // Get some general courses if no major context
        const generalResult = await pool.query('SELECT code, name, description FROM courses ORDER BY code LIMIT 20');
        relevantCourses = generalResult.rows;
      }
      
      // Find courses that match the user's message
      const matchingCourses = relevantCourses
        .filter(course => 
          interestKeywords.some(keyword => 
            course.name.toLowerCase().includes(keyword) || 
            (course.description && course.description.toLowerCase().includes(keyword)) ||
            course.code.toLowerCase().includes(keyword)
          )
        )
        .slice(0, 3);
      
      let response;
      if (matchingCourses.length > 0) {
        const courseList = matchingCourses.map(c => `**${c.code}**: ${c.name}`).join('\n');
        response = `I found some courses that might interest you:\n\n${courseList}\n\nThese are real courses from our Brown University catalog!`;
      } else {
        response = "I'm here to help you find great courses at Brown University! Try asking me about specific subjects, majors, or what you're interested in learning. I can only provide information about courses that actually exist in our database.";
      }
      
      return res.json({
        response: response,
        context: { major: context.major }
      });
    }

    // Get relevant course context
    let courseContext = '';
    if (context.major) {
      const relevantCourses = await getRelevantCoursesByMajor(context.major);
      courseContext = relevantCourses.slice(0, 10).map(c => `${c.code}: ${c.name}`).join(', ');
    }

    const systemPrompt = `You are BrunoBot, a knowledgeable and friendly AI course advisor at Brown University. You help students find courses and provide academic guidance.

CRITICAL RULES - NEVER BREAK THESE:
1. ONLY mention courses that are explicitly provided in the RELEVANT COURSES section
2. NEVER make up course codes, titles, or descriptions
3. If asked about a specific course not in the provided list, say "I don't have information about that specific course, but I can help you explore the available courses in our catalog"
4. When suggesting courses, only reference the exact codes and titles from the RELEVANT COURSES list

DOMAIN KNOWLEDGE:
- Brown University course structure and requirements
- Popular majors: Computer Science (CSCI), Mathematics (MATH), Economics (ECON), Biology (BIOL), Psychology (CLPS)
- Course levels: 0000-0999 (intro), 1000-1999 (intermediate), 2000+ (advanced)
- Academic calendar and registration processes

CONVERSATION CONTEXT:
- Student's major: ${context.major || 'Not specified'}
- Previous interests: ${context.interests.join(', ') || 'None'}
- Conversation history: ${context.conversationHistory.length} messages

RELEVANT COURSES: ${courseContext || 'General course catalog'}

IMPORTANT GUIDELINES:
- Be enthusiastic and encouraging
- Keep responses concise but helpful
- If asked about specific courses, only mention courses from the RELEVANT COURSES list
- If you don't know something specific, suggest they explore the course catalog
- Ask clarifying questions when user intent is unclear
- Reference previous conversation context when relevant
- Always be supportive of their academic journey
- If the user mentions computer science, suggest relevant CSCI and APMA courses from the provided list
- Provide actionable next steps when possible`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const response = completion.choices[0].message.content;

    // Validate the response to ensure no fake courses are mentioned
    const relevantCourses = context.major ? await getRelevantCoursesByMajor(context.major) : [];
    const validatedResponse = await validateCourseResponse(response, relevantCourses);

    // Update session with bot response
    updateSessionContext(sessionId, {
      conversationHistory: [...context.conversationHistory, { type: 'bot', content: validatedResponse }]
    });

    res.json({
      response: validatedResponse,
      context: { major: context.major }
    });

  } catch (error) {
    console.error('❌ Error in chat:', error);
    res.json({
      response: "I'm having trouble connecting right now, but I'm here to help you find great courses! Try exploring the course catalog or ask me something specific about what you're interested in learning.",
      context: { major: null }
    });
  }
});

// Get session context
router.get('/context/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const context = getSessionContext(sessionId);
  res.json({ context });
});

// Clear session context
router.delete('/context/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  sessionContexts.delete(sessionId);
  res.json({ message: 'Session context cleared' });
});

module.exports = router; 