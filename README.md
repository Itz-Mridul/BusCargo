# BusCargo 🚌📦

> **Turning idle MSRTC bus cargo space into an affordable parcel delivery network for Pune district.**

[![Status](https://img.shields.io/badge/Status-Prototype-amber)](https://github.com/Itz-Mridul/BusCargo)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma-blueviolet)](https://github.com/Itz-Mridul/BusCargo)

---

## 🧭 What is BusCargo?

BusCargo is a **hackathon prototype** built for Sanjivani University's AMO NeXus challenge. It demonstrates how existing MSRTC buses — which travel fixed routes every day — can carry parcels as cargo in their unused luggage space, without adding a single new vehicle.

This is not live in production. It is a fully functional, locally-runnable prototype aimed at Pune district.

---

## 🚀 Quick Start (Run Locally in 5 Minutes)

### 1. Clone the repo

```bash
git clone https://github.com/Itz-Mridul/BusCargo.git
cd BusCargo
```

### 2. Set up and start the backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Backend runs at → `http://localhost:3001`

### 3. Set up and start the frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🌐 Try the App (Live Demo)

> **Live Public URL:** [https://silver-jars-hear.loca.lt](https://silver-jars-hear.loca.lt)  
> *(Note: This is a temporary tunnel to the developer's local machine. If it says "Localtunnel Reminder", click "Click to Continue".)*

If the link is down, you can run it locally by following the [setup instructions](#-getting-started) below.

## 🔑 Demo Login Credentials

> Open `http://localhost:5173` — you will be taken to the login page first.
> Use one of the accounts below to explore the app.

| Role | Email | Password | What you can do |
|------|-------|----------|-----------------|
| **Sender** | `sender@example.com` | `password123` | Book parcels, track shipments |
| **Staff** | `staff@buscargo.com` | `password123` | Scan QR codes, load parcels onto buses |
| **Admin** | `admin@buscargo.com` | `password123` | View all bookings, ledger, metrics |

> You can also click **Sign Up** on the login page to register a brand new Sender account.

---

## 💡 The Problem

- Last-mile courier services skip rural and semi-urban Maharashtra.
- Trunk + last-mile delivery eats 40–55% of total shipping cost.
- MSRTC buses run fixed routes daily with empty cargo holds.
- Small businesses and farmers have no affordable way to ship goods locally.

---

## ✅ The Solution

BusCargo piggybacks on MSRTC bus routes as a zero-infrastructure cargo layer:

| Step | Who | What Happens |
|------|-----|--------------|
| 1 | Sender | Books route & pays via UPI on the app |
| 2 | Depot Staff | Scans QR code, assigns physical cargo slot on bus |
| 3 | Bus | Travels its normal scheduled route with GPS tracking |
| 4 | Receiver | Gets notified when bus arrives at destination depot |
| 5 | Handover | Receiver enters 6-digit OTP + signs digitally |
| 6 | Platform | Fare auto-splits: 60% Transit · 30% Platform · 10% Agent |

---

## 🔐 Security & Trust

- **HMAC-signed QR codes** — tamper-proof, unique per parcel
- **6-digit OTP delivery confirmation** — receiver must verify
- **Digital signature capture** — legal proof of handover on screen
- **Cargo slot assignment** — physical numbered slot on every bus
- **₹10 capped insurance** — included in every booking automatically
- **Immutable scan audit trail** — every event is timestamped

---

## 📊 Pilot Targets *(Not Live Yet)*

| Metric | Target |
|--------|--------|
| Pilot corridor | Kopargaon → Sangamner → Pune |
| Coverage potential | 79 villages in Kopargaon taluka |
| Population in range | ~302,452 (source: census data) |
| Projected cost saving | 40–55% vs private courier |
| Target scan time | Under 30 seconds |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** for utility styling
- **Leaflet.js** for live GPS map tracking
- **html5-qrcode** for camera-based QR scanning
- **qrcode.react** for QR badge generation

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **SQLite** (dev) / PostgreSQL (prod-ready)
- **JWT authentication** — role-based (Sender / Staff / Admin)
- **HMAC** via Node.js `crypto` for QR code signing

---

## 📁 Project Structure

```
BusCargo/
├── frontend/               React + Vite app
│   ├── src/
│   │   ├── pages/          All page components (Login, Dashboard, Booking…)
│   │   ├── components/     Shared UI components
│   │   ├── context/        Auth context (JWT stored in localStorage)
│   │   └── lib/            Axios API helpers
│   ├── .env.example        Copy to .env before running
│   └── package.json
│
├── backend/                Express REST API
│   ├── src/
│   │   ├── routes/         Auth, bookings, depots, routes, delivery…
│   │   ├── services/       Bus position simulator
│   │   └── index.ts        Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   Database schema
│   │   └── seed.ts         Pune district seed data + demo accounts
│   ├── .env.example        Copy to .env before running
│   └── package.json
│
└── README.md
```

---

## 🌿 Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Stable, demo-ready code |
| `frontend` | Frontend UI development |
| `backend` | Backend API development |
| `docs` | Documentation and diagrams |

---

## 🗺️ Pilot Corridor

Target first route — MSRTC already runs daily buses here:

```
Kopargaon → Sangamner → Pune (Swargate)
```

No new infrastructure is needed — only a digital layer on top of existing operations.

---

## 📜 License

MIT License. Built for educational and hackathon purposes.

---

## 👥 Team

Built by **AMO NeXus** for the Sanjivani University hackathon.
