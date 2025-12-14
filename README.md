<div align='center'>
  
# <img width='28' height='30' src='https://res.cloudinary.com/dp27ua535/image/upload/v1759516121/technology_eh05fr.png'/> Lama AI - Intelligent AI Assistant
</div>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19.1.1-blue.svg">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-green.svg">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Database-green.svg">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4.1.13-blue.svg">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg">
</p>

A **modern full-stack AI chat application** with **text & image generation** powered by **Google Gemini AI** and **ImageKit**, built using **React, Node.js, Express, and MongoDB**.

✨ **Why Lama AI?**

* Real-time AI chat with Markdown & syntax highlighting
* AI image generation with community sharing
* Secure authentication & credit-based system
* Modern responsive UI with dark/light themes

## 📸 Preview

<p align="center" width="80%">
  <img src='https://res.cloudinary.com/dp27ua535/image/upload/v1759515398/Screenshot_2025-10-03_235517_llizgh.png'/>
  </p>
  
---

## 🌟 Features

### 💬 AI Chat Interface

* Real-time text conversations with **Google Gemini AI**
* Markdown support for formatting & code blocks
* Syntax highlighting using **Prism.js**
* User avatars, timestamps & smooth chat experience

### 🎨 AI Image Generation

* Generate **high-quality images** from text prompts
* **ImageKit integration** for processing & storage
* Community sharing & public gallery

### 🔐 User Authentication

* Secure **JWT-based authentication**
* Password hashing with **bcrypt**
* Protected routes & middleware

### 💳 Credit System

* Pay-per-use **credit-based system**
* Subscription plans: **Basic, Pro, Premium**
* **Stripe integration** for payments & webhooks

### 🌙 Modern UI/UX

* **Dark/Light mode** toggle
* Responsive across **desktop, tablet & mobile**
* Smooth animations, hover effects & transitions
* Elegant **toast notifications & modal dialogs**

### 📱 Chat Management

* Create, delete & manage multiple chats
* Search through conversations
* Chat history preservation
* Real-time updates

---

## 🚀 Tech Stack

**Frontend:**

* ⚛️ React 19.1.1 (with hooks)
* ⚡ Vite (fast build tool)
* 🎨 Tailwind CSS 4.1.13
* 🛤️ React Router DOM
* 🔗 Axios, React Hot Toast, React Icons
* 📝 React Markdown, Prism.js, Moment.js

**Backend:**

* 🟩 Node.js + Express.js
* 🍃 MongoDB + Mongoose
* 🔑 JWT Authentication + bcrypt.js
* 💳 Stripe for payments
* 🌍 CORS support

**AI & Image Services:**

* 🤖 Google Gemini AI – Text generation
* 🖼️ ImageKit – Image generation & hosting
* 🔌 OpenAI SDK

---

## 🏗️ Project Structure

```
├── Backend/
│   ├── config/          # Configurations (DB, AI, services)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth & other middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── Server.js        # Entry point
│
├── Frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # Images, icons, styles
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context API
│   │   ├── pages/       # Pages
│   │   └── App.jsx      # Main App
│   └── index.html
```

---

## 🔑 API Endpoints

| Endpoint               | Method | Description        |
| ---------------------- | ------ | ------------------ |
| `/api/user/register`   | POST   | User registration  |
| `/api/user/login`      | POST   | User login         |
| `/api/user/data`       | GET    | Get user profile   |
| `/api/chat/create`     | GET    | Create new chat    |
| `/api/chat/get`        | GET    | Get user chats     |
| `/api/message/text`    | POST   | Send text message  |
| `/api/message/image`   | POST   | Generate AI image  |
| `/api/credit/plan`     | GET    | Fetch credit plans |
| `/api/credit/purchase` | POST   | Purchase credits   |

---

## 💰 Credit System

| Plan        | Price | Credits | Features               |
| ----------- | ----- | ------- | ---------------------- |
| **Basic**   | $10   | 100     | 100 text + 50 images   |
| **Pro**     | $20   | 500     | 500 text + 200 images  |
| **Premium** | $30   | 1000    | 1000 text + 500 images |

🔹 **Text generation = 1 credit**
🔹 **Image generation = 2 credits**

---

## 📦 Installation

### ✅ Prerequisites

* Node.js v16+
* MongoDB
* Stripe account
* Google Gemini API key
* ImageKit account

### 🛠️ Setup

```bash
# Clone repository
git clone https://github.com/yourusername/lama-ai.git
cd lama-ai
```

#### Backend Setup

```bash
cd Backend
npm install
```

Create `.env` in `Backend/`

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env` in `Frontend/`

```env
VITE_SERVER_URL=http://localhost:3000
```

#### Start Development

```bash
# Start backend
cd Backend
npm run server

# Start frontend
cd Frontend
npm run dev
```

App runs at 👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔒 Security Features

* JWT-based authentication
* Password hashing (bcrypt)
* Input validation & sanitization
* Protected API routes
* Secure payments with Stripe
* CORS configuration

---

## 🚀 Deployment

**Frontend (Vercel):**

```bash
npm run build
# deploy to Vercel
```

**Backend (Vercel):**
Add `vercel.json`

```json
{
  "version": 2,
  "builds": [
    { "src": "Server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "Server.js" }
  ]
}
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch → `git checkout -b feature/amazing-feature`
3. Commit changes → `git commit -m "Add amazing feature"`
4. Push → `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

* Google Gemini AI
* ImageKit
* Stripe
* Tailwind CSS
* React Community

---

## 📧 Contact

📩 Email: **[kojingmoktan92@gmail.com](mailto:kojingmoktan92@gmail.com)**
💻 GitHub: [@kojing777](https://github.com/kojing777)

---
