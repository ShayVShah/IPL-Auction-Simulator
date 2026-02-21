import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, updateDoc, getDoc, deleteField } from 'firebase/firestore';
import { Gavel, Users, Wallet, Trophy, TrendingUp, AlertCircle, SkipForward, Play, Pause, RotateCcw, CheckCircle2, List, X, Globe, Copy, Wifi, ShieldAlert, Lock, BookOpen, Eye, Crown, UserMinus, RefreshCw, Info, Check, Trash2, ChevronRight } from 'lucide-react';

// --- FIREBASE SETUP ---
const firebaseConfig = JSON.parse(__firebase_config || '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'ipl-auction-2025';

// --- CONSTANTS ---
const INITIAL_PURSE = 1200000000; // 120 Cr
const MIN_SQUAD = 16;
const MAX_SQUAD = 25;
const MAX_OVERSEAS = 8;

// --- DATA: TEAMS ---
const TEAMS_TEMPLATE = [
  { id: 'CSK', name: 'Chennai Super Kings', primary: '#F9CD05', secondary: '#005DA0', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Spinner', 'All-Rounder'], pitch: 'Turning Track' },
  { id: 'MI', name: 'Mumbai Indians', primary: '#004BA0', secondary: '#D1AB3E', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Fast Bowler', 'Batsman'], pitch: 'Batting/Bounce' },
  { id: 'RCB', name: 'Royal Challengers', primary: '#EC1C24', secondary: '#2B2A29', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Batsman', 'Fast Bowler'], pitch: 'Batting Paradise' },
  { id: 'KKR', name: 'Kolkata Knight Riders', primary: '#3A225D', secondary: '#F3C242', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Spinner', 'Batsman'], pitch: 'Balanced/Spin' },
  { id: 'GT', name: 'Gujarat Titans', primary: '#1B2133', secondary: '#B79150', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Fast Bowler', 'All-Rounder'], pitch: 'Balanced' },
  { id: 'LSG', name: 'Lucknow Super Giants', primary: '#005DA0', secondary: '#A8E4FF', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Fast Bowler', 'Batsman'], pitch: 'Pace Friendly' },
  { id: 'RR', name: 'Rajasthan Royals', primary: '#EA1A85', secondary: '#254AA5', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Spinner', 'Batsman'], pitch: 'Balanced' },
  { id: 'DC', name: 'Delhi Capitals', primary: '#17479E', secondary: '#DC2F2E', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Batsman', 'Spinner'], pitch: 'Small Ground' },
  { id: 'PBKS', name: 'Punjab Kings', primary: '#DD1F2D', secondary: '#D7D7D7', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Batsman', 'Fast Bowler'], pitch: 'Batting Friendly' },
  { id: 'SRH', name: 'Sunrisers Hyderabad', primary: '#F78F2E', secondary: '#000000', purse: INITIAL_PURSE, squad: [], overseas: 0, homeType: ['Batsman', 'Fast Bowler'], pitch: 'Batting Friendly' },
];

// --- DATA: PLAYERS ---
const PLAYERS_MASTER = [
    // MARQUEE SET 1 (15)
    { id: 1, name: 'Virat Kohli', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 2, name: 'Rohit Sharma', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 3, name: 'Jasprit Bumrah', role: 'Fast Bowler', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 4, name: 'Hardik Pandya', role: 'All-Rounder', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 5, name: 'Rishabh Pant', role: 'WK-Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 6, name: 'Suryakumar Yadav', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 7, name: 'Heinrich Klaasen', role: 'WK-Batsman', country: 'SA', base: 20000000, set: 'Marquee Set 1' },
    { id: 8, name: 'Rashid Khan', role: 'Spinner', country: 'AFG', base: 20000000, set: 'Marquee Set 1' },
    { id: 9, name: 'Andre Russell', role: 'All-Rounder', country: 'WI', base: 20000000, set: 'Marquee Set 1' },
    { id: 10, name: 'Pat Cummins', role: 'Fast Bowler', country: 'AUS', base: 20000000, set: 'Marquee Set 1' },
    { id: 11, name: 'Jos Buttler', role: 'WK-Batsman', country: 'ENG', base: 20000000, set: 'Marquee Set 1' },
    { id: 12, name: 'Ravindra Jadeja', role: 'All-Rounder', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 13, name: 'Shreyas Iyer', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 1' },
    { id: 14, name: 'Mitchell Starc', role: 'Fast Bowler', country: 'AUS', base: 20000000, set: 'Marquee Set 1' },
    { id: 15, name: 'Sunil Narine', role: 'All-Rounder', country: 'WI', base: 20000000, set: 'Marquee Set 1' },

    // MARQUEE SET 2 (15)
    { id: 16, name: 'KL Rahul', role: 'WK-Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 17, name: 'Shubman Gill', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 18, name: 'Sanju Samson', role: 'WK-Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 19, name: 'Jofra Archer', role: 'Fast Bowler', country: 'ENG', base: 20000000, set: 'Marquee Set 2' },
    { id: 20, name: 'Nicholas Pooran', role: 'WK-Batsman', country: 'WI', base: 20000000, set: 'Marquee Set 2' },
    { id: 21, name: 'Glenn Maxwell', role: 'All-Rounder', country: 'AUS', base: 20000000, set: 'Marquee Set 2' },
    { id: 22, name: 'Kagiso Rabada', role: 'Fast Bowler', country: 'SA', base: 20000000, set: 'Marquee Set 2' },
    { id: 23, name: 'Mohammed Shami', role: 'Fast Bowler', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 24, name: 'Yuzvendra Chahal', role: 'Spinner', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 25, name: 'Arshdeep Singh', role: 'Fast Bowler', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 26, name: 'Liam Livingstone', role: 'All-Rounder', country: 'ENG', base: 20000000, set: 'Marquee Set 2' },
    { id: 27, name: 'David Miller', role: 'Batsman', country: 'SA', base: 20000000, set: 'Marquee Set 2' },
    { id: 28, name: 'Mohammed Siraj', role: 'Fast Bowler', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 29, name: 'Axar Patel', role: 'All-Rounder', country: 'IND', base: 20000000, set: 'Marquee Set 2' },
    { id: 30, name: 'Yashasvi Jaiswal', role: 'Batsman', country: 'IND', base: 20000000, set: 'Marquee Set 2' },

    // BATTERS SET 1 (15)
    { id: 31, name: 'Rinku Singh', role: 'Batsman', country: 'IND', base: 15000000, set: 'Batters Set 1' },
    { id: 32, name: 'Ruturaj Gaikwad', role: 'Batsman', country: 'IND', base: 20000000, set: 'Batters Set 1' },
    { id: 33, name: 'Faf du Plessis', role: 'Batsman', country: 'SA', base: 20000000, set: 'Batters Set 1' },
    { id: 34, name: 'David Warner', role: 'Batsman', country: 'AUS', base: 20000000, set: 'Batters Set 1' },
    { id: 35, name: 'Harry Brook', role: 'Batsman', country: 'ENG', base: 20000000, set: 'Batters Set 1' },
    { id: 36, name: 'Tilak Varma', role: 'Batsman', country: 'IND', base: 15000000, set: 'Batters Set 1' },
    { id: 37, name: 'Shimron Hetmyer', role: 'Batsman', country: 'WI', base: 15000000, set: 'Batters Set 1' },
    { id: 38, name: 'Rachin Ravindra', role: 'Batsman', country: 'NZ', base: 20000000, set: 'Batters Set 1' },
    { id: 39, name: 'Shivman Dube', role: 'Batsman', country: 'IND', base: 15000000, set: 'Batters Set 1' },
    { id: 40, name: 'Jake Fraser-McGurk', role: 'Batsman', country: 'AUS', base: 20000000, set: 'Batters Set 1' },
    { id: 41, name: 'Rajat Patidar', role: 'Batsman', country: 'IND', base: 10000000, set: 'Batters Set 1' },
    { id: 42, name: 'Sai Sudharsan', role: 'Batsman', country: 'IND', base: 10000000, set: 'Batters Set 1' },
    { id: 43, name: 'Rahul Tripathi', role: 'Batsman', country: 'IND', base: 7500000, set: 'Batters Set 1' },
    { id: 44, name: 'Tim David', role: 'Batsman', country: 'AUS', base: 20000000, set: 'Batters Set 1' },
    { id: 45, name: 'Tristan Stubbs', role: 'Batsman', country: 'SA', base: 15000000, set: 'Batters Set 1' },

    // BATTERS SET 2 (15)
    { id: 46, name: 'Steve Smith', role: 'Batsman', country: 'AUS', base: 20000000, set: 'Batters Set 2' },
    { id: 47, name: 'Kane Williamson', role: 'Batsman', country: 'NZ', base: 20000000, set: 'Batters Set 2' },
    { id: 48, name: 'Nitish Rana', role: 'Batsman', country: 'IND', base: 15000000, set: 'Batters Set 2' },
    { id: 49, name: 'Ajinkya Rahane', role: 'Batsman', country: 'IND', base: 10000000, set: 'Batters Set 2' },
    { id: 50, name: 'Mayank Agarwal', role: 'Batsman', country: 'IND', base: 10000000, set: 'Batters Set 2' },
    { id: 51, name: 'Abhishek Sharma', role: 'Batsman', country: 'IND', base: 7500000, set: 'Batters Set 2' },
    { id: 52, name: 'Manish Pandey', role: 'Batsman', country: 'IND', base: 5000000, set: 'Batters Set 2' },
    { id: 53, name: 'Rovman Powell', role: 'Batsman', country: 'WI', base: 15000000, set: 'Batters Set 2' },
    { id: 54, name: 'Aiden Markram', role: 'Batsman', country: 'SA', base: 20000000, set: 'Batters Set 2' },
    { id: 55, name: 'Daryl Mitchell', role: 'Batsman', country: 'NZ', base: 15000000, set: 'Batters Set 2' },
    { id: 56, name: 'Sameer Rizvi', role: 'Batsman', country: 'IND', base: 5000000, set: 'Batters Set 2' },
    { id: 57, name: 'Travis Head', role: 'Batsman', country: 'AUS', base: 5000000, set: 'Batters Set 2' },
    { id: 58, name: 'Finn Allen', role: 'Batsman', country: 'NZ', base: 10000000, set: 'Batters Set 2' },
    { id: 59, name: 'Dewald Brevis', role: 'Batsman', country: 'SA', base: 5000000, set: 'Batters Set 2' },
    { id: 60, name: 'Rilee Rossouw', role: 'Batsman', country: 'SA', base: 10000000, set: 'Batters Set 2' },

    // ALL ROUNDERS SET 1 (15)
    { id: 61, name: 'Sam Curran', role: 'All-Rounder', country: 'ENG', base: 20000000, set: 'All-Rounders 1' },
    { id: 62, name: 'Cameron Green', role: 'All-Rounder', country: 'AUS', base: 20000000, set: 'All-Rounders 1' },
    { id: 63, name: 'Marcus Stoinis', role: 'All-Rounder', country: 'AUS', base: 20000000, set: 'All-Rounders 1' },
    { id: 64, name: 'Washington Sundar', role: 'All-Rounder', country: 'IND', base: 15000000, set: 'All-Rounders 1' },
    { id: 65, name: 'Wanindu Hasaranga', role: 'All-Rounder', country: 'SL', base: 20000000, set: 'All-Rounders 1' },
    { id: 66, name: 'Shardul Thakur', role: 'All-Rounder', country: 'IND', base: 20000000, set: 'All-Rounders 1' },
    { id: 67, name: 'Marco Jansen', role: 'All-Rounder', country: 'SA', base: 15000000, set: 'All-Rounders 1' },
    { id: 68, name: 'Krunal Pandya', role: 'All-Rounder', country: 'IND', base: 10000000, set: 'All-Rounders 1' },
    { id: 69, name: 'Mitchell Santner', role: 'All-Rounder', country: 'NZ', base: 10000000, set: 'All-Rounders 1' },
    { id: 70, name: 'Azmatullah Omarzai', role: 'All-Rounder', country: 'AFG', base: 10000000, set: 'All-Rounders 1' },
    { id: 71, name: 'Will Jacks', role: 'All-Rounder', country: 'ENG', base: 20000000, set: 'All-Rounders 1' },
    { id: 72, name: 'Romario Shepherd', role: 'All-Rounder', country: 'WI', base: 10000000, set: 'All-Rounders 1' },
    { id: 73, name: 'Deepak Hooda', role: 'All-Rounder', country: 'IND', base: 5000000, set: 'All-Rounders 1' },
    { id: 74, name: 'Nitish Kumar Reddy', role: 'All-Rounder', country: 'IND', base: 10000000, set: 'All-Rounders 1' },
    { id: 75, name: 'Shahrukh Khan', role: 'All-Rounder', country: 'IND', base: 7500000, set: 'All-Rounders 1' },

    // ALL ROUNDERS SET 2 (15)
    { id: 76, name: 'Jason Holder', role: 'All-Rounder', country: 'WI', base: 15000000, set: 'All-Rounders 2' },
    { id: 77, name: 'Shakib Al Hasan', role: 'All-Rounder', country: 'BAN', base: 15000000, set: 'All-Rounders 2' },
    { id: 78, name: 'Moeen Ali', role: 'All-Rounder', country: 'ENG', base: 20000000, set: 'All-Rounders 2' },
    { id: 79, name: 'Vijay Shankar', role: 'All-Rounder', country: 'IND', base: 5000000, set: 'All-Rounders 2' },
    { id: 80, name: 'Rishi Dhawan', role: 'All-Rounder', country: 'IND', base: 5000000, set: 'All-Rounders 2' },
    { id: 81, name: 'Chris Woakes', role: 'All-Rounder', country: 'ENG', base: 15000000, set: 'All-Rounders 2' },
    { id: 82, name: 'Sikandar Raza', role: 'All-Rounder', country: 'ZIM', base: 5000000, set: 'All-Rounders 2' },
    { id: 83, name: 'Dasun Shanaka', role: 'All-Rounder', country: 'SL', base: 5000000, set: 'All-Rounders 2' },
    { id: 84, name: 'Michael Bracewell', role: 'All-Rounder', country: 'NZ', base: 5000000, set: 'All-Rounders 2' },
    { id: 85, name: 'Kyle Mayers', role: 'All-Rounder', country: 'WI', base: 10000000, set: 'All-Rounders 2' },
    { id: 86, name: 'Daniel Sams', role: 'All-Rounder', country: 'AUS', base: 5000000, set: 'All-Rounders 2' },
    { id: 87, name: 'Harshal Patel', role: 'All-Rounder', country: 'IND', base: 15000000, set: 'All-Rounders 2' },
    { id: 88, name: 'Ramandeep Singh', role: 'All-Rounder', country: 'IND', base: 5000000, set: 'All-Rounders 2' },
    { id: 89, name: 'Rahul Tewatia', role: 'All-Rounder', country: 'IND', base: 10000000, set: 'All-Rounders 2' },
    { id: 90, name: 'Venkatesh Iyer', role: 'All-Rounder', country: 'IND', base: 10000000, set: 'All-Rounders 2' },

    // FAST BOWLERS SET 1 (15)
    { id: 91, name: 'Trent Boult', role: 'Fast Bowler', country: 'NZ', base: 20000000, set: 'Fast Bowlers 1' },
    { id: 92, name: 'Bhuvneshwar Kumar', role: 'Fast Bowler', country: 'IND', base: 20000000, set: 'Fast Bowlers 1' },
    { id: 93, name: 'T Natarajan', role: 'Fast Bowler', country: 'IND', base: 10000000, set: 'Fast Bowlers 1' },
    { id: 94, name: 'Josh Hazlewood', role: 'Fast Bowler', country: 'AUS', base: 20000000, set: 'Fast Bowlers 1' },
    { id: 95, name: 'Deepak Chahar', role: 'Fast Bowler', country: 'IND', base: 15000000, set: 'Fast Bowlers 1' },
    { id: 96, name: 'Umran Malik', role: 'Fast Bowler', country: 'IND', base: 7500000, set: 'Fast Bowlers 1' },
    { id: 97, name: 'Avesh Khan', role: 'Fast Bowler', country: 'IND', base: 10000000, set: 'Fast Bowlers 1' },
    { id: 98, name: 'Lockie Ferguson', role: 'Fast Bowler', country: 'NZ', base: 20000000, set: 'Fast Bowlers 1' },
    { id: 99, name: 'Mukesh Kumar', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 1' },
    { id: 100, name: 'Khaleel Ahmed', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 1' },
    { id: 101, name: 'Gerald Coetzee', role: 'Fast Bowler', country: 'SA', base: 10000000, set: 'Fast Bowlers 1' },
    { id: 102, name: 'Anrich Nortje', role: 'Fast Bowler', country: 'SA', base: 15000000, set: 'Fast Bowlers 1' },
    { id: 103, name: 'Mohit Sharma', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 1' },
    { id: 104, name: 'Sandeep Sharma', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 1' },
    { id: 105, name: 'Prasidh Krishna', role: 'Fast Bowler', country: 'IND', base: 10000000, set: 'Fast Bowlers 1' },

    // FAST BOWLERS SET 2 (15)
    { id: 106, name: 'Alzarri Joseph', role: 'Fast Bowler', country: 'WI', base: 10000000, set: 'Fast Bowlers 2' },
    { id: 107, name: 'Spencer Johnson', role: 'Fast Bowler', country: 'AUS', base: 10000000, set: 'Fast Bowlers 2' },
    { id: 108, name: 'Dilshan Madushanka', role: 'Fast Bowler', country: 'SL', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 109, name: 'Fazalhaq Farooqi', role: 'Fast Bowler', country: 'AFG', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 110, name: 'Naveen-ul-Haq', role: 'Fast Bowler', country: 'AFG', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 111, name: 'Jason Behrendorff', role: 'Fast Bowler', country: 'AUS', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 112, name: 'Jhye Richardson', role: 'Fast Bowler', country: 'AUS', base: 10000000, set: 'Fast Bowlers 2' },
    { id: 113, name: 'Nuwan Thushara', role: 'Fast Bowler', country: 'SL', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 114, name: 'Matheesha Pathirana', role: 'Fast Bowler', country: 'SL', base: 10000000, set: 'Fast Bowlers 2' },
    { id: 115, name: 'Mustafizur Rahman', role: 'Fast Bowler', country: 'BAN', base: 10000000, set: 'Fast Bowlers 2' },
    { id: 116, name: 'Chetan Sakariya', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 117, name: 'Kartik Tyagi', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 118, name: 'Yash Dayal', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 119, name: 'Vaibhav Arora', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 2' },
    { id: 120, name: 'Akash Deep', role: 'Fast Bowler', country: 'IND', base: 5000000, set: 'Fast Bowlers 2' },

    // SPINNERS SET 1 (15)
    { id: 121, name: 'Kuldeep Yadav', role: 'Spinner', country: 'IND', base: 15000000, set: 'Spinners 1' },
    { id: 122, name: 'Ravi Bishnoi', role: 'Spinner', country: 'IND', base: 10000000, set: 'Spinners 1' },
    { id: 123, name: 'Varun Chakravarthy', role: 'Spinner', country: 'IND', base: 7500000, set: 'Spinners 1' },
    { id: 124, name: 'Noor Ahmad', role: 'Spinner', country: 'AFG', base: 10000000, set: 'Spinners 1' },
    { id: 125, name: 'Maheesh Theekshana', role: 'Spinner', country: 'SL', base: 5000000, set: 'Spinners 1' },
    { id: 126, name: 'Adam Zampa', role: 'Spinner', country: 'AUS', base: 15000000, set: 'Spinners 1' },
    { id: 127, name: 'Rahul Chahar', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 1' },
    { id: 128, name: 'Sai Kishore', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 1' },
    { id: 129, name: 'Mujeeb Ur Rahman', role: 'Spinner', country: 'AFG', base: 5000000, set: 'Spinners 1' },
    { id: 130, name: 'Keshav Maharaj', role: 'Spinner', country: 'SA', base: 5000000, set: 'Spinners 1' },
    { id: 131, name: 'Adil Rashid', role: 'Spinner', country: 'ENG', base: 10000000, set: 'Spinners 1' },
    { id: 132, name: 'Tabraiz Shamsi', role: 'Spinner', country: 'SA', base: 5000000, set: 'Spinners 1' },
    { id: 133, name: 'Ish Sodhi', role: 'Spinner', country: 'NZ', base: 5000000, set: 'Spinners 1' },
    { id: 134, name: 'Suyash Sharma', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 1' },
    { id: 135, name: 'Mayank Markande', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 1' },

    // SPINNERS SET 2 (15)
    { id: 136, name: 'Shreyas Gopal', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 2' },
    { id: 137, name: 'Manav Suthar', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },
    { id: 138, name: 'Murugan Ashwin', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },
    { id: 139, name: 'Amit Mishra', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 2' },
    { id: 140, name: 'Piyush Chawla', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 2' },
    { id: 141, name: 'Karn Sharma', role: 'Spinner', country: 'IND', base: 5000000, set: 'Spinners 2' },
    { id: 142, name: 'Hrithik Shokeen', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },
    { id: 143, name: 'Todd Murphy', role: 'Spinner', country: 'AUS', base: 5000000, set: 'Spinners 2' },
    { id: 144, name: 'Akeal Hosein', role: 'Spinner', country: 'WI', base: 5000000, set: 'Spinners 2' },
    { id: 145, name: 'Rehan Ahmed', role: 'Spinner', country: 'ENG', base: 5000000, set: 'Spinners 2' },
    { id: 146, name: 'Qais Ahmad', role: 'Spinner', country: 'AFG', base: 5000000, set: 'Spinners 2' },
    { id: 147, name: 'Allah Ghazanfar', role: 'Spinner', country: 'AFG', base: 2000000, set: 'Spinners 2' },
    { id: 148, name: 'Kumar Kartikeya', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },
    { id: 149, name: 'Swapnil Singh', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },
    { id: 150, name: 'M Siddharth', role: 'Spinner', country: 'IND', base: 2000000, set: 'Spinners 2' },

    // WICKET KEEPERS SET 1 (15)
    { id: 151, name: 'Ishan Kishan', role: 'WK-Batsman', country: 'IND', base: 20000000, set: 'Wicket Keepers 1' },
    { id: 152, name: 'Quinton de Kock', role: 'WK-Batsman', country: 'SA', base: 20000000, set: 'Wicket Keepers 1' },
    { id: 153, name: 'Phil Salt', role: 'WK-Batsman', country: 'ENG', base: 15000000, set: 'Wicket Keepers 1' },
    { id: 154, name: 'Jitesh Sharma', role: 'WK-Batsman', country: 'IND', base: 5000000, set: 'Wicket Keepers 1' },
    { id: 155, name: 'Jonny Bairstow', role: 'WK-Batsman', country: 'ENG', base: 20000000, set: 'Wicket Keepers 1' },
    { id: 156, name: 'Dhruv Jurel', role: 'WK-Batsman', country: 'IND', base: 5000000, set: 'Wicket Keepers 1' },
    { id: 157, name: 'Rahmanullah Gurbaz', role: 'WK-Batsman', country: 'AFG', base: 5000000, set: 'Wicket Keepers 1' },
    { id: 158, name: 'Josh Inglis', role: 'WK-Batsman', country: 'AUS', base: 10000000, set: 'Wicket Keepers 1' },
    { id: 159, name: 'KS Bharat', role: 'WK-Batsman', country: 'IND', base: 5000000, set: 'Wicket Keepers 1' },
    { id: 160, name: 'Anuj Rawat', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Wicket Keepers 1' },
    { id: 161, name: 'Sam Billings', role: 'WK-Batsman', country: 'ENG', base: 10000000, set: 'Wicket Keepers 1' },
    { id: 162, name: 'Tom Banton', role: 'WK-Batsman', country: 'ENG', base: 10000000, set: 'Wicket Keepers 1' },
    { id: 163, name: 'Shai Hope', role: 'WK-Batsman', country: 'WI', base: 10000000, set: 'Wicket Keepers 1' },
    { id: 164, name: 'Ryan Rickelton', role: 'WK-Batsman', country: 'SA', base: 5000000, set: 'Wicket Keepers 1' },
    { id: 165, name: 'Vishnu Vinod', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Wicket Keepers 1' },

    // WICKET KEEPERS SET 2 (15)
    { id: 166, name: 'Prabhsimran Singh', role: 'WK-Batsman', country: 'IND', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 167, name: 'Dinesh Karthik', role: 'WK-Batsman', country: 'IND', base: 20000000, set: 'Wicket Keepers 2' },
    { id: 168, name: 'Matthew Wade', role: 'WK-Batsman', country: 'AUS', base: 10000000, set: 'Wicket Keepers 2' },
    { id: 169, name: 'Wriddhiman Saha', role: 'WK-Batsman', country: 'IND', base: 10000000, set: 'Wicket Keepers 2' },
    { id: 170, name: 'Litton Das', role: 'WK-Batsman', country: 'BAN', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 171, name: 'Kusal Mendis', role: 'WK-Batsman', country: 'SL', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 172, name: 'Donovan Ferreira', role: 'WK-Batsman', country: 'SA', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 173, name: 'Tristan Stubbs', role: 'WK-Batsman', country: 'SA', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 174, name: 'Ben McDermott', role: 'WK-Batsman', country: 'AUS', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 175, name: 'Glenn Phillips', role: 'WK-Batsman', country: 'NZ', base: 10000000, set: 'Wicket Keepers 2' },
    { id: 176, name: 'Alex Carey', role: 'WK-Batsman', country: 'AUS', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 177, name: 'Tim Seifert', role: 'WK-Batsman', country: 'NZ', base: 5000000, set: 'Wicket Keepers 2' },
    { id: 178, name: 'Upendra Yadav', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Wicket Keepers 2' },
    { id: 179, name: 'N Jagadeesan', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Wicket Keepers 2' },
    { id: 180, name: 'Ricky Bhui', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Wicket Keepers 2' },

    // UNCAPPED INDIANS SET 1 (15)
    { id: 181, name: 'Ashutosh Sharma', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 182, name: 'Shashank Singh', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 183, name: 'Abishek Porel', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 184, name: 'Nehal Wadhera', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 185, name: 'Naman Dhir', role: 'All-Rounder', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 186, name: 'Harshit Rana', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 187, name: 'Yash Thakur', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 188, name: 'Vidwath Kaverappa', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 189, name: 'Tanush Kotian', role: 'All-Rounder', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 190, name: 'Kumar Kushagra', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 191, name: 'Swastik Chikara', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 192, name: 'Rasikh Dar', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 193, name: 'Sushant Mishra', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 194, name: 'Sameer Rizvi', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },
    { id: 195, name: 'Robin Minz', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 1' },

    // UNCAPPED INDIANS SET 2 (15)
    { id: 196, name: 'Angkrish Raghuvanshi', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 197, name: 'Arshin Kulkarni', role: 'All-Rounder', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 198, name: 'Avanish Rao Aravelly', role: 'WK-Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 199, name: 'Manav Suthar', role: 'Spinner', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 200, name: 'M Siddharth', role: 'Spinner', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 201, name: 'Shreyas Gopal', role: 'Spinner', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 202, name: 'Kartik Tyagi', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 203, name: 'Akash Madhwal', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 204, name: 'Atharva Taide', role: 'Batsman', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 205, name: 'Ramandeep Singh', role: 'All-Rounder', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 206, name: 'Anshul Kamboj', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 207, name: 'Himanshu Sharma', role: 'Spinner', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 208, name: 'Mayank Yadav', role: 'Fast Bowler', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 209, name: 'Nitish Kumar Reddy', role: 'All-Rounder', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
    { id: 210, name: 'Abid Mushtaq', role: 'Spinner', country: 'IND', base: 2000000, set: 'Uncapped Indians 2' },
];

// --- UTILS ---
// Get unique set names
const SET_NAMES = [...new Set(PLAYERS_MASTER.map(p => p.set))];

// --- MAIN COMPONENT ---
const App = () => {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, SETUP, AUCTION, SET_SELECTION, VOTING, SUMMARY
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [myTeamId, setMyTeamId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [roomError, setRoomError] = useState('');
  const [isForcedExit, setIsForcedExit] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Config
  const [winCondition, setWinCondition] = useState('VOTE'); 
  const [useHomeAdvantage, setUseHomeAdvantage] = useState(true);

  // Synced State
  const [teams, setTeams] = useState(TEAMS_TEMPLATE);
  const [joinedUsers, setJoinedUsers] = useState([]); 
  const [currentSlot, setCurrentSlot] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [currentBidder, setCurrentBidder] = useState(null);
  const [auctionStatus, setAuctionStatus] = useState('WAITING'); 
  const [timer, setTimer] = useState(10);
  const [recentSales, setRecentSales] = useState([]);
  const [currentSetName, setCurrentSetName] = useState(SET_NAMES[0]);
  
  // Local UI State
  const [showSquadModal, setShowSquadModal] = useState(false);
  const [viewingTeamId, setViewingTeamId] = useState(null);
  
  // Derived viewing team to ensure live data
  const viewingTeam = teams.find(t => t.id === viewingTeamId);
  
  // Voting State
  const [votes, setVotes] = useState({}); 
  const [voteResults, setVoteResults] = useState(null);
  const [aiTieBreaker, setAiTieBreaker] = useState(null); 

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- FIREBASE LISTENER ---
  useEffect(() => {
    if (!roomId || !user) return;

    const unsub = onSnapshot(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setTeams(data.teams || TEAMS_TEMPLATE);
            setCurrentSlot(data.currentSlot || 0);
            setCurrentBid(data.currentBid || 0);
            setCurrentBidder(data.currentBidder);
            setAuctionStatus(data.auctionStatus);
            setRecentSales(data.recentSales || []);
            if (data.timer !== undefined) setTimer(data.timer);
            
            setWinCondition(data.winCondition || 'VOTE');
            setUseHomeAdvantage(data.useHomeAdvantage ?? true);
            setIsForcedExit(data.isForcedExit || false);
            setCurrentSetName(data.currentSetName || SET_NAMES[0]);
            
            const usersList = data.users ? Object.values(data.users) : [];
            setJoinedUsers(usersList);
            if (data.hostId === user.uid) setIsHost(true);
            if (data.gameState) setGameState(data.gameState);
            
            if (data.users && data.users[user.uid] && data.users[user.uid].teamId) {
                 setMyTeamId(data.users[user.uid].teamId);
            }
            
            if (data.votes) setVotes(data.votes);
            if (data.voteResults) setVoteResults(data.voteResults);
            if (data.aiTieBreaker) setAiTieBreaker(data.aiTieBreaker);
        }
    });
    return () => unsub();
  }, [roomId, user]);

  // --- HOST TIMER LOOP (Simplified V7.0) ---
  useEffect(() => {
    if (!isHost || !roomId) return;
    
    let interval;

    if (gameState === 'AUCTION' && auctionStatus === 'BIDDING') {
        interval = setInterval(() => {
             if (timer > 0) {
                 updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), { timer: timer - 1 });
             } else {
                 clearInterval(interval);
                 updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), { auctionStatus: 'PROCESSING' });
                 setTimeout(handleSold, 500);
             }
        }, 1000);
    }
    
    if (gameState === 'AUCTION' && (auctionStatus === 'SOLD' || auctionStatus === 'UNSOLD')) {
         interval = setInterval(() => {
            if (timer > 0) {
                 updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), { timer: timer - 1 });
            } else {
                 clearInterval(interval);
                 nextPlayer();
            }
         }, 1000);
    }

    return () => clearInterval(interval);
  }, [isHost, roomId, gameState, auctionStatus, timer]);

  // --- ACTIONS ---

  const createRoom = async () => {
      if (!user || !userName) return setRoomError("Enter name");
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const roomDoc = {
          hostId: user.uid,
          gameState: 'SETUP',
          teams: TEAMS_TEMPLATE,
          currentSlot: 0,
          currentSetName: SET_NAMES[0],
          currentBid: 0,
          currentBidder: null,
          auctionStatus: 'WAITING',
          timer: 10,
          recentSales: [],
          users: {},
          winCondition: 'VOTE',
          useHomeAdvantage: true,
          isForcedExit: false
      };
      await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', newRoomId), roomDoc);
      setRoomId(newRoomId);
      setIsHost(true);
      setGameState('SETUP');
      joinUserToRoom(newRoomId, user.uid, userName + " (Host)");
  };

  const joinRoom = async () => {
      if (!user || !roomCode || !userName) return setRoomError("Enter details");
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomCode);
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
          setRoomId(roomCode);
          setIsHost(snap.data().hostId === user.uid);
          joinUserToRoom(roomCode, user.uid, userName);
      } else {
          setRoomError("Room not found");
      }
  };

  const joinUserToRoom = async (rId, uid, name) => {
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', rId), {
          [`users.${uid}`]: { uid, name, teamId: null }
      });
  };

  const selectTeam = async (teamId) => {
      if (!roomId || !user) return;
      setMyTeamId(teamId);
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      await updateDoc(roomRef, {
          [`users.${user.uid}.teamId`]: teamId,
          [`users.${user.uid}.name`]: `${userName} (${teamId})` 
      });
  };

  // --- ADMIN: REFUND & REMOVE PLAYER ---
  const removePlayerFromSquad = async (teamId, player) => {
      if(!isHost) return;
      
      // Direct removal logic (V7 style) - No confirmation, No complex checks
      // Relies on local state for immediate feedback
      const targetTeam = teams.find(t => t.id === teamId);
      if (!targetTeam) return;

      // Filter out the player
      const newSquad = targetTeam.squad.filter(p => p.id !== player.id);
      
      // Refund logic
      const newPurse = targetTeam.purse + player.price;
      const newOverseas = player.country !== 'IND' ? targetTeam.overseas - 1 : targetTeam.overseas;
      
      const updatedTeams = teams.map(t => t.id === teamId ? { 
          ...t, 
          squad: newSquad, 
          purse: newPurse, 
          overseas: newOverseas 
      } : t);
      
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          teams: updatedTeams
      });
  };

  // --- SET SELECTION LOGIC ---
  const selectNextSet = async (setName) => {
      // Find first player of this set
      const startIndex = PLAYERS_MASTER.findIndex(p => p.set === setName);
      if(startIndex === -1) return;
      
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          currentSetName: setName,
          currentSlot: startIndex,
          currentBid: 0,
          currentBidder: null,
          auctionStatus: 'WAITING',
          gameState: 'AUCTION' // Go back to auction
      });
  };

  const submitBid = async () => {
      if (!roomId || !myTeamId || auctionStatus !== 'BIDDING') return;
      const player = PLAYERS_MASTER[currentSlot];
      const myTeam = teams.find(t => t.id === myTeamId);
      const nextBidAmount = getNextBid(currentBid, player.base);

      if (myTeam.purse < nextBidAmount) return;

      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          currentBid: nextBidAmount,
          currentBidder: myTeam,
          timer: 10 // FORCE RESET for everyone immediately
      });
  };

  const handleSold = async () => {
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      const snap = await getDoc(roomRef);
      if (!snap.exists()) return;
      const data = snap.data();
      
      if (data.auctionStatus === 'SOLD' || data.auctionStatus === 'UNSOLD') return;

      const latestBidder = data.currentBidder;
      const player = PLAYERS_MASTER[data.currentSlot];

      if (latestBidder) {
          const updatedTeams = data.teams.map(t => {
              if (t.id === latestBidder.id) {
                  return {
                      ...t,
                      purse: t.purse - data.currentBid,
                      squad: [...t.squad, { ...player, price: data.currentBid }],
                      overseas: (player.country !== 'IND') ? t.overseas + 1 : t.overseas
                  };
              }
              return t;
          });
          await updateDoc(roomRef, {
              teams: updatedTeams,
              auctionStatus: 'SOLD',
              timer: 10, 
              recentSales: [{ id: Date.now(), player: player.name, team: latestBidder.id, teamColor: latestBidder.primary, price: data.currentBid }, ...data.recentSales].slice(0, 5)
          });
      } else {
          await updateDoc(roomRef, { auctionStatus: 'UNSOLD', timer: 10 });
      }
  };

  const skipPlayer = async () => {
      if(!isHost) return;
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          auctionStatus: 'UNSOLD',
          timer: 5 // Quick skip
      });
  };

  const nextPlayer = async () => {
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      const snap = await getDoc(roomRef);
      const currentSlot = snap.data().currentSlot;
      const currentSetName = snap.data().currentSetName;
      
      // Check if next player exists in SAME set
      const nextP = PLAYERS_MASTER[currentSlot + 1];
      
      if (!nextP || nextP.set !== currentSetName) {
          // End of Set -> Go to Set Selection
          await updateDoc(roomRef, { gameState: 'SET_SELECTION' });
      } else {
          await updateDoc(roomRef, {
              currentSlot: currentSlot + 1,
              currentBid: 0,
              currentBidder: null,
              auctionStatus: 'WAITING'
          });
          setTimeout(() => updateDoc(roomRef, { auctionStatus: 'BIDDING', timer: 10 }), 2000);
      }
  };
  
  // --- ENDGAME LOGIC ---
  
  const triggerEndGame = async (forced = true) => {
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      const updates = { gameState: 'VOTE', isForcedExit: forced };
      
      if(winCondition === 'AI') {
          await updateDoc(roomRef, updates);
          setTimeout(() => calculateAIWinner(forced), 500);
      } else {
          await updateDoc(roomRef, updates);
      }
  };

  const castVote = async (targetTeamId) => {
      if(targetTeamId === myTeamId) return; 
      await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          [`votes.${user.uid}`]: targetTeamId
      });
  };
  
  const calculateVoteWinner = async () => {
     const counts = {};
     Object.values(votes).forEach(tId => counts[tId] = (counts[tId] || 0) + 1);
     const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
     
     if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) {
         const tiedTeams = sorted.filter(entry => entry[1] === sorted[0][1]).map(e => e[0]);
         await calculateAITieBreaker(tiedTeams);
     } else {
         const winnerId = sorted[0]?.[0];
         await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
            voteResults: { winnerId, counts },
            gameState: 'SUMMARY'
         });
     }
  };

  const calculateAITieBreaker = async (tiedTeamIds) => {
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      const snap = await getDoc(roomRef);
      const currentTeams = snap.data().teams.filter(t => tiedTeamIds.includes(t.id));
      
      const results = runAIScoring(currentTeams, true);
      const winner = results[0];
      
      await updateDoc(roomRef, {
          voteResults: { winnerId: winner.id, isTieBreak: true },
          aiTieBreaker: winner,
          gameState: 'SUMMARY'
      });
  };

  const calculateAIWinner = async (forced) => {
      const roomRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId);
      const snap = await getDoc(roomRef);
      const currentTeams = snap.data().teams;
      
      const results = runAIScoring(currentTeams, forced);
      
      await updateDoc(roomRef, {
          voteResults: { winnerId: results[0].id, scores: results },
          gameState: 'SUMMARY'
      });
  };

  // --- 50/30/20 SCORING SYSTEM ---
  const runAIScoring = (teamList, forced) => {
      const results = teamList.map(t => {
          if(!forced && t.squad.length < MIN_SQUAD) return { id: t.id, score: -1, reason: 'Disqualified (<16 Players)' };
          
          let score = 0; // Max 100
          let reasons = [];
          
          // 1. BALANCE (50%)
          const bats = t.squad.filter(p => p.role.includes('Batsman')).length;
          const bowls = t.squad.filter(p => p.role.includes('Bowler') || p.role.includes('Spinner')).length;
          const alls = t.squad.filter(p => p.role.includes('All-Rounder')).length;
          const wks = t.squad.filter(p => p.role.includes('WK')).length;
          
          let balanceScore = 0;
          if(bats >= 5) balanceScore += 12.5;
          if(bowls >= 5) balanceScore += 12.5;
          if(alls >= 2) balanceScore += 12.5;
          if(wks >= 1) balanceScore += 12.5;
          score += balanceScore;
          reasons.push(`Balance: ${balanceScore}/50`);

          // 2. HOME PITCH (30%)
          if(useHomeAdvantage) {
              const homeMatches = t.squad.filter(p => t.homeType.some(type => p.role.includes(type))).length;
              const homeScore = Math.min(30, homeMatches * 5);
              score += homeScore;
              reasons.push(`Home: ${homeScore}/30`);
          }
          
          // 3. VALUE / ECONOMY (20%)
          let valueScore = 10; // Start with 10 base
          t.squad.forEach(p => {
              // Steal Deal Bonus (Base > 2Cr, Sold < 5Cr)
              if(p.base >= 20000000 && p.price <= 50000000) valueScore += 2; 
              // Overspending Penalty (> 15Cr)
              if(p.price > 150000000) valueScore -= 2;
          });
          valueScore = Math.max(0, Math.min(20, valueScore));
          score += valueScore;
          reasons.push(`Value: ${valueScore}/20`);
          
          return { id: t.id, score, details: reasons.join(' | ') };
      });
      return results.sort((a,b) => b.score - a.score);
  };

  const resetAuction = async () => {
       await updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), {
          gameState: 'SETUP',
          teams: TEAMS_TEMPLATE,
          currentSlot: 0,
          currentBid: 0,
          currentBidder: null,
          auctionStatus: 'WAITING',
          timer: 10,
          recentSales: [],
          votes: {},
          voteResults: null,
          aiTieBreaker: null,
          isForcedExit: false
       });
  };
  
  const copyToClipboard = () => {
     const textArea = document.createElement("textarea");
     textArea.value = roomId;
     textArea.style.position = "fixed"; 
     textArea.style.opacity = "0";
     document.body.appendChild(textArea);
     textArea.focus();
     textArea.select();
     try {
         document.execCommand('copy');
         setCopySuccess(true);
     } catch (err) { console.error(err); }
     document.body.removeChild(textArea);
     setTimeout(() => setCopySuccess(false), 2000);
  };

  // --- HELPERS ---
  const activePlayer = PLAYERS_MASTER[currentSlot];
  const upcomingPlayers = PLAYERS_MASTER.slice(currentSlot + 1).filter(p => p.set === activePlayer.set);
  const getNextBid = (curr, base) => (curr === 0 ? base : curr < 50000000 ? curr + 5000000 : curr + 10000000);
  const formatMoney = (amount) => {
    if (!amount) return '₹ 0';
    if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(0)} L`;
    return `₹ ${amount}`;
  };
  
  const getManagerName = (teamId) => {
      const manager = joinedUsers.find(u => u.teamId === teamId);
      return manager ? manager.name : TEAMS_TEMPLATE.find(t=>t.id===teamId).name;
  };

  const openSquadModal = (team) => {
      setViewingTeamId(team.id); // Only store ID to allow live updates
      setShowSquadModal(true);
  };

  const activeTeams = teams.filter(t => joinedUsers.some(u => u.teamId === t.id));

  // --- MODAL RENDERER ---
  const renderSquadModal = () => {
     if (!showSquadModal || !viewingTeam) return null;
     return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800 w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg" style={{ backgroundColor: viewingTeam.primary }}>{viewingTeam.id}</div>
                        <div>
                            <h2 className="font-bold text-xl text-white leading-none">{viewingTeam.name}</h2>
                            <p className="text-xs text-slate-400 mt-1">{getManagerName(viewingTeam.id)}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSquadModal(false)} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition"><X className="text-slate-400 hover:text-white"/></button>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 text-center text-xs bg-slate-800/50">
                     <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                         <div className="text-slate-400 uppercase tracking-wider mb-1">Purse Left</div>
                         <div className="font-mono font-bold text-green-400 text-sm">{formatMoney(viewingTeam.purse)}</div>
                     </div>
                     <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                         <div className="text-slate-400 uppercase tracking-wider mb-1">Squad Size</div>
                         <div className={`font-bold text-sm ${viewingTeam.squad.length < MIN_SQUAD ? 'text-red-400' : 'text-white'}`}>{viewingTeam.squad.length}/{MAX_SQUAD}</div>
                     </div>
                     <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                         <div className="text-slate-400 uppercase tracking-wider mb-1">Overseas</div>
                         <div className={`font-bold text-sm ${viewingTeam.overseas > MAX_OVERSEAS ? 'text-red-400' : 'text-white'}`}>{viewingTeam.overseas}/{MAX_OVERSEAS}</div>
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-800">
                     {viewingTeam.squad.length === 0 ? (
                         <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                             <Users size={48} className="mb-2"/>
                             <p>No players purchased yet</p>
                         </div>
                     ) : (
                         <table className="w-full text-left text-sm border-collapse">
                             <thead className="text-xs text-slate-500 uppercase bg-slate-900/50 sticky top-0">
                                 <tr>
                                     <th className="py-3 px-4 rounded-l-lg">Player</th>
                                     <th className="py-3 px-4">Role</th>
                                     <th className="py-3 px-4 text-right">Sold For</th>
                                     {isHost && <th className="py-3 px-4 rounded-r-lg text-center">Action</th>}
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-700/50">
                                 {viewingTeam.squad.map(p => (
                                     <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                                         <td className="py-3 px-4 font-bold text-slate-200">{p.name}</td>
                                         <td className="py-3 px-4 text-slate-400 text-xs">
                                             <span className="bg-slate-700 px-2 py-1 rounded border border-slate-600">{p.role}</span>
                                         </td>
                                         <td className="py-3 px-4 text-right font-mono text-yellow-500 font-bold">{formatMoney(p.price)}</td>
                                         {isHost && (
                                             <td className="py-3 px-4 text-center">
                                                 <button onClick={()=>removePlayerFromSquad(viewingTeam.id, p)} className="text-red-500 hover:text-red-400 p-1 rounded bg-red-900/20"><Trash2 size={14}/></button>
                                             </td>
                                         )}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     )}
                </div>
            </div>
        </div>
     );
  };

  // --- RENDER: LOBBY ---
  if (gameState === 'LOBBY') {
     return (
       <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
         <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
            <h1 className="text-4xl font-black text-yellow-400 mb-2">IPL AUCTION 2025</h1>
            <p className="text-slate-400 mb-8">Multiplayer Manager • Created by Shay</p>
            
            <div className="mb-6 text-left bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-yellow-400 font-bold">
                    <BookOpen size={16} /> TOURNAMENT RULES
                </div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    <li>Purse: <span className="text-white">₹ 120 Crores</span></li>
                    <li>Squad Size: <span className="text-white">{MIN_SQUAD} - {MAX_SQUAD} Players</span></li>
                    <li>Overseas Limit: <span className="text-white">Max {MAX_OVERSEAS} Players</span></li>
                </ul>
            </div>

            <div className="space-y-3">
                <input type="text" placeholder="ENTER YOUR NAME" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-blue-500" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <div className="h-px bg-slate-700 w-full my-2"></div>
                <button onClick={createRoom} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg">CREATE NEW ROOM</button>
                <div className="flex gap-2 mt-2">
                    <input type="text" placeholder="ROOM CODE" className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 font-mono text-center uppercase text-white" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} />
                    <button onClick={joinRoom} className="bg-green-600 hover:bg-green-500 text-white px-6 rounded-xl font-bold">JOIN</button>
                </div>
            </div>
            {roomError && <p className="text-red-500 text-sm mt-4 flex items-center justify-center gap-1"><AlertCircle size={14}/> {roomError}</p>}
         </div>
       </div>
     );
  }

  // --- RENDER: SETUP ---
  if (gameState === 'SETUP') {
     return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center">
           <div className="max-w-5xl w-full">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div>
                     <h2 className="text-2xl font-bold">Lobby <span className="text-slate-500">#{roomId}</span></h2>
                     <p className="text-slate-400 text-sm">Waiting for managers...</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2">
                          <span className="text-slate-400 text-xs">CODE:</span>
                          <span className="text-2xl font-mono font-bold text-yellow-400 tracking-widest">{roomId}</span>
                          <button onClick={copyToClipboard} className="ml-2 text-slate-400 hover:text-white transition-colors">
                              {copySuccess ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
                          </button>
                      </div>
                  
                      {isHost && (
                        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button onClick={()=>setWinCondition('VOTE')} className={`px-3 py-1 rounded text-xs font-bold ${winCondition==='VOTE'?'bg-blue-600 text-white':'text-slate-400'}`}>VOTE WIN</button>
                            <button onClick={()=>setWinCondition('AI')} className={`px-3 py-1 rounded text-xs font-bold ${winCondition==='AI'?'bg-purple-600 text-white':'text-slate-400'}`}>AI JUDGE</button>
                        </div>
                      )}
                      {isHost && (
                         <button onClick={()=>setUseHomeAdvantage(!useHomeAdvantage)} className={`text-xs font-bold px-3 py-2 rounded border ${useHomeAdvantage ? 'bg-green-900/30 border-green-500 text-green-400' : 'border-slate-600 text-slate-500'}`}>
                            Home Adv: {useHomeAdvantage?'ON':'OFF'}
                         </button>
                      )}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {teams.map(t => {
                        const manager = joinedUsers.find(u => u.teamId === t.id);
                        const isMe = myTeamId === t.id;
                        return (
                           <button 
                             key={t.id} 
                             onClick={() => !manager && selectTeam(t.id)}
                             disabled={manager && !isMe}
                             className={`relative p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${isMe ? 'bg-slate-800 border-yellow-500 shadow-lg shadow-yellow-500/20' : manager ? 'opacity-50 bg-slate-900 border-slate-800 cursor-not-allowed' : 'bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-500'}`}
                           >
                              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs" style={{backgroundColor: t.primary}}>{t.id}</div>
                              <div className="font-bold text-xs">{t.name}</div>
                              {manager && <div className="absolute top-2 right-2 text-[10px] bg-slate-950 px-2 rounded text-slate-400">{manager.name.split(' ')[0]}</div>}
                           </button>
                        );
                    })}
                 </div>
                 <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col">
                    <h3 className="font-bold text-slate-300 mb-3 text-sm flex items-center gap-2"><Users size={14}/> MANAGERS ({joinedUsers.length})</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar max-h-60">
                        {joinedUsers.map(u => (
                            <div key={u.uid} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-sm font-bold text-slate-200">{u.name}</span>
                            </div>
                        ))}
                    </div>
                    {isHost ? (
                        <button onClick={()=>updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'auction_rooms', roomId), { gameState: 'AUCTION', auctionStatus: 'WAITING' })} disabled={joinedUsers.length < 1} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                            <Play size={16}/> START AUCTION
                        </button>
                    ) : (
                        <div className="mt-4 text-center text-xs text-slate-500 animate-pulse">Waiting for host...</div>
                    )}
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // --- RENDER: SET SELECTION ---
  if (gameState === 'SET_SELECTION') {
      return (
          <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
              <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                  <h1 className="text-3xl font-bold text-center mb-2 text-white">Select Next Set</h1>
                  <p className="text-slate-400 text-center mb-8">{isHost ? 'Choose the next category of players' : 'Host is selecting the next set...'}</p>
                  
                  {isHost ? (
                      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                          {SET_NAMES.map(set => (
                              <button 
                                  key={set} 
                                  onClick={()=>selectNextSet(set)}
                                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-left font-bold flex justify-between items-center group"
                              >
                                  {set}
                                  <ChevronRight className="text-slate-500 group-hover:text-white"/>
                              </button>
                          ))}
                      </div>
                  ) : (
                      <div className="flex justify-center py-12">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- RENDER: AUCTION ---
  if (gameState === 'AUCTION') {
    const myTeam = teams.find(t=>t.id===myTeamId);
    const canAfford = myTeam && myTeam.purse >= getNextBid(currentBid, activePlayer.base);
    const isLeader = currentBidder?.id === myTeamId;
    const squadFull = myTeam && myTeam.squad.length >= MAX_SQUAD;
    const overseasFull = myTeam && activePlayer.country !== 'IND' && myTeam.overseas >= MAX_OVERSEAS;
    
    return (
      <div className="flex flex-col h-screen bg-black text-white overflow-hidden font-sans select-none">
        {renderSquadModal()}
        {/* TICKER */}
        <div className="h-8 bg-blue-950 flex items-center px-4 border-b border-blue-900 z-30">
           <div className="flex items-center gap-2 mr-4 min-w-max">
               <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">LIVE FEED</span>
           </div>
           <div className="flex-1 overflow-hidden flex gap-6 text-[10px] font-mono text-slate-300">
               {recentSales.map(sale => (
                   <span key={sale.id} className="flex items-center gap-1 opacity-80">
                       <span className="text-white font-bold">{sale.player}</span>
                       <span className="text-slate-500">➜</span>
                       <span style={{color: sale.teamColor}}>{sale.team}</span>
                       <span className="text-yellow-500">({formatMoney(sale.price)})</span>
                   </span>
               ))}
           </div>
           {isHost && <button onClick={resetAuction} className="ml-4 text-[10px] text-red-500 hover:text-white flex items-center gap-1"><RefreshCw size={10}/> RESET</button>}
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            {/* SIDEBAR - ACTIVE TEAMS */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 hidden md:flex">
                <div className="p-3 border-b border-slate-800 bg-slate-950">
                    <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Franchises</h2>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {activeTeams.sort((a,b)=>b.purse-a.purse).map(team => (
                        <div key={team.id} onClick={()=> openSquadModal(team)} className={`p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800 flex justify-between items-center ${team.id===currentBidder?.id?'bg-yellow-900/20 border-l-2 border-yellow-500':'border-l-2 border-transparent'}`}>
                             <div className="flex items-center gap-2 overflow-hidden">
                                 <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white" style={{backgroundColor: team.primary}}>{team.id}</div>
                                 <div className="min-w-0">
                                     <div className="text-[11px] font-bold text-slate-200 truncate w-24">{getManagerName(team.id).split('(')[0]}</div>
                                     <div className="text-[9px] text-slate-500">{team.squad.length}/{MAX_SQUAD} • {team.overseas} OS</div>
                                 </div>
                             </div>
                             <div className="text-[10px] font-mono text-green-400">{formatMoney(team.purse)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN STAGE */}
            <div className="flex-1 flex flex-col relative bg-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-black pointer-events-none"></div>
                
                {/* HEADER */}
                <div className="relative z-10 p-4 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-700 uppercase">{activePlayer.set}</span>
                        </div>
                        <div className="text-4xl font-black text-white tracking-tight drop-shadow-xl">{activePlayer.name.toUpperCase()}</div>
                        <div className="flex gap-2 mt-2">
                             <span className="bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-800/50">{activePlayer.country}</span>
                             <span className="bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-800/50">{activePlayer.role}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-500 text-[10px] uppercase mb-1">Base Price</div>
                        <div className="text-xl font-mono text-white font-bold">{formatMoney(activePlayer.base)}</div>
                    </div>
                </div>

                {/* AUCTION CARD */}
                <div className="flex-1 flex items-center justify-center relative z-10 p-4">
                    
                    {/* SOLD OVERLAY */}
                    {(auctionStatus === 'SOLD' && currentBidder) && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 text-center">
                             <div className="text-lg text-slate-400 uppercase tracking-widest mb-6">SOLD TO</div>
                             <div className="w-24 h-24 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-6 animate-bounce border-4 border-white/10" style={{backgroundColor: currentBidder.primary}}>
                                 {currentBidder.id}
                             </div>
                             <div className="text-4xl font-black text-white mb-2">{getManagerName(currentBidder.id).split('(')[0]}</div>
                             <div className="text-3xl font-mono text-yellow-400 font-bold">for {formatMoney(currentBid)}</div>
                             <div className="mt-8 text-slate-500 text-xs animate-pulse">NEXT PLAYER IN {timer}s</div>
                        </div>
                    )}

                     {/* UNSOLD OVERLAY */}
                    {auctionStatus === 'UNSOLD' && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
                             <div className="text-5xl font-black text-red-500 border-4 border-red-500 p-4 rounded-xl rotate-12 opacity-80">UNSOLD</div>
                             <div className="mt-8 text-slate-500 text-xs animate-pulse">NEXT PLAYER IN {timer}s</div>
                        </div>
                    )}

                    {/* MAIN CARD */}
                    <div className="relative w-full max-w-sm bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-6 shadow-2xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            {auctionStatus === 'BIDDING' ? (
                                <div className="bg-yellow-500 text-black px-4 py-1 rounded-full font-bold text-xs shadow-lg shadow-yellow-500/50 animate-pulse flex items-center gap-1"><Gavel size={12}/> BIDDING LIVE</div>
                            ) : auctionStatus === 'WAITING' ? (
                                <div className="bg-blue-600 text-white px-4 py-1 rounded-full font-bold text-xs shadow-lg">UP NEXT</div>
                            ) : null}
                        </div>

                        <div className="mt-4 text-center">
                             <div className="bg-black/30 rounded-xl p-4 border border-slate-700/50 mb-6">
                                 <div className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Current Bid</div>
                                 <div className="text-4xl font-mono font-bold text-yellow-400">{formatMoney(currentBid)}</div>
                                 <div className="h-6 mt-2 flex items-center justify-center gap-2">
                                     {currentBidder ? (
                                         <>
                                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: currentBidder.primary}}></div>
                                            <span className="text-sm font-bold text-white">{getManagerName(currentBidder.id).split('(')[0]}</span>
                                         </>
                                     ) : <span className="text-slate-600 text-xs italic">No bids yet</span>}
                                 </div>
                             </div>
                             
                             {auctionStatus === 'BIDDING' && (
                                 <div className={`text-6xl font-black transition-all duration-200 ${timer<=3?'text-red-500 scale-110':'text-slate-700'}`}>{timer}</div>
                             )}
                        </div>
                    </div>
                </div>

                {/* ACTION BAR */}
                <div className="bg-slate-900 border-t border-slate-800 p-4 z-30 safe-area-bottom">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* MY STATS */}
                        {myTeamId && (
                            <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 w-full md:w-auto">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm text-xs" style={{backgroundColor: teams.find(t=>t.id===myTeamId).primary}}>{myTeamId}</div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase">Purse Left</div>
                                    <div className={`font-mono font-bold text-sm ${teams.find(t=>t.id===myTeamId).purse<getNextBid(currentBid, activePlayer.base)?'text-red-500':'text-white'}`}>{formatMoney(teams.find(t=>t.id===myTeamId).purse)}</div>
                                </div>
                                <button onClick={()=>{setViewingTeamId(myTeamId); setShowSquadModal(true);}} className="ml-auto bg-slate-700 p-2 rounded hover:bg-slate-600"><List size={14}/></button>
                            </div>
                        )}
                        
                        {/* BUTTONS */}
                        <div className="flex gap-2 w-full md:w-auto">
                            {isHost && auctionStatus === 'WAITING' && (
                                <div className="flex gap-2 w-full">
                                    <button onClick={()=>updateDoc(doc(db,'artifacts',APP_ID,'public','data','auction_rooms',roomId),{auctionStatus:'BIDDING',timer:10})} className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg">START BIDDING</button>
                                    <button onClick={()=>updateDoc(doc(db,'artifacts',APP_ID,'public','data','auction_rooms',roomId),{gameState:'SET_SELECTION'})} className="bg-slate-700 px-4 rounded-lg font-bold text-xs">CHANGE SET</button>
                                </div>
                            )}
                            {isHost && auctionStatus === 'BIDDING' && (
                                <button onClick={skipPlayer} className="bg-slate-800 text-slate-400 px-4 py-3 rounded-lg font-bold text-xs border border-slate-700 hover:text-white">SKIP</button>
                            )}
                            
                            {auctionStatus === 'BIDDING' && myTeamId && (
                                <button 
                                   onClick={submitBid}
                                   disabled={isLeader || !canAfford || timer <= 0 || squadFull || overseasFull} 
                                   className={`flex-1 px-8 py-3 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${isLeader?'bg-slate-800 text-slate-500 cursor-not-allowed': (!canAfford || squadFull || overseasFull)?'bg-red-900/50 text-red-300 border border-red-800 cursor-not-allowed':'bg-yellow-500 hover:bg-yellow-400 text-black'}`}
                                >
                                   <Gavel size={16}/> {
                                       isLeader ? 'YOU LEAD' : 
                                       squadFull ? 'SQUAD FULL' : 
                                       overseasFull ? 'MAX OVERSEAS' : 
                                       !canAfford ? 'NO FUNDS' : 
                                       `BID ${formatMoney(getNextBid(currentBid, activePlayer.base))}`
                                   }
                                </button>
                            )}
                             {/* Manual End Game Trigger for Host */}
                             {isHost && (
                                <button onClick={()=>triggerEndGame(true)} className="bg-slate-800 text-red-400 px-3 py-3 rounded-lg font-bold text-xs hover:bg-slate-700 border border-slate-700">END GAME</button>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR - UPCOMING */}
            <div className="w-64 bg-slate-950 border-l border-slate-800 flex flex-col z-20 hidden lg:flex">
                <div className="p-3 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-950">Upcoming in {activePlayer.set}</div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar pb-20">
                    {upcomingPlayers.map(p => (
                        <div key={p.id} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center opacity-70">
                            <div>
                                <div className="text-slate-300 text-xs font-bold">{p.name}</div>
                                <div className="text-slate-500 text-[9px]">{p.role}</div>
                            </div>
                            <div className="text-slate-600 text-[9px] font-mono">{formatMoney(p.base)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: SUMMARY / VOTING ---
  if (gameState === 'VOTE' || gameState === 'SUMMARY') {
      return (
         <div className="min-h-screen bg-slate-900 text-white p-8 overflow-auto flex flex-col items-center">
             {renderSquadModal()}
             <h1 className="text-4xl font-black text-yellow-400 mb-4 text-center">{gameState==='SUMMARY' ? 'TOURNAMENT RESULTS' : 'CAST YOUR VOTE'}</h1>
             
             {gameState === 'VOTE' && isHost && (
                 <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-600 mb-8 animate-pulse">
                     <span className="text-slate-400 text-sm font-bold">VOTES CAST: </span>
                     <span className="text-white font-mono text-lg font-bold ml-2">{Object.keys(votes).length} / {joinedUsers.length}</span>
                 </div>
             )}
             
             {gameState === 'SUMMARY' && voteResults && (
                 <div className="mb-12 text-center animate-fade-in max-w-xl w-full">
                     <div className="text-slate-400 uppercase tracking-widest text-sm mb-4">WINNER</div>
                     <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-white shadow-2xl mb-4 border-4 border-yellow-400" style={{backgroundColor: teams.find(t=>t.id===voteResults.winnerId)?.primary}}>
                         {voteResults.winnerId}
                     </div>
                     <div className="text-3xl font-bold">{teams.find(t=>t.id===voteResults.winnerId)?.name}</div>
                     
                     {/* AI VERDICT CARD */}
                     {(winCondition === 'AI' || voteResults.isTieBreak) && (
                         <div className="mt-6 bg-slate-800 p-6 rounded-xl border border-slate-600 shadow-lg text-left">
                             <div className="flex justify-between items-start mb-3">
                                 <div className="text-xs text-yellow-400 uppercase font-bold flex items-center gap-2">
                                    <Info size={14}/> {voteResults.isTieBreak ? 'TIE BREAKER DECISION' : 'AI VERDICT'}
                                 </div>
                                 <div className="text-right font-mono text-green-400 font-bold text-xl">
                                     {voteResults.isTieBreak ? aiTieBreaker.score.toFixed(0) : voteResults.scores[0].score.toFixed(0)} Pts
                                 </div>
                             </div>
                             <div className="text-sm text-slate-300 leading-relaxed">
                                 {voteResults.isTieBreak ? aiTieBreaker.details : voteResults.scores[0].details}
                             </div>
                         </div>
                     )}
                     
                     {/* VOTE COUNT SUMMARY */}
                     {winCondition === 'VOTE' && !voteResults.isTieBreak && (
                         <div className="mt-6 grid grid-cols-2 gap-2 text-left bg-slate-800 p-4 rounded-xl border border-slate-700">
                             {Object.entries(voteResults.counts).sort((a,b)=>b[1]-a[1]).map(([tid, count]) => (
                                 <div key={tid} className="flex justify-between text-xs border-b border-slate-700 pb-1 mb-1">
                                     <span className="font-bold text-white">{tid}</span>
                                     <span className="text-slate-400">{count} votes</span>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                 {activeTeams.map(team => {
                     const isMine = team.id === myTeamId;
                     const disqualified = !isForcedExit && team.squad.length < MIN_SQUAD;
                     return (
                         <div key={team.id} onClick={()=>{setViewingTeamId(team.id); setShowSquadModal(true);}} className={`bg-slate-800 rounded-xl border overflow-hidden cursor-pointer transition hover:border-slate-500 ${disqualified ? 'border-red-500 opacity-60' : 'border-slate-700'}`}>
                             <div className="p-4 flex justify-between items-center" style={{backgroundColor: team.primary}}>
                                 <div className="font-bold text-white">{team.name}</div>
                                 {disqualified && <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded">DISQUALIFIED</span>}
                             </div>
                             <div className="p-4">
                                 <div className="flex justify-between text-xs text-slate-400 mb-4">
                                     <span>Squad: {team.squad.length}</span>
                                     <span>Spent: {formatMoney(INITIAL_PURSE - team.purse)}</span>
                                 </div>
                                 <div className="h-40 overflow-y-auto custom-scrollbar space-y-1 mb-4">
                                     {team.squad.map(p => (
                                         <div key={p.id} className="flex justify-between text-xs border-b border-slate-700 pb-1">
                                             <span className="text-white">{p.name}</span>
                                             <span className="text-slate-500">{formatMoney(p.price)}</span>
                                         </div>
                                     ))}
                                 </div>
                                 {gameState === 'VOTE' && !isMine && !disqualified && (
                                     <button 
                                        onClick={(e)=>{e.stopPropagation(); castVote(team.id);}}
                                        disabled={votes[user.uid]}
                                        className={`w-full py-2 rounded font-bold text-sm ${votes[user.uid]===team.id ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                                     >
                                        {votes[user.uid]===team.id ? 'VOTED' : 'VOTE FOR TEAM'}
                                     </button>
                                 )}
                                 {gameState === 'SUMMARY' && winCondition === 'AI' && (
                                     <div className="text-center text-xs text-slate-500 font-mono">
                                         AI Score: {voteResults?.scores?.find(s=>s.id===team.id)?.score.toFixed(0)}
                                     </div>
                                 )}
                             </div>
                         </div>
                     );
                 })}
             </div>
             
             {gameState === 'VOTE' && isHost && (
                 <button onClick={calculateVoteWinner} className="fixed bottom-8 right-8 bg-yellow-500 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition">FINALIZE RESULTS</button>
             )}
         </div>
      );
  }

  return null;
};

export default App;
