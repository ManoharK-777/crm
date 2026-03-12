# Bespoke Luxury CRM - Full Stack MERN

A premium, high-performance CRM application built with the MERN stack (MongoDB, Express, React, Node.js). Features a "Royal Gold" and "Electric Blue" luxury aesthetic with real-time profile synchronization and interactive lead management.

![CRM Preview](https://raw.githubusercontent.com/ManoharK-777/crm/main/preview.png)

## ✨ Key Features
- **Premium UI**: Luxury dark mode with glassmorphism and gold accents.
- **Dynamic Search**: High-speed lead search with instant suggestions.
- **Smart Notifications**: Real-time alerts with direct navigation to system settings.
- **Persistent Profiles**: Real-time username and avatar updates saved to local storage.
- **Responsive Management**: Full CRUD operations for lead tracking and pipeline management.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Git

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ManoharK-777/crm.git
   cd crm
   ```

2. **Install all dependencies:**
   Using the root helper script:
   ```bash
   npm run build
   ```
   *This will install both server and client dependencies and build the frontend.*

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_luxury_secret_key
   ```

4. **Run the application:**
   - **Backend**: `cd server && npm run dev`
   - **Frontend**: `cd client && npm run dev`

   The app will be available at `http://localhost:5173`.

## 🛠 Tech Stack
- **Frontend**: React, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Design**: Premium Neo-Cyberpunk with Royal Gold accents

## 🌐 Deployment
This project is configured for easy deployment on **Render**, **Railway**, and **Cloudflare Pages**. 

- **Render**: Use the included `render.yaml`.
- **Cloudflare**: Deploy the `client/dist` folder to Cloudflare Pages.

---
Built with excellence by Antigravity AI.
