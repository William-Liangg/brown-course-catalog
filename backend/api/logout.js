module.exports = async (req, res) => {
  console.log('🚪 API: /api/logout - Request received', {
    method: req.method,
    cookies: req.cookies,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers - handle credentials mode properly
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    // Vercel deployment domains
    'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app',
    'https://brown-course-catalog-ggs2cd5o1-wills-projects-5cfc44e3.vercel.app',
    'https://brown-course-catalog-odp1z3ttw-wills-projects-5cfc44e3.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the main Vercel domain
    res.setHeader('Access-Control-Allow-Origin', 'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧹 Clearing authentication cookie');

    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    console.log('✅ Logout successful - cookie cleared');

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout failed:', error);
    res.status(500).json({ 
      error: 'Failed to logout',
      details: error.message 
    });
  }
}; 