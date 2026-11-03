const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/applications', require('./routes/applications'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Internship Portal API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🎯 InternHub Backend Server          ║');
  console.log(`║   🚀 Running on http://localhost:${PORT}  ║`);
  console.log('║   📁 Using local JSON file database    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
