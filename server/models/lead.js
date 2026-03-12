import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false, default: '' },
  source: { type: String, required: false, default: 'Website' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Converted', 'Lost'], 
    default: 'New' 
  },
  notes: [{
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
