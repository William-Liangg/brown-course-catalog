const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testEmbeddings() {
  try {
    console.log('🧪 Testing embedding generation with 5 courses...');
    
    // Fetch just 5 courses for testing
    const coursesQuery = `
      SELECT id, code, name, description 
      FROM courses 
      WHERE embedding IS NULL
      ORDER BY id
      LIMIT 5
    `;
    
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult.rows;
    
    if (courses.length === 0) {
      console.log('✅ No courses to embed!');
      return;
    }
    
    console.log(`📚 Found ${courses.length} courses to embed...`);
    
    for (const course of courses) {
      try {
        // Create text for embedding
        const courseText = `${course.code}: ${course.name}${course.description ? ` - ${course.description}` : ''}`;
        
        console.log(`\n🔄 Embedding: ${course.code} - ${course.name}`);
        console.log(`Text: ${courseText.substring(0, 100)}...`);
        
        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: courseText,
          encoding_format: 'float'
        });
        
        const embedding = embeddingResponse.data[0].embedding;
        console.log(`✅ Generated embedding with ${embedding.length} dimensions`);
        
        // Store embedding in database
        const updateQuery = `
          UPDATE courses 
          SET embedding = $1::vector 
          WHERE id = $2
        `;
        
        await pool.query(updateQuery, [JSON.stringify(embedding), course.id]);
        console.log(`✅ Stored embedding for ${course.code}`);
        
        // Small delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to embed ${course.code}:`, error.message);
      }
    }
    
    console.log('\n🎉 Test embedding complete!');
    
    // Verify embeddings
    const verifyQuery = `
      SELECT COUNT(*) as total_courses,
             COUNT(embedding) as courses_with_embeddings
      FROM courses
    `;
    
    const verifyResult = await pool.query(verifyQuery);
    const { total_courses, courses_with_embeddings } = verifyResult.rows[0];
    
    console.log(`\n📊 Embedding Status:`);
    console.log(`   Total courses: ${total_courses}`);
    console.log(`   Courses with embeddings: ${courses_with_embeddings}`);
    
  } catch (error) {
    console.error('❌ Error in test embeddings:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the test
if (require.main === module) {
  testEmbeddings()
    .then(() => {
      console.log('✅ Test embedding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test embedding failed:', error);
      process.exit(1);
    });
}

module.exports = { testEmbeddings }; 