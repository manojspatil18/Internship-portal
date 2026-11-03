const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  stipend: { type: String, default: 'Unpaid' },
  duration: { type: String, required: true },
  skills: { type: [String], default: [] },
  openings: { type: Number, default: 1 },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);
