# 🏗️ Architecture Diagram Template

## System Architecture - نظام إدارة المقاولات

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
│                    (React.js)                               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │    Pages     │  │    Router    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   State      │  │   API Calls  │  │   Utils      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Deployment: Vercel                                          │
│  URL: https://your-app.vercel.app                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API
                       │ JSON
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Backend Layer                             │
│                    (Node.js/Express)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │  Middleware  │  │ Controllers  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Validation │  │   Error      │      │
│  │  (JWT)       │  │              │  │   Handling   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Deployment: Render                                          │
│  URL: https://your-backend.onrender.com                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ MongoDB Connection
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 Database Layer                               │
│                 (MongoDB Atlas)                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Users      │  │  Projects    │  │  Materials   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Suppliers   │  │  Payments    │  │  Contracts   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Purchases   │  │   Issues      │  │   Reports    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Cloud: MongoDB Atlas                                        │
└─────────────────────────────────────────────────────────────┘
```

## External Services

```
┌─────────────────────────────────────────────────────────────┐
│                    External Services                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Google     │  │    Stripe     │  │   Email      │      │
│  │   OAuth      │  │   Payment     │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend:
- React.js 18+
- React Router DOM
- CSS3
- JavaScript (ES6+)

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcryptjs (Password Hashing)

### Deployment:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### External APIs:
- Google OAuth 2.0
- Stripe Payment Gateway

---

## Instructions for Draw.io

1. Open https://app.diagrams.net/
2. Create new diagram
3. Use "Flowchart" template
4. Draw 3 main rectangles (Frontend, Backend, Database)
5. Add arrows between them
6. Add details in each layer
7. Export as PNG (high quality, 300 DPI)

---

**Use this template to create the Architecture Diagram**
