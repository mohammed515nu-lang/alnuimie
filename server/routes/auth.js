// Add debug endpoint after the /google/url route
router.get('/google/debug', (req, res) => {
  let frontendUrl = process.env.FRONTEND_URL;
  
  if (frontendUrl) {
    // Ensure https:// is present
    if (!frontendUrl.startsWith('http://') && !frontendUrl.startsWith('https://')) {
      frontendUrl = `https://${frontendUrl}`;
    }
    // Remove trailing slash
    frontendUrl = frontendUrl.replace(/\/$/, '');
  }
  
  const redirectUri = frontendUrl ? `${frontendUrl}/auth/google/callback` : 'NOT SET';
  
  res.json({
    frontendUrl: process.env.FRONTEND_URL || 'NOT SET',
    frontendUrlProcessed: frontendUrl || 'NOT SET',
    redirectUri: redirectUri,
    hasClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    clientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING',
    message: 'Add this exact redirect URI to Google Cloud Console → Authorized redirect URIs:',
    exactRedirectUri: redirectUri
  });
});
