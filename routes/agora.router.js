import express from 'express';
import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkg;

const router = express.Router();

// Agora credentials (environment variables থেকে নিন)
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// Token generate করার route
router.post('/token', async (req, res) => {
  try {
    const { channelName, uid } = req.body;
    
    if (!channelName || !uid) {
      return res.status(400).json({ 
        error: 'Channel name and UID required' 
      });
    }

    // Token expiry time (24 hours)
    const expirationTimeInSeconds = 24 * 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    res.json({
      token,
      expiresAt: privilegeExpiredTs,
      channelName,
      uid
    });

  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// Token refresh route
router.post('/refresh-token', async (req, res) => {
  try {
    const { channelName, uid } = req.body;
    
    // Same logic as token generation
    const expirationTimeInSeconds = 24 * 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    res.json({
      token,
      expiresAt: privilegeExpiredTs,
      refreshedAt: currentTimestamp
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export default router;