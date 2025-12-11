# Modex Health | Care Connect

A streamlined, frontend-focused healthcare appointment and patient queue management system. This application allows administrators to schedule doctor sessions and patients to secure queue tokens online, replacing traditional waiting rooms with a digital token system.

## 🏥 Project Overview

**Modex Health** simulates a real-world doctor appointment platform. Unlike typical ticket booking systems (like RedBus/BookMyShow), this application is tailored for healthcare:
*   **Terminology:** Uses "Doctors", "Consultations", and "Queue Tokens" instead of "Movies", "Shows", and "Seats".
*   **Visuals:** Clean, calming Teal-based UI designed for medical environments.
*   **Flow:** Patients select a sequential token number (e.g., Token #1, #2) representing their position in the queue.

## ✨ Key Features

### 👨‍⚕️ Admin Module
*   **Schedule Sessions:** Create appointments for specific doctors with defined specialties (e.g., Cardiology, Pediatrics).
*   **Queue Management:** Define the maximum number of patients (tokens) per session.
*   **Dashboard:** View a tabular list of all upcoming sessions and real-time occupancy rates.

### 🤒 Patient/User Module
*   **Doctor Directory:** Browse available specialists with key details (Name, Time, Fee).
*   **Visual Token Selection:** Interactive grid to select queue numbers.
    *   *Available:* White/Teal border
    *   *Selected:* Solid Teal
    *   *Booked:* Gray/Disabled
*   **Concurrency Handling:** Simulates real-time checks to prevent double-booking of the same token.
*   **Booking Confirmation:** Receive a digital confirmation with specific token numbers.

### ⚙️ Technical Highlights
*   **Mock Backend:** A robust `LocalStorage` based service (`services/mockDb.ts`) that simulates network latency and asynchronous API calls.
*   **Race Condition Handling:** The mock backend implements logic to fail a request if a token was taken by another user between the time of page load and form submission.
*   **Role Switching:** A toggle in the Navbar allows instant switching between "Admin" and "Patient" views for demonstration purposes.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (via CDN)
*   **Routing:** React Router DOM v7
*   **State Management:** React Context API (`AppContext`)
*   **Icons:** Heroicons (SVG)
*   **Fonts:** Plus Jakarta Sans (Google Fonts)

## 🚀 Setup & Installation

Since this project uses a standard React structure, you can run it using common build tools.

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd modex-health
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run Development Server**
    ```bash
    npm start
    # or
    yarn start
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
/
├── components/         # Reusable UI components (Button, Input, Navbar)
├── context/           # Global state management (User role, Sessions data)
├── pages/             # Route views
│   ├── Home.tsx           # Doctor directory
│   ├── BookingPage.tsx    # Token selection & Booking logic
│   └── AdminDashboard.tsx # Session creation form
├── services/          # Mock API & Database logic
│   └── mockDb.ts          # LocalStorage wrapper with delay simulation
├── types.ts           # TypeScript interfaces (DoctorSession, Booking, User)
├── App.tsx            # Main application layout & Routing
└── index.tsx          # Entry point
```

## 📝 Usage Guide

1.  **Initial Load:** The app seeds mock data (3 sessions) into `localStorage` on the first run.
2.  **Booking a Doctor:**
    *   Ensure you are in "Patient" mode (default).
    *   Click "Book Appointment" on any doctor card.
    *   Select one or more available tokens (Limit: 3).
    *   Click "Secure Appointment".
3.  **Creating a Schedule:**
    *   Click "Switch to Admin" in the top-right corner.
    *   Navigate to "Manage Schedule".
    *   Fill in the Doctor Name, Specialty, Date, Time, Max Queue, and Fee.
    *   Click "Publish Schedule".

## ⚠️ Assumptions & Limitations

*   **Authentication:** Authentication is mocked. Clicking the "Switch Role" button simply updates the state in Context; no passwords are required.
*   **Persistence:** Data is stored in the browser's `localStorage`. Clearing browser cache will reset the application.
*   **Payment:** Payment processing is simulated. No actual transaction takes place.

---
*© Modex Health Systems. Built for the Modex Assessment.*

