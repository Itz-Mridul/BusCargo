# BusCargo 🚌📦

> **Turning idle MSRTC bus cargo space into an affordable parcel delivery network for Pune district.**

[![Status](https://img.shields.io/badge/Status-Pilot%20Phase-amber)](https://github.com/Itz-Mridul/BusCargo)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Prisma-blueviolet)](https://github.com/Itz-Mridul/BusCargo)

---

## 🧭 What is BusCargo?

BusCargo is a **hackathon prototype** built for Sanjivani University's AMO NeXus challenge. It demonstrates how existing Maharashtra State Road Transport Corporation (MSRTC) buses — which already travel fixed routes every day — can carry parcels as cargo in their unused luggage space, without adding a single new vehicle.

This isn't live in production yet. It's a fully functional pilot-ready prototype aimed at Pune district.

---

## 🌐 Try the App

> **Local URL:** http://localhost:5173  
> **Backend API:** http://localhost:3001/api

To run locally, follow the [setup instructions](#-getting-started) below.

---

## 💡 The Problem

- Last-mile courier services skip rural and semi-urban Maharashtra.
- Trunk + last-mile delivery eats 40–55% of total shipping cost.
- MSRTC buses run fixed routes daily with empty cargo holds.
- Small businesses and farmers have no affordable way to ship goods locally.

---

## ✅ The Solution

BusCargo piggybacks on MSRTC bus routes as a zero-infrastructure cargo layer:

| Step | Who Does It | What Happens |
|------|------------|--------------|
| 1 | Sender | Books route & pays via UPI on the app |
| 2 | Depot Staff | Scans QR code, assigns physical cargo slot on bus |
| 3 | Bus | Travels normal scheduled route with GPS tracking |
| 4 | Receiver | Gets notified when bus arrives at destination depot |
| 5 | Handover | Receiver enters 6-digit OTP + signs digitally |
| 6 | Platform | Fare auto-splits: 60% Transit · 30% Platform · 10% Agent |

---

## 🔐 Security Features

- **HMAC-signed QR codes** — tamper-proof, unique per parcel
- **6-digit OTP delivery confirmation** — SMS sent to receiver
- **Digital signature capture** — legal proof of handover
- **Cargo slot assignment** — physical numbered slot on every bus
- **₹10 capped insurance** — baked into every booking
- **Immutable audit trail** — every scan event timestamped

---

## 📊 Pilot Targets (Not Live Yet)

| Metric | Target |
|--------|--------|
| Pilot area | Kopargaon → Sangamner → Pune corridor |
| Coverage potential | 79 villages in Kopargaon taluka |
| Population in range | ~302,452 (source: census data) |
| Projected cost saving | 40–55% vs private courier |
| Target scan time | Under 30 seconds |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** for utility styling
- **Leaflet.js** for live GPS map
- **html5-qrcode** for camera QR scanning
- **qrcode.react** for QR badge generation
- **Lucide React** for icons

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** with **SQLite** (dev) / PostgreSQL (prod-ready)
- **JWT authentication** with role-based access (Sender / Driver / Admin)
- **HMAC** via Node.js `crypto` for QR signing

---

## 📁 Repository Structure

```
BusCargo/
├── frontend/          → React app (Vite)
│   ├── src/
│   │   ├── pages/     → All page components
│   │   ├── components/→ Reusable UI components
│   │   ├── context/   → Auth context
│   │   └── lib/       → API helpers
│   └── package.json
│
├── backend/           → Express API server
│   ├── src/
│   │   ├── routes/    → REST endpoints
│   │   ├── lib/       → Prisma client, helpers
│   │   └── index.ts   → Server entry point
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts    → Seed data (Pune district routes)
│
└── README.md
```

---

## 🌿 Branch Structure

| Branch | Purpose |
|--------|---------|
| `main` | Stable, demo-ready code |
| `frontend` | Frontend-only development |
| `backend` | Backend API development |
| `docs` | Documentation and diagrams |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Clone the repo

```bash
git clone https://github.com/Itz-Mridul/BusCargo.git
cd BusCargo
```

### 2. Start the backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

The API will be available at `http://localhost:3001`

### 3. Start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Demo accounts (from seed data)

After seeding, use any account created by `prisma/seed.ts`. You can register a new account via the Sign Up page as a Sender.

---

## 🗺️ Pilot Corridor

The first MoU target corridor:

```
Kopargaon → Sangamner → Shirdi → Nashik → Pune
```

MSRTC already runs daily buses on this corridor. No new infrastructure is needed — only a digital layer and staff onboarding.

---

## 📜 License

MIT License. Built for educational and hackathon purposes.

---

## 👥 Team

Built by **AMO NeXus** for the Sanjivani University hackathon.
