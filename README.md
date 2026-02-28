# ⬡ TeamTrack

[![Live Deployment](https://img.shields.io/badge/Live_Deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://teamtrack-fza4yob1g-maryamcodehubs-projects.vercel.app/)

**TeamTrack** is a web application designed to solve the age-old problem of free-riders in academic group projects. It provides visibility and accountability by allowing teachers to track individual student contributions, facilitates anonymous peer reviews, and generates automated contribution flags to ensure fair grading.

### 🌐 Live Demo
Check out the live application hosted on Vercel: **[TeamTrack Live App](https://teamtrack-fza4yob1g-maryamcodehubs-projects.vercel.app/)**

---

## 🎯 The Problem It Solves

Every student has experienced this: in a group project, 1 or 2 people do all the work while others contribute nothing but receive the same grade. Teachers have no visibility into who actually did what. Hard-working students feel cheated, and there is zero accountability for free-riders. 

**TeamTrack** solves this by:
* Providing a platform for students to **log their specific tasks and hours**.
* Facilitating **anonymous peer reviews** at the end of a project.
* Giving teachers a **Contribution Report** that automatically flags discrepancies between claimed work and peer ratings.

---

## 🚀 Features

### For Teachers 👨‍🏫
* **Project Dashboard:** Create classes, set deadlines, and manage group assignments.
* **Contribution Reports:** Instantly view aggregated data of how many tasks and hours each student completed vs. the group average.
* **Free-Rider Flags:** Automated system that flags students with suspiciously low peer review scores or very low task participation.

### For Students 👩‍🎓
* **Task Logging:** Log specific contributions under standard academic categories (Research, Coding, Design, Writing, etc.).
* **Anonymous Peer Reviews:** Rate teammates specifically on Contribution Volume, Activity Quality, and Communication using a 5-star metric (ratings are visible *only* to the teacher).

---

## 💻 Technology Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Vanilla CSS (Custom Design System, Dark Theme, Glassmorphism)
* **State Management:** React Context API
* **Data Storage:** LocalStorage (Zero-latency serverless architecture for instant demo capabilities)
* **Deployment:** Vercel

---

## 🛠️ Installation & Setup

To run this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/MaryamCodeHub/teamtrack-.git
   cd teamtrack
   ```

2. **Install dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Instructions

Because this version uses **LocalStorage** to persist data, everything happens entirely in your browser instantly. Here is how to test the full flow:

### 1. The Teacher Experience
1. Go to the Sign Up page and select the **"I'm a Teacher"** role.
2. Create your account. You will automatically be logged into the Teacher Dashboard.
3. Click **"+ New Project"** to create a class assignment.
4. Click **"Manage Project"** to enter the workspace. From here, you can group students.
   *(Note: Since you are the only user so far, you won't see any students to add yet).*

### 2. The Student Experience
1. **Log out** of your teacher account.
2. Go back to Sign Up and select the **"I'm a Student"** role. Make a new account.
3. Log out again, log back in as the **Teacher**, and you will now be able to assign the Student to a Group!
4. Finally, log back in as the **Student**. You will see your assigned project and can begin **Logging Tasks**. 

Once the Teacher clicks "Open Peer Reviews", students will be prompted to submit anonymous ratings for their teammates!

---

