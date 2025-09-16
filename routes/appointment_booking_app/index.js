import express from 'express';

const router = express.Router();

// Use ambulance routes
router.use('/ambulance', (req, res) => {
  res.status(200).json({ message: "This route is now handled directly in app.js" });
});

export default router;