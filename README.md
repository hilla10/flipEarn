# Social Media Market Places 🚀

<div align="center">

[![GitHub license](https://img.shields.io/github/license/hilla10/flipEarn)](https://github.com/hilla10/flipEarn)
[![GitHub last commit](https://img.shields.io/github/last-commit/hilla10/flipEarn)](https://github.com/hilla10/flipEarn)
[![GitHub issues](https://img.shields.io/github/issues/hilla10/flipEarn)](https://github.com/hilla10/flipEarn)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

<h3>Build fast, scalable, and interactive web apps effortlessly.</h3>

<p>
  <a href="https://netflix-alpha-gules.vercel.app/" target="_blank">🌐 Live Demo</a>
  ·
  <a href="https://github.com/hilla10/flipEarn" target="_blank">📦 GitHub</a>
  ·
  <a href="https://portfolio-rho-gules-15.vercel.app/" target="_blank">👨‍💻 Portfolio</a>
</p>

</div>

An open-source social media marketplace platform built with React, Tailwind CSS, Node.js, Prisma, PostgreSQL, and Neon. It is designed to help users discover, list, manage, and engage with digital products and marketplace opportunities in a modern social-first experience.

---

## Overview

Social Media Market Places is a modern social commerce and marketplace platform where users can browse listings, manage their own offers, and access secure account workflows in a scalable web application.

### Highlights

- ✅ Secure user authentication with Clerk
- ✅ Responsive social marketplace UI built with Tailwind CSS
- ✅ Fast and scalable REST APIs powered by Express
- ✅ Listing creation, editing, and management workflows
- ✅ Role-based access for users and administrators
- ✅ Built for deployment on modern cloud platforms
- ✅ Community-driven product discovery and engagement
- ✅ Admin tools for moderation, analytics, and user management

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Redux Toolkit
- Recharts
- Axios

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL / Neon
- Clerk Auth
- Stripe
- ImageKit
- Nodemailer
- Inngest

---

## Key Features

- 🔐 User signup and secure profile creation with Clerk authentication
- 🏷️ Listing creation and profile-based product selling for marketplace users
- 🛡️ Admin panel to review, verify, approve, and manage listings
- 💳 Secure purchase flow with credentials and access details sent via email
- 💼 Subscription billing and authentication managed through Clerk and Stripe
- ⚙️ Background jobs and email processing handled with Inngest
- 🗄️ Scalable PostgreSQL database powered by Neon
- 🖼️ Optimized image storage and delivery with ImageKit
- 📊 Admin analytics and marketplace activity tracking
- 🚀 Responsive, deployment-ready frontend and backend architecture

---

## Demo

- Live App: https://netflix-alpha-gules.vercel.app/
- GitHub Repo: https://github.com/hilla10/flipEarn
- Portfolio: https://portfolio-rho-gules-15.vercel.app/

---

## Screenshots

![Dashboard Preview](https://via.placeholder.com/1200x700.png?text=Dashboard+Preview)

![Marketplace Preview](https://via.placeholder.com/1200x700.png?text=Marketplace+Preview)

![Admin Panel Preview](https://via.placeholder.com/1200x700.png?text=Admin+Panel+Preview)

---

## Project Structure

```text
flipEarn/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── configs/
│   ├── controllers/
│   ├── prisma/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── README.md
├── LICENSE
├── .gitignore
└── .env.example
```

---

## Installation

### 1) Clone the repo

```bash
git clone https://github.com/hilla10/flipEarn.git
cd flipEarn
```

### 2) Install frontend dependencies

```bash
cd client
npm install
```

### 3) Install backend dependencies

```bash
cd ../server
npm install
```

### 4) Create environment files

Create a `.env` file in the server folder and a `.env` file in the client folder using the examples below.

#### Backend `.env`

```env
# server/.env

PORT = 3000
NODE_ENV = 'development'
FRONTEND_URL="http://localhost:5173"

/* Prisma */
# Pooled connection for your application
DATABASE_URL="postgresql://username:password@ep-lingering-breeze-an5i6rw9-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Direct connection for Prisma CLI
DIRECT_URL="postgresql://username:password@ep-lingering-breeze-an5i6rw9.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Clerk
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Inngest
INNGEST_EVENT_KEY=uKUxXBQqsz4yJmhgXILOe2RhC1sIKMJjGsjnuznqFNTSY094Rx6wWtkET7uX-mtEF2BPFwhQrXERAiCODMejGw
INNGEST_SIGNING_KEY=signkey-prod-7199614d3beafeab26ec557c534412c7032452d70537f22d6de31cc314f4b3c3

# Imagekit
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"

# Admin Email
ADMIN_EMAILS='test@gmail.com,admin@example.com'

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# NODEMAILER
SENDER_EMAIL='your_email_address'
SMTP_USER='your_smtp_user'
SMTP_PASS='your_smtp_login'
```

#### Frontend `.env`

```env
# client/.env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VITE_BASEURL=http://localhost:3000
VITE_CURRENCY='$'
```

---

## Running the App

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

The frontend usually runs on `http://localhost:5173` and the backend on `http://localhost:3000`.

---

## Contributing

Contributions are welcome! Please follow these steps:

```bash
git checkout -b feature/my-feature
git commit -m "Add my feature"
git push origin feature/my-feature
```

Then open a pull request on GitHub.

---

## License

This project is licensed under the MIT License.

---

## Contact

- Author: Hailemichael Nigusse
- GitHub: https://github.com/hilla10
- Portfolio: https://portfolio-rho-gules-15.vercel.app/
- Linkedin : https://www.linkedin.com/in/hailemichaelnegusse/
