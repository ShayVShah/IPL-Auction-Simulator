# Real-Time Multiplayer Auction Engine

A web-based multiplayer simulator designed to replicate a live, high-speed auction environment. Built to handle concurrent users, real-time database updates, and complex budget constraints.

## Key Features

* **Live Multiplayer Bidding:** Synchronized real-time auction state across all connected clients using Firebase `onSnapshot`.
* **Algorithmic Evaluation (AI Judge):** A built-in 50/30/20 weighted quantitative model that scores managers based on squad balance (50%), home-pitch correlation (30%), and budget efficiency/economy (20%).
* **Dynamic Constraint Validations:** Automated risk management that validates transactions against dynamic variables, including remaining capital, maximum asset limits (25 max), and geographical constraints (max 8 overseas).
* **Dynamic Bid Scaling:** Automated bid step-increments that scale based on the current asset valuation.
* **Host Control Mechanisms:** Administrative tools to manually refund transactions, alter state, and resolve edge cases during live bidding.
* **Structured Player Database:** A comprehensive dataset of players categorized by specific bidding pools, base valuations, and roles.

## Tech Stack
* **Frontend:** React, Tailwind CSS, Lucide Icons
* **Backend/Database:** Firebase Authentication, Cloud Firestore
* **Architecture:** State management using React Hooks, Real-time listener synchronization
