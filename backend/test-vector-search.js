const { Pool } = require('pg');
const OpenAI = require('openai');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testVectorSearch() {
  try {
    console.log('🧠 Testing vector search...');
    
    // Test 1: Check if embeddings exist
    const countResult = await pool.query('SELECT COUNT(*) FROM courses WHERE embedding IS NOT NULL');
    console.log('✅ Courses with embeddings:', countResult.rows[0].count);
    
    // Test 2: Generate a test embedding
    console.log('🔄 Generating test embedding...');
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: 'Computer Science: programming and algorithms',
      encoding_format: 'float'
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;
    console.log('✅ Generated embedding with', queryEmbedding.length, 'dimensions');
    
    // Test 3: Try vector search
    console.log('🔍 Testing vector search query...');
    const query = `
      SELECT id, code, name as title, description 
      FROM courses 
      WHERE embedding IS NOT NULL
      ORDER BY embedding <-> $1
      LIMIT 5
    `;
    
    const result = await pool.query(query, [JSON.stringify(queryEmbedding)]);
    console.log('✅ Vector search successful! Found', result.rows.length, 'courses');
    
    result.rows.forEach((course, index) => {
      console.log(`${index + 1}. ${course.code}: ${course.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error in vector search test:', error);
  } finally {
    await pool.end();
  }
}

testVectorSearch(); 