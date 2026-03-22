# DevJokes – Sprint 1 (Authentication)

## 👩‍💻 Student Information
**Name:** Tina Shabestari  
**Course:** COMP 2523 – Object Oriented Programming 1  

---

## 📌 Project Overview
DevJokes is a web application where users can share and interact with developer jokes.

In this sprint, authentication functionality was implemented to allow users to:
- Sign up (create an account)
- Sign in (log in with email and password)
- Access protected features (e.g., adding jokes)
- Log out and lose access to protected actions

---

## 🔐 Features Implemented
- User signup with full name, email, and password
- User login validation
- Dynamic login state using localStorage
- Conditional UI rendering based on authentication
- Protected routes (e.g., Add Joke only available when logged in)
- Logout functionality

---

## 🎥 Demo Video
YouTube (Unlisted):  
👉 https://youtu.be/EUcLYbASdf4

---

## 📘 Notion Documentation
👉 https://cat-lily-ad5.notion.site/DevJokes-COMP2523-Sprint-1-3c826edf3f658222b30881a60e27fced?source=copy_link

---

## 🧠 How It Works
- User data is stored in `localStorage`
- Login state is tracked using `isLoggedIn`
- The header dynamically updates using React state
- Protected actions are disabled for logged-out users

---

## 🚀 How to Run the Project

```bash
npm install
npm run dev
