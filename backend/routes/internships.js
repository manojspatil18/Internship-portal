const express = require('express');
const router = express.Router();
const { readDB, writeDB, generateId } = require('../data/db');
const authMiddleware = require('../middleware/auth');

// GET all internships (public, with search/filter)
router.get('/', (req, res) => {
  try {
    const { search, type } = req.query;
    const db = readDB();
    let list = db.internships.filter(i => i.isActive);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        i.title.toLowerCase().includes(s) ||
        i.companyName.toLowerCase().includes(s) ||
        (i.skills || []).some(sk => sk.toLowerCase().includes(s))
      );
    }
    if (type) list = list.filter(i => i.type === type);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET company's own internships
router.get('/company/mine', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Companies only.' });
    const db = readDB();
    const list = db.internships.filter(i => i.company === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single internship
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const internship = db.internships.find(i => i.id === req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found.' });
    res.json(internship);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create internship (company only)
router.post('/', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Companies only.' });
    const { title, description, location, type, stipend, duration, skills, openings, deadline, companyName } = req.body;
    if (!title || !description || !location || !duration)
      return res.status(400).json({ message: 'Title, description, location and duration are required.' });

    const db = readDB();
    const internship = {
      id: generateId(), company: req.user.id, companyName: companyName || '',
      title, description, location, type: type || 'Remote',
      stipend: stipend || 'Unpaid', duration,
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
      openings: parseInt(openings) || 1,
      deadline: deadline || null, isActive: true, createdAt: new Date().toISOString()
    };
    db.internships.push(internship);
    writeDB(db);
    res.status(201).json(internship);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE internship (company only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'company') return res.status(403).json({ message: 'Companies only.' });
    const db = readDB();
    const idx = db.internships.findIndex(i => i.id === req.params.id && i.company === req.user.id);
    if (idx === -1) return res.status(404).json({ message: 'Internship not found.' });
    db.internships.splice(idx, 1);
    writeDB(db);
    res.json({ message: 'Internship deleted successfully.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
