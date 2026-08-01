# JWT Authentication & Role-Based Access Control (RBAC) Security Lab

A modern, interactive web application demonstrating stateless **JSON Web Token (JWT) Authentication** and **Role-Based Access Control (RBAC)** route guards.

---

## 🌟 Key Features

- **Stateless JWT Engine**: Issue and inspect Base64URL-encoded tokens (`Header.Payload.Signature`) with HMAC-SHA256 integrity verification.
- **Payload Tampering Simulator**: Real-time test demonstrating signature guard failures when unauthorized claims are modified.
- **Configurable Client Storage**: Toggle between `localStorage`, `sessionStorage`, and `In-Memory` state token storage.
- **RBAC & Route Protection**: Pre-configured user roles (**Admin**, **Editor**, **Viewer**, **Guest**) with protected route guards and dynamic UI permission rendering.
- **HTTP Authorization Interceptor**: Live request console showcasing `Authorization: Bearer <token>` header injection.
- **Local Storage State Persistence**: Created content articles and audit logs persist across browser refreshes.
- **Clean Light Design**: Zero glow, flat-bordered slate design system.

---

## 📁 Repository Structure

```
jwt-rbac/
├── css/
│   └── styles.css          # Clean light theme design system
├── js/
│   ├── app.js              # Central application router & event controller
│   ├── authState.js        # Auth state store & token expiration timer
│   ├── components/
│   │   ├── navbar.js       # Top navigation & storage selector
│   │   ├── sidebar.js      # View navigation menu
│   │   ├── loginModal.js   # Quick user identity switcher & login modal
│   │   └── toast.js        # Notification system
│   ├── utils/
│   │   ├── jwtHelper.js    # Base64URL encoder/decoder & HMAC signing logic
│   │   └── mockData.js     # Demo users & role permissions map
│   └── views/
│       ├── dashboardView.js
│       ├── contentView.js
│       ├── adminView.js
│       ├── auditLogsView.js
│       ├── jwtInspectorView.js
│       ├── rbacMatrixView.js
│       ├── httpConsoleView.js
│       ├── theoryDocsView.js
│       └── forbiddenView.js
├── index.html
├── package.json
├── vercel.json             # Vercel deployment routing configuration
├── .gitignore
└── README.md
```

---

## 🚀 How to Deploy on Vercel

### Option 1: Via Vercel Dashboard (Recommended)
1. Push this repository to your GitHub account (see instructions below).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** and select your `jwt-rbac` repository.
4. Leave **Framework Preset** as **Other** (Static Site).
5. Click **Deploy**. Vercel will automatically build and publish your app with SSL enabled!

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💻 How to Push to GitHub

Run the following commands in your terminal inside the project directory:

```bash
# 1. Initialize Git repository (if not already done)
git init

# 2. Add all files and commit
git add .
git commit -m "Initial commit: JWT Auth & RBAC Security Lab"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote GitHub repository (Replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 5. Push to GitHub
git push -u origin main
```

---

## 🛠️ Local Development & Running

Simply serve the directory using any static web server:

```bash
# Using Python
python -m http.server 8080

# Or using Node serve / Live Server
npx serve .
```

Open `http://localhost:8080` in your web browser.

---

## 📜 License
MIT License - Free for educational and security research purposes.
