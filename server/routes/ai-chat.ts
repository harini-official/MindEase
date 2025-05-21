import { Router, Request, Response } from 'express';
import anthropicService from '../services/anthropic';

const router = Router();

// Endpoint to get an emotional support response from Claude
router.post('/response', async (req: Request, res: Response) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await anthropicService.get_emotional_support_response(
      message,
      chatHistory || []
    );

    res.json({ response });
  } catch (error) {
    console.error('Error getting AI response:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Endpoint to get coping suggestions for specific emotions
router.post('/coping', async (req: Request, res: Response) => {
  try {
    const { emotion } = req.body;

    if (!emotion) {
      return res.status(400).json({ error: 'Emotion is required' });
    }

    const suggestions = await anthropicService.get_coping_suggestions(emotion);

    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting coping suggestions:', error);
    res.status(500).json({ error: 'Failed to get coping suggestions' });
  }
});

// Endpoint to get a motivational message
router.post('/motivation', async (req: Request, res: Response) => {
  try {
    const { situation } = req.body;

    const motivation = await anthropicService.get_motivation(situation);

    res.json({ motivation });
  } catch (error) {
    console.error('Error getting motivation:', error);
    res.status(500).json({ error: 'Failed to get motivation' });
  }
});

export default router;