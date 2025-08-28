const { initCors } = require('./init-middleware.js');

module.exports = async (req, res) => {
  // Initialize CORS
  await initCors(req, res);

  // Log request details
  console.log('🚪 API: /api/logout - Request received', {
    method: req.method,
    url: req.url,
    cookies: req.cookies,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin,
      'content-type': req.headers['content-type']
    },
    timestamp: new Date().toISOString()
  });

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'Only POST requests are allowed for /api/logout'
    });
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

    // Log response details
    console.log('📤 Sending logout response:', {
      status: 200,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Failed to logout',
      details: error.message 
    });
  }
}; 