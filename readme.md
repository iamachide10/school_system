

# 🏫 School Canteen Management System

### **📘 Project Overview**

The **School Canteen Management System** is a web-based record system for managing the flow of canteen money within a school.

It does **not handle real cash transactions** — instead, it helps teachers, bus drivers, accountants, and the headmaster record, verify, and organize daily canteen collections from students.

The system ensures that:

* Every amount received is traceable (who collected, when, for which student).
* The class teacher validates (merges) what others report.
* The accountant verifies that totals match the school’s overall expected balance.
* The headmaster (abroad) can view the school’s financial performance remotely.

---

## **🎯 System Goals**

1. Eliminate confusion about who collected what from students.
2. Digitally track each canteen payment and store it with clear audit trails.
3. Provide a dashboard for each staff role (bus driver, teacher, accountant, headmaster).
4. Make recording fast and possible even without smartphones (via optional USSD).
5. Allow head-level transparency without using real banking systems.

---

## **👥 User Roles**

### **1. Bus Driver / Assistant Teacher**

* Records money received from students before school starts.
* Can record via:

  * **Web app:** Log in → choose class → choose student → input amount.
  * **USSD interface (optional):** Quickly record by dialing a short code.
* Each payment recorded by them goes into the **“Unmerged” list** of the respective class.

---

### **2. Class Teacher**

* Manages all students in their assigned class.
* Has two main responsibilities:

  1. **Receive payments directly** from students and record them.
  2. **Merge unmerged payments** collected by others (bus drivers, other teachers).
* The *merge process*:

  * Opens the class dashboard.
  * Views list of “unmerged” payments.
  * Confirms the ones actually received.
  * Clicks **Merge**, which changes the record’s status to `"merged"`.
* Can view total money collected for their class in real time.

---

### **3. Accountant**

* Accesses a global dashboard of all classes.
* Responsibilities:

  * View class totals (from merged data).
  * Sum up all class totals.
  * Verify that **class totals == system total**.
  * Detect missing or unmerged data.
* Final checkpoint before the day’s report is closed.
* Can print or export daily financial summaries.

---

### **4. Headmaster (Abroad)**

* Monitors everything remotely.
* Sees reports such as:

  * Total school collection for the day/week/month.
  * Merged vs. unmerged totals.
  * Class and teacher summaries.
  * Account verification status.
* Does not modify data, only views reports.

---

## **🧩 Core Data Models**

### **1. Classes**

Holds all classes in the school.

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  teacher_id INT REFERENCES users(id)
);
```

### **2. Students**

Each student belongs to one class and has a unique Student ID.

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  class_id INT REFERENCES classes(id),
  parent_name VARCHAR(100)
);
```

### **3. Users (Staff)**

Stores all system users (teachers, bus drivers, accountant, headmaster).

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role VARCHAR(50) CHECK (role IN ('teacher','other','accountant','headmaster'))
);
```

### **4. Canteen Records**

Main table for all payment records.

```sql
CREATE TABLE canteen_records (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES students(id),
  amount NUMERIC(10,2),
  received_by INT REFERENCES users(id),
  receiver_role VARCHAR(50),
  status VARCHAR(20) CHECK (status IN ('unmerged','merged')),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **⚙️ System Flow (Real-World Scenarios)**

### **Scenario 1 – Bus Driver Collects**

1. The driver collects money from “Ama”, a student in class P3.
2. He opens the web app (or uses USSD) → selects “Ama” → enters amount → submits.
3. The record is stored in `canteen_records` as:

   ```
   status: "unmerged"
   receiver_role: "bus_driver"
   ```
4. The class teacher for P3 sees it under “Unmerged Records”.

---

### **Scenario 2 – Class Teacher Confirms**

1. Teacher logs into dashboard.
2. Opens the class list → sees “Ama” (unmerged, collected by bus driver).
3. Confirms the amount, clicks **Merge**.
4. Record changes to:

   ```
   status: "merged"
   ```
5. The class total updates automatically.

---

### **Scenario 3 – Direct Payment to Teacher**

1. Student “Kojo” hands money directly to the teacher.
2. Teacher logs in and records it as a **merged payment** (since no middleman).
3. Appears instantly in class total.

---

### **Scenario 4 – Accountant Verification**

1. Accountant logs in.
2. Sees class totals:

   * P1 → 50 cedis
   * P2 → 60 cedis
   * P3 → 40 cedis
3. System total = 150 cedis.
4. Accountant compares this with their manual total or teacher reports.
5. If correct → marks as verified.
6. If mismatch → investigates unmerged or missing entries.

---

### **Scenario 5 – Headmaster Monitoring**

* Logs in remotely.
* Checks daily summary → sees total, merged ratio, missing data.
* Can export report as PDF.

---

## **🗂️ Project Folder Structure**

```
school-canteen-system/
├── backend/
│   ├── config/
│   │   └── db.js           # Database connection setup
│   ├── controllers/
│   │   ├── studentController.js
│   │   ├── classController.js
│   │   ├── recordController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── studentModel.js
│   │   ├── classModel.js
│   │   ├── recordModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   ├── classRoutes.js
│   │   ├── recordRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tables/
│   │   │   ├── Buttons/
│   │   │   └── Layout/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── DashboardTeacher.jsx
│   │   │   ├── DashboardDriver.jsx
│   │   │   ├── DashboardAccountant.jsx
│   │   │   └── DashboardHeadmaster.jsx
│   │   ├── services/
│   │   │   └── api.js      # axios setup
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## **🔧 Technology Stack**

### **Backend**

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* dotenv (for configuration)
* CORS and Nodemon

### **Frontend**

* React.js
* Async
* React Router DOM
* Tailwind CSS (for design)

### **Optional**

* USSD integration (Africa’s Talking / Twilio)
* Render / Railway (backend deployment)
* Netlify / Vercel (frontend hosting)

---

## **🪜 Development Roadmap**

### **Phase 1 – Setup & Foundation**

1. Create project folders (frontend & backend).
2. Initialize Node.js in backend (`npm init -y`).
3. Install dependencies (`express`, `pg`, `cors`, `dotenv`, `nodemon`).
4. Setup database connection in `db.js`.
5. Test server with `nodemon server.js`.

---

### **Phase 2 – Database & Models**

1. Create PostgreSQL database `canteen_db`.
2. Define and create tables (`users`, `classes`, `students`, `canteen_records`).
3. Create models for database operations.

---

### **Phase 3 – API Routes & Controllers**

1. Create `routes/` and `controllers/` folders.
2. Add CRUD APIs for:

   * Students
   * Classes
   * Records
   * Users (register/login)
3. Implement **role-based authorization** using middleware.

---

### **Phase 4 – Frontend Setup**

1. Setup React (`npx create-react-app frontend`).
2. Install Tailwind CSS, axios, and router.
3. Build pages:

   * Login page
   * Dashboard for each role
4. Build reusable UI components (Tables, Buttons, etc.)

---

### **Phase 5 – Merge & Verification Logic**

1. Add “Unmerged Payments” list on teacher dashboard.
2. Add “Merge” button → triggers PUT request to update record.
3. Update accountant dashboard to show all merged totals.

---

### **Phase 6 – USSD Integration (Optional)**

1. Connect to a USSD provider API (e.g., Africa’s Talking).
2. Create routes that respond to USSD requests (recording student payment).
3. Test using simulator or live shortcode.

---

### **Phase 7 – Reports & Headmaster Dashboard**

1. Create analytics dashboard showing:

   * Total merged/unmerged per class.
   * Daily/weekly totals.
   * Unverified classes.
2. Allow export to CSV or PDF.

---

### **Phase 8 – Final Testing & Deployment**

1. Test all roles end-to-end.
2. Seed sample data for demo.
3. Deploy backend (Render / Railway).
4. Deploy frontend (Netlify / Vercel).
5. Update `.env` variables for production.

---

## **📈 Future Improvements**

* Add SMS notification for parents when money is received.
* Add student attendance integration.
* Add audit logs for accountant checks.
* Add monthly report automation.

---

## **✅ Learning Goals for You**

By building this project, you’ll learn:

* Node.js + Express project structure.
* REST API design and database integration.
* Role-based authentication with JWT.
* React frontend connection to API.
* Data verification workflows (unmerged → merged).
* Optional USSD integration for offline access.

---