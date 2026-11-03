# 🎯 InternHub — Student Internship Portal
### MERN Full Stack Mini Project

A complete **MERN Stack** web application for connecting students with companies for internships.

---

## 📋 Features

### 🎓 Student Interface
- Register & Login with JWT authentication
- Browse & search internship listings
- Apply with resume (PDF) upload + cover letter
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
| Database | MongoDB (local) |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| HTTP Client | Axios |

---

## 🚀 How to Run

### Prerequisites
1. **Node.js** (v18+) — [Download](https://nodejs.org)
2. **MongoDB** (local) — [Download](https://www.mongodb.com/try/download/community)

---

### Step 1 — Start MongoDB
Make sure MongoDB is running on your machine:
```bash
# Windows: Start MongoDB service from Services panel
# OR run:
mongod
```

---

### Step 2 — Setup & Run Backend
```bash
cd internship-portal/backend
npm install
npm run dev
```
Backend will start at: **http://localhost:5000**

---

### Step 3 — Setup & Run Frontend
```bash
cd internship-portal/frontend
npm install
npm run dev
```
Frontend will start at: **http://localhost:3000**

---

## 📁 Project Structure

```
internship-portal/
├── backend/
│   ├── models/           # MongoDB Schemas
│   │   ├── User.js       # Student model
│   │   ├── Company.js    # Company model
│   │   ├── Internship.js # Internship listing
│   │   └── Application.js# Job application
│   ├── routes/
│   │   ├── auth.js       # Login/Register
│   │   ├── internships.js# CRUD for listings
│   │   └── applications.js# Apply & manage
│   ├── middleware/
│   │   └── auth.js       # JWT middleware
│   ├── uploads/          # Uploaded resumes
│   └── server.js         # Entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── student/  # 5 student pages
        │   └── company/  # 5 company pages
        ├── components/   # Reusable UI
        ├── context/      # Auth state
        └── api/          # Axios config
```

---

## 🔗 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/student/register` | Student registration |
| POST | `/student/login` | Student login |
| POST | `/company/register` | Company registration |
| POST | `/company/login` | Company login |

### Internships (`/api/internships`)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/` | Public |
| GET | `/:id` | Public |
| GET | `/company/mine` | Company |
| POST | `/` | Company |
| DELETE | `/:id` | Company |

### Applications (`/api/applications`)
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/` | Student |
| GET | `/student/mine` | Student |
| GET | `/internship/:id` | Company |
| PATCH | `/:id/status` | Company |

---

## 🎨 Design
- Dark glassmorphism theme
- Purple/blue gradient for students
- Pink/orange gradient for companies
- Smooth animations & micro-interactions
- Fully responsive layout
