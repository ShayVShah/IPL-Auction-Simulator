# Real-Time Multiplayer Auction Engine

A web-based multiplayer simulator designed to replicate a live, high-speed auction environment. Built to handle concurrent users, real-time database updates, and complex budget constraints.

## 🚀 How to Play Instantly (No Coding Environment Needed!)
You and your friends can play this right now directly through your browser using Gemini's Canvas feature. 

**For the Host:**
1. Copy the entire code from `App.js`.
2. Paste it into a new chat with Google Gemini and ask it to "Run this code".
3. Once Gemini opens it, click the **Canvas / Preview** button to view the live app.
4. Click **Create New Room** and copy the Room Code. 
5. Click the **Share** button on the Gemini chat to share the link with your friends.

**For the Players:**
1. Open the shared Gemini link provided by the host.
2. Enter your Name and the **Room Code** the host gave you.
3. Click **Join** and wait in the lobby for the auction to start!

## 📸 Screenshots
<img width="816" height="680" alt="image" src="https://github.com/user-attachments/assets/9ffd4e8d-87e0-48ac-aed3-365106775dd9" />

<img width="1119" height="668" alt="image" src="https://github.com/user-attachments/assets/175268dd-648e-40fc-85ca-6615fb67fb22" />

<img width="1024" height="517" alt="image" src="https://github.com/user-attachments/assets/7aea7ca6-b59d-422e-8da3-c385d1c1971f" />

<img width="626" height="395" alt="image" src="https://github.com/user-attachments/assets/15bd8731-6a4c-4388-8e91-5fd61b391d7e" />


## Key Features
* **Live Multiplayer Bidding:** Synchronized real-time auction state across all connected clients.
* **Algorithmic Evaluation (AI Judge):** A built-in 50/30/20 weighted quantitative model that scores managers based on squad balance (50%), home-pitch correlation (30%), and budget efficiency/economy (20%).
* **Dynamic Constraint Validations:** Automated risk management that validates transactions against dynamic variables, including remaining capital, maximum asset limits (25 max), and geographical constraints (max 8 overseas).
* **Dynamic Bid Scaling:** Automated bid step-increments that scale based on the current asset valuation.
* **Host Control Mechanisms:** Administrative tools to resolve edge cases during live bidding.
* **Structured Player Database:** A comprehensive dataset of players categorized by specific bidding pools, base valuations, and roles.

## Tech Stack
* **Frontend:** React, Tailwind CSS, Lucide Icons
* **Backend/Database:** Firebase Authentication, Cloud Firestore
* **Architecture:** State management using React Hooks, Real-time listener synchronization
