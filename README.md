# 💬 Chatty — Fullstack Real-Time Chat & Video Calling App

**Chatty** is a fullstack MERN application that combines real-time messaging, video conferencing, and language exchange into one seamless platform.  

![Chatty Demo](demo.gif) <!-- You can replace this with a real demo GIF or image -->

---

## 🚀 Features

- 🌐 **Real-Time Messaging**
  - Typing indicators
  - Emoji reactions
  - Online/offline status

- 📹 **Video Calling**
  - 1-on-1 and group calls
  - Screen sharing
  - Call recording

- 🔐 **Authentication & Security**
  - JWT authentication
  - Protected routes

- 🎨 **Personalization**
  - 32 unique UI themes for language exchange

- ⚡ **Tech Stack**
  - Frontend: React + TailwindCSS + TanStack Query + Zustand
  - Backend: Node.js + Express.js + MongoDB
  - Real-time: Socket.IO + Stream API

- 🚨 **Error Handling**
  - Frontend & backend validations
  - Toast notifications for user feedback

---

## 🛠 Tech Stack

| Layer         | Technologies |
|---------------|--------------|
| **Frontend**  | React.js, TailwindCSS, TanStack Query, Zustand |
| **Backend**   | Node.js, Express.js, JWT, bcryptjs |
| **Database**  | MongoDB, Mongoose |
| **Realtime**  | Socket.IO, Stream API |
| **Deployment**| Render (Backend + Frontend) |

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/chatty.git
cd chatty

# Install dependencies
cd backend
npm install

cd ../frontend
npm install

# Create .env file in backend with:
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
STREAM_API_KEY=your_key
STREAM_API_SECRET=your_secret

# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm run dev
