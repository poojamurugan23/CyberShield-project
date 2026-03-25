<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=00e5ff&height=250&section=header&text=CHAKRAVYUHA&fontSize=80&fontColor=ffffff&desc=Digital%20Evidence%20Vault&descSize=20&descAlignY=75&animation=fadeIn" />
  
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=00e676&center=true&vCenter=true&width=800&lines=The+Digital+Evidence+Vault;Real-time+Cybercrime+Reporting;AI-Powered+Incident+Classification;Cryptographic+Hash-Secured+Ledger" alt="Typing SVG" />
  </a>
</div>

## 🛡️ Ideology & Mission

**Chakravyuha** is an elite, real-time cybersecurity evidence portal designed to rapidly bridge the gap between cybercrime victims and investigative officers. Rooted in the concept of *Defense in Depth*, our platform automates the triage of high-priority cyber attacks using **AI Incident Classification**, secures digital forensics through **Immutable SHA-256 Cryptographic Hashes**, and enables instantaneous two-way communication via **WebSocket TCP architectures**.

---

## ⚙️ System Architecture

Our platform operates on a strictly segregated **Role-Based Access Control (RBAC)** architecture to prevent data cross-contamination.

<div align="center">
  <!-- HR & Judge Friendly Placeholder for Architecture / Agent Info image -->
  <br>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="800">
  <br>
  <i>(Replace this line with your actual agent/architecture diagram using standard markdown image tags)</i>
  <br><br>
</div>

1. **Civilian Node (Victims):** Native WebKit Speech-to-Text integration for rapid, hands-free incident reporting.
2. **Investigator Node:** Real-time socket queues to adopt, manage, and investigate local cybercrimes.
3. **Master Admin Node:** Global omniscience routing via Dynamic Animated Recharts (Phishing, Financial Fraud, Malware, Data Breach).

---

## 💻 Tech Stack Ecosystem

We utilized a modern, high-performance MERN architecture heavily enhanced with real-time bidirectional event protocols.

<div align="center">
  <br/>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,github,html,css,js,git,postman&perline=10" />
  </a>
  <br/>
</div>

- **Frontend Interface:** React.js, Framer Motion (Micro-animations), Recharts (SVG Data Visualization), Lucide-React
- **Backend Architecture:** Node.js, Express.js, Socket.io (Low-Latency TCP WebSockets)
- **Database Layer:** MongoDB, Mongoose ORM
- **Security Protocols:** JSON Web Tokens (JWT), Bcryptjs (Password Hashing), Crypto API (SHA-256), NodeMailer (2FA OTP)

---

## 🗄️ Database Schema & Entities

Our NoSQL architecture leverages robust relational mapping across these primary clusters:

- **🔐 Users Collection:** \
  `{ _id, name, email, password (hashed), role (user/investigator/admin), otp, otpExpires }`
- **📁 Cases Collection:** \
  `{ _id, domain, severity, description, userEmail, investigatorEmail, status, evidenceFile, cryptoHash, messages[] }`

---

## 🚀 Local Installation & Setup

Want to run Chakravyuha locally on your machine for testing or contribution? Follow these exact steps.

### 1️⃣ Prerequisites
Ensure you have the following installed system-wide:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local server or Cloud Atlas cluster)
- Git Bash

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/poojamurugan23/CyberShield-project.git
cd cybershield-ultra
```

### 3️⃣ Security Environment Configuration (`.env`)
Create a `.env` file perfectly identical to this structure inside your `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybershield
JWT_SECRET=your_super_secret_key_here
EMAIL_USER=your_gmail_associated_with_nodemailer@gmail.com
EMAIL_PASS=your_gmail_app_password
APP_NAME=CyberShield
TEST_RECEIVER_EMAIL=test_target@gmail.com
```

### 4️⃣ Install Dependencies & Run
Open **two** separate terminal windows.

**Terminal 1 (Backend Server Initialization):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend React Client):**
```bash
cd frontend
npm install
npm start
```
The application will securely boot up and default to `http://localhost:3000`.

---

## 📂 Project Directory Structure

```bash
cybershield-ultra/
│
├── frontend/                 # React UI Client
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Segregated Sidebar)
│   │   ├── features/         # Redux Slices & API Handlers
│   │   ├── pages/            # View Controllers (Dashboards, Evidence Vault)
│   │   ├── styles/           # CSS & Glassmorphism Tokens
│   │   └── App.js            # Main Authorized Route Defender
│   └── package.json
│
└── backend/                  # Node.js REST API & WebSocket Server
    ├── config/               # DB connections & JWT Auth Configurations
    ├── controllers/          # Core Business Logic (Auth, Case Management)
    ├── middleware/           # HTTP JWT Guards & Multer Image Processing
    ├── models/               # MongoDB Mongoose Strict Schemas
    ├── routes/               # Express Endpoint Controller Definitions
    ├── services/             # AI, Email Transport, OTP & Blockchain Engines
    ├── sockets/              # Socket.io TCP Active Handlers
    ├── server.js             # Core Application Initialization Loop
    └── package.json
```

---

## 👨‍💻 Meet the Masterminds

<div align="center">
  <table align="center">
    <tr align="center">
      <td>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pooja&backgroundColor=00e5ff" width="100px;" alt=""/>
        <br />
        <b>Pooja</b>
        <br />
        <i>System Architecture Design & Integration</i>
      </td>
      <td>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend&backgroundColor=e040fb" width="100px;" alt=""/>
        <br />
        <b>[Team Member 2]</b>
        <br />
        <i>Frontend & Graphic UI/UX</i>
      </td>
      <td>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Backend&backgroundColor=00e676" width="100px;" alt=""/>
        <br />
        <b>[Team Member 3]</b>
        <br />
        <i>Backend Routing & Cryptographic Security</i>
      </td>
       <td>
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AI&backgroundColor=ff1744" width="100px;" alt=""/>
        <br />
        <b>[Team Member 4]</b>
        <br />
        <i>AI & Database Handling</i>
      </td>
    </tr>
  </table>
</div>

<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="800">
  <p><i>Building a safer digital frontier, one cryptographic hash at a time.</i></p>
</div>