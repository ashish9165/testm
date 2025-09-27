import express from 'express';

const router = express.Router();

// Placeholder route - can be expanded later
router.get('/health', (req, res) => {
  res.json({ message: 'Admin routes - not implemented yet' });
});

export default router;
