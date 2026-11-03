const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB, generateId } = require('../data/db');

const genToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── STUDENT REGISTER ─────────────────────────────────────────────
router.post('/student/register', async (req, res) => {
  try {
    const { name, email, password, phone, college, degree } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });

    const db = readDB();
    if (db.users.find(u => u.email === email))
      return res.status(400).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: generateId(), name, email, password: hashed, phone: phone || '', college: college || '', degree: degree || '', skills: [], createdAt: new Date().toISOString() };
    db.users.push(user);
    writeDB(db);

    const token = genToken(user.id, 'student');
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'student' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── STUDENT LOGIN ────────────────────────────────────────────────
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = genToken(user.id, 'student');
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: 'student' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── COMPANY REGISTER ─────────────────────────────────────────────
router.post('/company/register', async (req, res) => {
  try {
    const { companyName, email, password, website, industry, location, description } = req.body;
    if (!companyName || !email || !password)
      return res.status(400).json({ message: 'Company name, email and password are required.' });

    const db = readDB();
    if (db.companies.find(c => c.email === email))
      return res.status(400).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const company = { id: generateId(), companyName, email, password: hashed, website: website || '', industry: industry || '', location: location || '', description: description || '', createdAt: new Date().toISOString() };
    db.companies.push(company);
    writeDB(db);

    const token = genToken(company.id, 'company');
    res.status(201).json({ token, user: { id: company.id, name: company.companyName, email: company.email, role: 'company' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── COMPANY LOGIN ────────────────────────────────────────────────
router.post('/company/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const company = db.companies.find(c => c.email === email);
    if (!company) return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    const token = genToken(company.id, 'company');
    res.json({ token, user: { id: company.id, name: company.companyName, email: company.email, role: 'company' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
