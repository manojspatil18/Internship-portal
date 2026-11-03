const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  coverLetter: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Prevent duplicate applications
applicationSchema.index({ internship: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
