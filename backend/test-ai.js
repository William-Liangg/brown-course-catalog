const fetch = require('node-fetch');

async function testAIRecommendation() {
  try {
    console.log('Testing AI recommendation endpoint...');
    
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
      console.log('✅ AI recommendation successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ AI recommendation failed:');
      console.log('Status:', response.status);
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAIRecommendation(); 