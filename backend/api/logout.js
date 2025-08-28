module.exports = async (req, res) => {
  console.log('🚪 API: /api/logout - Request received', {
    method: req.method,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('✅ Logout successful');
    
    // Clear the token cookie
    res.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout failed:', error);
    res.status(500).json({ 
      error: 'Failed to logout',
      message: 'An unexpected error occurred during logout',
      code: 'INTERNAL_ERROR'
    });
  }
}; 