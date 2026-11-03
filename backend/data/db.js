const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');

// Seed default data if DB doesn't exist
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [],
      companies: [
        {
          id: 'c1', companyName: 'TechNova Solutions', email: 'hr@technova.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          website: 'https://technova.com', industry: 'Technology',
          location: 'Bangalore, India', description: 'Leading software company', createdAt: new Date().toISOString()
        },
        {
          id: 'c2', companyName: 'GreenLeaf Finance', email: 'hr@greenleaf.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          website: 'https://greenleaf.com', industry: 'Finance',
          location: 'Mumbai, India', description: 'Fintech startup', createdAt: new Date().toISOString()
        }
      ],
      internships: [
        {
          id: 'i1', company: 'c1', companyName: 'TechNova Solutions',
          title: 'Frontend Developer Intern',
          description: 'Work on React.js based web applications. Build responsive UIs, implement designs and collaborate with our senior developers on real-world projects.',
          location: 'Bangalore (Hybrid)', type: 'Hybrid', stipend: '12000', duration: '3 months',
          skills: ['React', 'JavaScript', 'CSS', 'HTML'], openings: 3,
          deadline: '2026-12-31', isActive: true, createdAt: new Date().toISOString()
        },
        {
          id: 'i2', company: 'c1', companyName: 'TechNova Solutions',
          title: 'Full Stack Developer Intern',
          description: 'Work on MERN stack projects. Build REST APIs, connect databases, and create full-stack features end-to-end with guidance from senior engineers.',
          location: 'Remote', type: 'Remote', stipend: '15000', duration: '6 months',
          skills: ['Node.js', 'React', 'MongoDB', 'Express'], openings: 2,
          deadline: '2026-12-15', isActive: true, createdAt: new Date().toISOString()
        },
        {
          id: 'i3', company: 'c2', companyName: 'GreenLeaf Finance',
          title: 'Data Analytics Intern',
          description: 'Analyze financial data, create reports and dashboards. Work with Python and SQL to extract key business insights from large datasets.',
          location: 'Mumbai', type: 'On-site', stipend: '10000', duration: '2 months',
          skills: ['Python', 'SQL', 'Excel', 'Tableau'], openings: 1,
          deadline: '2026-11-30', isActive: true, createdAt: new Date().toISOString()
        },
        {
          id: 'i4', company: 'c2', companyName: 'GreenLeaf Finance',
          title: 'UI/UX Design Intern',
          description: 'Design user interfaces for our fintech mobile app. Create wireframes, prototypes and conduct user research to improve user experience.',
          location: 'Remote', type: 'Remote', stipend: 'Unpaid', duration: '3 months',
          skills: ['Figma', 'Adobe XD', 'Prototyping', 'UI Design'], openings: 2,
          deadline: '2026-12-20', isActive: true, createdAt: new Date().toISOString()
        },
        {
          id: 'i5', company: 'c1', companyName: 'TechNova Solutions',
          title: 'Backend Developer Intern',
          description: 'Build REST APIs using Node.js and Express. Work with databases, write clean code and participate in code reviews with our engineering team.',
          location: 'Bangalore', type: 'On-site', stipend: '14000', duration: '4 months',
          skills: ['Node.js', 'Express', 'MongoDB', 'REST API'], openings: 2,
          deadline: '2026-12-10', isActive: true, createdAt: new Date().toISOString()
        }
      ],
      applications: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    console.log('📦 Database initialized with sample data');
  }
}

function readDB() {
  initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = { readDB, writeDB, generateId, initDB };
