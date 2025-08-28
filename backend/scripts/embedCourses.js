const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbeddings() {
  try {
    console.log('🚀 Starting course embedding generation...');
    
    // Fetch all courses
    const coursesQuery = `
      SELECT id, code, name, description 
      FROM courses 
      WHERE embedding IS NULL
      ORDER BY id
    `;
    
    const coursesResult = await pool.query(coursesQuery);
    const courses = coursesResult.rows;
    
    if (courses.length === 0) {
      console.log('✅ All courses already have embeddings!');
      return;
    }
    
    console.log(`📚 Found ${courses.length} courses to embed...`);
    
    // Process courses in batches to avoid rate limits
    const batchSize = 10;
    let processed = 0;
    
    for (let i = 0; i < courses.length; i += batchSize) {
      const batch = courses.slice(i, i + batchSize);
      
      console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(courses.length / batchSize)}...`);
      
      // Process each course in the batch
      for (const course of batch) {
        try {
          // Create text for embedding (combine code, name, and description)
          const courseText = `${course.code}: ${course.name}${course.description ? ` - ${course.description}` : ''}`;
          
          // Generate embedding
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: courseText,
            encoding_format: 'float'
          });
          
          const embedding = embeddingResponse.data[0].embedding;
          
          // Store embedding in database
          const updateQuery = `
            UPDATE courses 
            SET embedding = $1::vector 
            WHERE id = $2
          `;
          
          await pool.query(updateQuery, [JSON.stringify(embedding), course.id]);
          
          processed++;
          console.log(`  ✅ Embedded: ${course.code} - ${course.name}`);
          
          // Small delay to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`  ❌ Failed to embed ${course.code}:`, error.message);
        }
      }
      
      // Delay between batches
      if (i + batchSize < courses.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n🎉 Successfully embedded ${processed} courses!`);
    
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
    console.log(`   Missing embeddings: ${total_courses - courses_with_embeddings}`);
    
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  generateEmbeddings()
    .then(() => {
      console.log('✅ Embedding generation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Embedding generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateEmbeddings }; 