import express from 'express';
import mongoose from 'mongoose';
import Lead from '../models/lead.js';
import { localDb } from '../localDb.js';

const router = express.Router();

// Get all leads
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(localDb.find());
    }
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new lead
router.post('/', async (req, res) => {
  const { name, email, phone, source } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      const newLead = localDb.create({ name, email, phone, source });
      return res.status(201).json(newLead);
    }
    const lead = new Lead({ name, email, phone, source });
    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update full lead (Edit modal)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, source, status } = req.body;
    if (mongoose.connection.readyState !== 1) {
      const lead = localDb.findByIdAndUpdate(req.params.id, { name, email, phone, source, status });
      if (!lead) return res.status(404).json({ message: 'Lead not found' });
      return res.json(lead);
    }
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, source, status },
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const lead = localDb.updateStatus(req.params.id, req.body.status);
      if (lead) {
        return res.json(lead);
      } else {
        return res.status(404).json({ message: 'Lead not found' });
      }
    }
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
    if (mongoose.connection.readyState !== 1) {
      const lead = localDb.addNote(req.params.id, req.body.text);
      if (lead) {
        return res.json(lead);
      } else {
        return res.status(404).json({ message: 'Lead not found' });
      }
    }
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
    if (mongoose.connection.readyState !== 1) {
      const deleted = localDb.delete(req.params.id);
      if (deleted) {
        return res.json({ message: 'Lead deleted' });
      } else {
        return res.status(404).json({ message: 'Lead not found' });
      }
    }
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
