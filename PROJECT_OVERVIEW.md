# BusCargo — Smart Parcel Logistics on MSRTC Bus Routes

> **Hackathon MVP Overview & Technical Documentation**  
> BusCargo creates an automated digital logistics layer on existing public bus networks (MSRTC) across rural and tier-2/3 Maharashtra (starting with the pilot Kopargaon – Shirdi – Ahmednagar route).

---

## 📌 1. Project Summary & Problem Statement

### The Problem
- Over **302,452 people** and **79 villages** between Kopargaon and Ahmednagar have thin, expensive courier coverage.
- MSRTC runs hundreds of daily buses with underutilized cargo space, yet parcel logistics are managed via offline counters, manual waybills, paper ledgers, and zero real-time tracking or chain-of-custody security.

### The Solution (BusCargo Golden Path)
BusCargo converts existing MSRTC buses into a smart digital parcel network:
1. **Sender Books** via Web App → instant price quote, automated QR code generation, and 6-digit delivery OTP.
2. **Staff Scans In** at Origin Depot → QR scan triggers automated status change to `IN_TRANSIT` and initiates live GPS simulation.
3. **Live Vehicle Simulation** → Real-time bus movement on Leaflet/OpenStreetMap along actual route waypoints.
4. **Staff Scans Out** at Destination Depot → Status updates to `ARRIVED`.
5. **Receiver Confirms Delivery** via OTP → Loop closes, delivery event logged.
6. **Automated Revenue Split** → Ledger instantly calculates 60% MSRTC transit share, 30% Platform fee, and 10% Agent commission without manual reconciliation.

---

## 🛠️ 2. Technical Architecture & Tech Stack

### Tech Stack (Lean Hackathon Edition)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Dark Glassmorphism UI theme), Leaflet & OpenStreetMap, `qrcode.react`, `html5-qrcode` scanner, Lucide icons, React Router v6, Axios.
- **Backend**: Node.js, Express.js (TypeScript), JWT Authentication (`jsonwebtoken`), Password & OTP Hashing (`bcryptjs`), CORS.
- **Database**: SQLite (via Prisma ORM v5) for zero-config rapid local execution.
- **Live Tracking Simulator**: In-memory background interval process interpolating lat/lng positions across Kopargaon → Shirdi → Ahmednagar route waypoints.

---

## 💾 3. Core Data Model (Prisma Schema)

```prisma
model User {
  id            String   @id @default(uuid())
  role          String   // SENDER, STAFF, ADMIN
  name          String
  email         String   @unique
  passwordHash  String
  parcels       Parcel[] @relation("SenderParcels")
}

model Depot {
  id            String   @id @default(uuid())
  name          String
  lat           Float
  lng           Float
  originParcels Parcel[] @relation("OriginDepot")
  destParcels   Parcel[] @relation("DestDepot")
}

model Route {
  id            String   @id @default(uuid())
  name          String
  waypointsJson String   // Waypoints list: Kopargaon -> Shirdi -> Ahmednagar
  buses         Bus[]
}

model Bus {
  id            String   @id @default(uuid())
  routeId       String
  route         Route    @relation(fields: [routeId], references: [id])
  currentLat    Float
  currentLng    Float
  status        String   // IDLE, IN_TRANSIT
  lastUpdated   DateTime @default(now())
  parcels       Parcel[]
}

model Parcel {
  id              String   @id @default(uuid())
  trackingId      String   @unique
  senderId        String
  sender          User     @relation("SenderParcels", fields: [senderId], references: [id])
  originDepotId   String
  originDepot     Depot    @relation("OriginDepot", fields: [originDepotId], references: [id])
  destDepotId     String
  destDepot       Depot    @relation("DestDepot", fields: [destDepotId], references: [id])
  busId           String?
  bus             Bus?     @relation(fields: [busId], references: [id])
  receiverName    String   @default("")
  receiverPhone   String   @default("")
  weight          Float
  price           Float
  status          String   // BOOKED, IN_TRANSIT, ARRIVED, DELIVERED
  qrCode          String
  otpHash         String
  createdAt       DateTime @default(now())
  transactions    Transaction[]
}

model ScanEvent {
  id          String   @id @default(uuid())
  parcelId    String
  staffId     String
  eventType   String   // LOADED, UNLOADED, DELIVERED
  timestamp   DateTime @default(now())
}

model Transaction {
  id                String   @id @default(uuid())
  parcelId          String
  parcel            Parcel   @relation(fields: [parcelId], references: [id])
  amount            Float
  splitTransitPct   Float    // 60%
  splitPlatformPct  Float    // 30%
  splitAgentPct     Float    // 10%
  settledAt         DateTime @default(now())
}
```

---

## 🔑 4. Demo Users & Authentication

Three pre-seeded roles are ready for demo testing:

| Role | Email | Password | Allowed Views / Capabilities |
|---|---|---|---|
| **Sender** | `sender@buscargo.local` | `password123` | Sender Dashboard, Book Parcel, Track Parcel, View QR & OTP |
| **Depot Staff** | `staff@buscargo.local` | `password123` | Staff Dashboard, Camera/Manual QR Scanner, Delivery Confirmation |
| **Admin** | `admin@buscargo.local` | `password123` | Metric Overview, Unit Economics Breakdown, Automated Revenue Ledger |

---

## 🚀 5. How to Run Locally

### Step 1: Start Backend
```bash
cd backend
npm run dev
# Running on http://localhost:3001
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 🎬 6. Demo Script (Exact Step-by-Step Rehearsal)

1. **The Hook (15s)**: Highlight that 302,452 people across 79 villages lack fast, cheap courier service while MSRTC buses pass through daily.
2. **Sender Flow**: Log in as `sender@buscargo.local`, select Kopargaon → Shirdi depot, enter weight (e.g. 2kg), view real-time price calculation (₹100), click "Confirm & Pay", and copy the Tracking ID + view QR code.
3. **Staff Scan (Origin)**: Log in as `staff@buscargo.local` (or switch tab), go to "Scan QR", paste/scan `BUSCARGO:BC-...`. Status changes to `IN_TRANSIT`.
4. **Live Map Tracking**: Switch back to Sender/Tracking view. Observe the 🚌 bus icon moving live between Kopargaon and Shirdi on OpenStreetMap.
5. **Staff Scan (Destination)**: Scan the QR code again as staff at Shirdi depot. Status updates to `ARRIVED`.
6. **Receiver OTP Delivery**: Go to `/delivery/confirm`, enter the tracking ID and 6-digit OTP. The celebration screen confirms delivery!
7. **Ledger Auto-Split**: Click "View Ledger" as Admin to show zero manual math: ₹100 is split into ₹60 (MSRTC), ₹30 (Platform), ₹10 (Agent).

---

## 🛡️ 7. Selection Risk Preparedness (Judge Q&A Responses)

- **Overlap with MSRTC Parcel Counters?**  
  *Answer*: MSRTC currently outsources parcel rights to a single state contractor with fixed rates and paper receipts. BusCargo is a digital tech overlay providing real-time GPS tracking, QR chain of custody, and instant OTP verification—not a competing bus fleet.
- **Where does physical cargo go?**  
  *Answer*: Standard MSRTC luggage boots under the bus chassis or retrofitted lockable cargo lockers in the rear luggage bay.
- **Unit Economics**:
  * Base Fare: ₹50 + ₹15/kg + ₹20 Platform fee.
  * 60% fare split gives MSRTC new revenue on empty capacity with 30-second staff scan overhead.
- **MoU / Precedent**:
  * MSRTC tender `ST/PM/PC/11/2018` proves state transit authorities regularly lease parcel handling rights to tech/logistics partners.

---

## 📁 8. Project Directory Map

```
e:\hackthon\
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (SQLite + Prisma 5)
│   │   └── dev.db              # SQLite Database
│   ├── src/
│   │   ├── routes/             # auth, bookings, depot, delivery, buses, ledger, depots
│   │   ├── services/           # busSimulator.ts (Live interval GPS movement)
│   │   ├── middleware/         # auth.ts (JWT validation & role checks)
│   │   ├── seed.ts             # Pre-seeded users, depots, and route data
│   │   └── index.ts            # Express server entrypoint (Port 3001)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Layout, ProtectedRoute, StatusBadge
│   │   ├── context/            # AuthContext.tsx
│   │   ├── lib/                # api.ts (Axios helper + JWT interceptor)
│   │   ├── pages/              # Login, Booking, Tracking, Scan, OTP, Admin, Ledger
│   │   ├── App.tsx             # React Router setup
│   │   └── index.css           # Tailwind CSS + Glassmorphism dark mode rules
│   ├── index.html
│   └── package.json
```
