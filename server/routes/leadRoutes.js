import express from 'express';
import Lead from '../models/lead.js';

const router = express.Router();

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new lead
router.post('/', async (req, res) => {
  const { name, email, phone, source } = req.body;
  const lead = new Lead({ name, email, phone, source });

  try {
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      lead.status = req.body.status;
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add note to lead
router.post('/:id/notes', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      lead.notes.push({ text: req.body.text });
      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead deleted' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
