<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=00e5ff&height=250&section=header&text=CHAKRAVYUHA%201.0&fontSize=75&fontColor=ffffff&desc=Real-Time%20Digital%20Evidence%20Preservation&descSize=20&descAlignY=75&animation=fadeIn" />
  
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=24&pause=1000&color=00e676&center=true&vCenter=true&width=800&lines=24-Hour+Cybersecurity+Hackathon;Integrated+Incident+Response;AI-Assisted+Crime+Investigation;Digital+Evidence+Preservation" alt="Typing SVG" />
  </a>

  <br />

  <img src="https://img.shields.io/badge/Team-Hawkins_Hacker-00e5ff?style=for-the-badge&logo=codeforces&logoColor=white" />
  <img src="https://img.shields.io/badge/Institution-University_College_of_Engineering,_Kanchipuram-e040fb?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Domain-Cyber_Security-ff1744?style=for-the-badge&logo=shield&logoColor=white" />
</div>

<br />

## 🚨 Problem Statement & Industry Context

Most people have come across cyber fraud—whether via phishing links, fake applications, or convincing phone calls. A single click can compromise critical personal or financial data. 

**The Challenge:** Victims respond quickly by contacting banks and authorities, but the actual investigation process is highly fragmented. A complaint moves through multiple layers (local police ➔ district authorities ➔ specialized cyber units). 

**The Pain Point:** *During this critical delay, attackers remove traces of their activity and eliminate digital evidence.* By the time technical investigators begin, it is often too late to trace the attacker. Cases remain unresolved due to:
- **Delay in Evidence Collection:** No immediate mechanism to preserve data at the moment of the attack.
- **Fragmented Reporting:** Bureaucratic layers delay the response.
- **Loss of Critical Data:** Attackers easily wipe logs.
- **No Real-Time Systems:** Victims and specialized investigators are completely disconnected.

---

## 🛡️ Chakravyuha: Our Solution

We engineered a **Real-Time Incident Response & Case Management System** explicitly designed to bridge the gap between victims and Law Enforcement Agencies.

### 🌟 Key Deliverables Achieved in 24 Hours
✔️ **Immediate Evidence Capture:** Victims can rapidly report cases using **Native WebKit Voice-to-Text**, immediately locking in event details and timestamps. <br>
✔️ **Tamper-Proof Data Handling:** All uploaded evidence is mathematically secured. <br>
✔️ **AI-Assisted Investigation:** Native AI automatically summarizes the victim's panic report into a professional **Intelligence Brief** and classifies the domain (Phishing / Financial Fraud / Malware / Data Breach). <br>
✔️ **Real-Time Alert System:** A robust `Socket.io` powered architecture connects the victim *directly* to an Investigative Officer (IO) for real-time live messaging and emergency interaction. <br>

---

## ⚙️ System Architecture & Dashboard Flow

Our platform operates on a strictly segregated **Role-Based Access Control (RBAC)** model for complete security compliance and data privacy.

<div align="center">
  <!-- Place your Architecture & Dashboard Images Here -->
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="800">
  <br>
  <i>(Please drag and drop your `Integrated Incident Response Diagram` and `Dashboard Screenshots` here to display them)</i>
  <br><br>
</div>

1. **User (Civilian) Node:** Secure Dashboard to instantly Submit Incident Reports, view AI summarizations, and interact directly with assigned officers.
2. **Investigation Officer (IO) Node:** A real-time queue to receive new case notifications, accept cases, and chat live with the victim to freeze bank accounts or gather logs.
3. **Admin Node:** Global System Overview with **Animated Recharts** generating live visual analytics of all cases and organizational activity.

---

## 💻 Tech Stack Ecosystem

We built this high-performance system using a modern, scalable MERN architecture.

<div align="center">
  <br/>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,js,html,css,git,github,postman&perline=10" />
  </a>
  <br/>
</div>

- **Frontend Interface:** React.js, Framer Motion (Loading Animations), Recharts (Live Analytics DataVis), Web Speech API
- **Backend Architecture:** Node.js, Express.js, Socket.io (Low-Latency TCP WebSockets)
- **Database Layer:** MongoDB, Mongoose ORM
- **Security Protocols:** JSON Web Tokens (JWT), Bcryptjs (Password Hashing), Crypto API

---

## 🗄️ Database Schema Mapping

- **🔐 Users Entity:** \
  `{ _id, name, email, password (hashed), role (user/investigator/admin), otp }`
- **📁 Cases Entity:** \
  `{ _id, domain, severity, description, userEmail, investigatorEmail, status, evidenceFile, messages[] }`

---

## 🚀 Local Installation & Setup (For Judges/HR)

Want to run Chakravyuha locally on your machine?

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local server or Cloud Atlas)
- Git

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/poojamurugan23/CyberShield-project.git
cd CyberShield-project
```

### 3️⃣ Security Environment Configuration (`.env`)
Create a `.env` file perfectly identical to this inside your `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybershield
JWT_SECRET=your_super_secret_key_here
```

### 4️⃣ Install Dependencies & Run
Open **two** separate terminal windows.

**Terminal 1 (Backend Server):**
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
The application will boot up at `http://localhost:3000`.

---

## 📂 Project Directory Structure

```bash
cybershield-ultra/
│
├── frontend/                 # React UI Client
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Restricted Sidebar)
│   │   ├── pages/            # View Dashboards (Civilian, IO, Admin)
│   │   ├── styles/           # Global CSS & Glassmorphism Logic
│   │   └── App.js            # Main Route Defender
│
└── backend/                  # Node.js REST API & WebSocket Server
    ├── controllers/          # Business Logic (Auth, Case Management)
    ├── middleware/           # HTTP JWT Guards & Image Processing
    ├── models/               # MongoDB Strict Schemas
    ├── routes/               # Express Endpoint Controllers
    ├── sockets/              # Socket.io TCP Handlers
    └── server.js             # Core Initialization
```

---

## 👨‍💻 Team Hawkins Hacker

*University College of Engineering, Kanchipuram*

<div align="center">
  <table align="center" style="text-align: center; border: none;">
    <tr>
      <td width="25%">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Kiruthigaa&backgroundColor=00e5ff" width="100px;" alt=""/>
        <br />
        <b>Kiruthigaa Rajkumar</b>
        <br />
        <i>System Security Implementation & Core Logic</i>
      </td>
      <td width="25%">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Pooja&backgroundColor=e040fb" width="100px;" alt=""/>
        <br />
        <b>Pooja Murugan</b>
        <br />
        <i>UI/UX Design & User Interaction Experience</i>
      </td>
      <td width="25%">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Pavithra&backgroundColor=00e676" width="100px;" alt=""/>
        <br />
        <b>Pavithra Balamurugan</b>
        <br />
        <i>Research Analysis & Technical Documentation</i>
      </td>
      <td width="25%">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Archana&backgroundColor=ff1744" width="100px;" alt=""/>
        <br />
        <b>Archana Muruganantham</b>
        <br />
        <i>Overall System Architecture Design & Integration</i>
      </td>
    </tr>
  </table>
</div>

<div align="center">
  <br>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="800">
  <p><i>Developed with ❤️ for the 24-Hour Cyber Security Hackathon</i></p>
</div>