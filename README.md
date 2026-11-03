# 🎯 InternHub — Student Internship Portal

## 🔗 Live Demo
# 👉 https://tinyurl.com/internship-portal

---

## 📋 Features

### 🎓 Student Interface
- Register & Login with JWT authentication
- Browse & search internship listings
- Apply with cover letter
- Track application status (Pending / Under Review / Accepted / Rejected)

### 🏢 Company/Recruiter Interface
- Register & Login
- Post new internships with all details
- View applicants per internship
- Accept / Reject / Mark Under Review candidates

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express.js |
| Database | JSON File (MongoDB ready) |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| HTTP Client | Axios |

---

## 🚀 How to Run Locally

### Step 1 — Run Backend
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:5000
```

### Step 2 — Run Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:3000
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 🏢 Company | hr@technova.com | password |
| 🏢 Company | hr@greenleaf.com | password |
| 🎓 Student | Register new account | — |

---

## 📁 Project Structure

```
internship-portal/
├── backend/
│   ├── models/        → User, Company, Internship, Application
│   ├── routes/        → auth, internships, applications
│   ├── middleware/    → JWT auth
│   └── server.js     → Express server
│
├── frontend/
│   └── src/
│       ├── pages/student/   → Login, Register, Dashboard, Browse, Applications
│       ├── pages/company/   → Login, Register, Dashboard, Post, ViewApplicants
│       ├── components/      → Navbar, InternshipCard
│       └── context/         → AuthContext
│
└── InternHub.html    → Standalone demo (no install needed)
```
