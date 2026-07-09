import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'leads.json');

// Initialize with some mock data if it doesn't exist
const initialLeads = [
  {
    _id: "mock-1",
    name: "Aurelia Sterling",
    email: "aurelia@sterling-villas.com",
    phone: "+44 20 7946 0958",
    source: "Referral",
    status: "New",
    notes: [
      { text: "Interested in luxury villas in Southern France.", date: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: "mock-2",
    name: "Maximilian Vance",
    email: "max@vance-holdings.co",
    phone: "+1 212 555 0199",
    source: "Website",
    status: "Contacted",
    notes: [
      { text: "Sent premium catalog. Follow up on Tuesday.", date: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: "mock-3",
    name: "Seraphina Vance",
    email: "seraphina@vance-holdings.co",
    phone: "+1 212 555 0199",
    source: "Campaign",
    status: "Converted",
    notes: [
      { text: "Closed deal on Manhattan penthouse.", date: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialLeads, null, 2));
      return initialLeads;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local JSON db:', err);
  }
}

export const localDb = {
  find: () => {
    const leads = readData();
    // Sort by createdAt desc
    return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  create: (leadData) => {
    const leads = readData();
    const newLead = {
      _id: "mock-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || '',
      source: leadData.source || 'Website',
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString()
    };
    leads.push(newLead);
    writeData(leads);
    return newLead;
  },

  findById: (id) => {
    const leads = readData();
    return leads.find(l => l._id === id) || null;
  },

  findByIdAndUpdate: (id, updateData) => {
    const leads = readData();
    const idx = leads.findIndex(l => l._id === id);
    if (idx === -1) return null;
    
    leads[idx] = {
      ...leads[idx],
      ...updateData
    };
    writeData(leads);
    return leads[idx];
  },

  updateStatus: (id, status) => {
    const leads = readData();
    const idx = leads.findIndex(l => l._id === id);
    if (idx === -1) return null;
    
    leads[idx].status = status;
    writeData(leads);
    return leads[idx];
  },

  addNote: (id, noteText) => {
    const leads = readData();
    const idx = leads.findIndex(l => l._id === id);
    if (idx === -1) return null;
    
    if (!leads[idx].notes) leads[idx].notes = [];
    leads[idx].notes.push({
      text: noteText,
      date: new Date().toISOString()
    });
    writeData(leads);
    return leads[idx];
  },

  delete: (id) => {
    const leads = readData();
    const filtered = leads.filter(l => l._id !== id);
    if (filtered.length === leads.length) return false;
    writeData(filtered);
    return true;
  }
};
