# Aura Social Media Platform

Aura is a full-stack, hyper-optimized social media platform engineered with the MERN stack (MongoDB, Express, React, Node.js). Designed for a premium user experience, it features dynamic content feeds, ephemeral media, and enterprise-grade security protocols.

## 🚀 Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Redux Toolkit, React Router (Lazy Loaded)
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose)
- **Real-Time Integration**: Socket.io
- **Media & Security**: ImageKit SDK, Multer, Helmet, Node-Cache, Express-Rate-Limit, JSON Web Tokens (JWT), Bcrypt

## ✨ Features
- **Auth**: Fully scalable login system supporting Multi-Factor searching via `Email` or `@Username`. Includes robust Master Admin Access Overrides.
- **Posts**: Infinite-scroll Feed with real-time liking, commenting, and native Web-Share APIs.
- **Image Upload**: Seamlessly ingests Base64 schemas (up to 50MB) for profile/cover avatars. Employs a strict 2MB validation limit for Feed Posts with Auto-webp conversion via ImageKit.
- **Video Upload**: Supports MP4/WebM formats capped at 20MB with auto-compression to 720p.
- **Chat**: One-on-one Direct Messaging engine built over bi-directional web sockets.
- **Notifications**: Integrated Socket.io red-dot indicators for unread messages.
- **Search**: Optimized debounced queries with case-insensitive MongoDB `$regex` results.
- **Ephemeral Stories (TTL)**: 24-Hour expiration pipeline enforced securely at the Database-level using MongoDB TTL indices.
- **Admin Dashboard**: Comprehensive Control Interface protected by RBAC to manage users, view stats, and moderate content.

## 🛡️ Security & Performance
- **Enterprise Security**: CORS hardening, Helmet HTTP shields, and IP Rate-Limiting.
- **Speed Optimization**: Server-side caching via `node-cache` and Frontend code-splitting with React Suspense.

## 🌐 Deployment
- **Frontend**: https://mywebsite-frontend.onrender.com
- **Backend**: https://mywebsite-xf5o.onrender.com

---
*Developed by Shivam*
