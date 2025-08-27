const fetch = require('node-fetch');

async function testVectorAI() {
  try {
    console.log('🧠 Testing Vector-based AI recommendation endpoint...');
    
    const response = await fetch('http://localhost:3001/api/ai/ai-recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        major: 'Computer Science',
        interests: 'programming, algorithms, and software development'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Vector AI recommendation successful!');
      console.log('Search method:', data.searchMethod);
      console.log('Total courses found:', data.totalCourses);
      console.log('Recommendations:', data.recommendations.length);
      console.log('\nTop recommendations:');
      data.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.code}: ${rec.title}`);
        console.log(`   Reason: ${rec.reason}`);
        console.log('');
      });
    } else {
      console.log('❌ Vector AI recommendation failed:');
      console.log('Status:', response.status);
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testVectorAI(); 