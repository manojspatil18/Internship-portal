const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { readDB, writeDB, generateId } = require('../data/db');
const authMiddleware = require('../middleware/auth');

// Multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, 'resume-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST apply for internship (student only)
router.post('/', authMiddleware, upload.single('resume'), (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only.' });
    const { internshipId, coverLetter } = req.body;
    if (!internshipId) return res.status(400).json({ message: 'Internship ID required.' });

    const db = readDB();
    const student = db.users.find(u => u.id === req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });

    // Check duplicate application
    if (db.applications.find(a => a.internship === internshipId && a.student === req.user.id))
      return res.status(400).json({ message: 'You have already applied for this internship.' });

    const application = {
      id: generateId(), internship: internshipId, student: req.user.id,
      studentName: student.name, studentEmail: student.email,
      coverLetter: coverLetter || '',
      resumeUrl: req.file ? `/uploads/${req.file.filename}` : '',
      status: 'Pending', appliedAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    db.applications.push(application);
    writeDB(db);
    res.status(201).json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET student's own applications
router.get('/student/mine', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Students only.' });
    const db = readDB();
    const apps = db.applications
      .filter(a => a.student === req.user.id)
      .map(a => ({
        ...a,
        internship: db.internships.find(i => i.id === a.internship) || { title: 'Internship Removed', companyName: 'N/A', location: '', duration: '', stipend: '' }
      }))
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET applications for a specific internship (company only)
router.get('/internship/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Companies only.' });
    const db = readDB();
    const apps = db.applications
      .filter(a => a.internship === req.params.id)
      .map(a => ({
        ...a,
        student: db.users.find(u => u.id === a.student) || {}
      }))
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH update application status (company only)
router.patch('/:id/status', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Companies only.' });
    const { status } = req.body;
    const valid = ['Pending', 'Under Review', 'Accepted', 'Rejected'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    const db = readDB();
    const idx = db.applications.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Application not found.' });
    db.applications[idx].status = status;
    db.applications[idx].updatedAt = new Date().toISOString();
    writeDB(db);
    res.json(db.applications[idx]);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
