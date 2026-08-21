-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" DATETIME,
    "currentLat" REAL,
    "currentLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Maharashtra',
    "type" TEXT NOT NULL DEFAULT 'City'
);

-- CreateTable
CREATE TABLE "Depot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    CONSTRAINT "Depot_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sourceCityId" TEXT NOT NULL,
    "destCityId" TEXT NOT NULL,
    "waypointsJson" TEXT NOT NULL,
    CONSTRAINT "Route_sourceCityId_fkey" FOREIGN KEY ("sourceCityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Route_destCityId_fkey" FOREIGN KEY ("destCityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "depotId" TEXT NOT NULL,
    "stopOrder" INTEGER NOT NULL,
    CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RouteStop_depotId_fkey" FOREIGN KEY ("depotId") REFERENCES "Depot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "routeId" TEXT NOT NULL,
    "currentLat" REAL NOT NULL,
    "currentLng" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bus_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Parcel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackingId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "originDepotId" TEXT NOT NULL,
    "destDepotId" TEXT NOT NULL,
    "busId" TEXT,
    "driverId" TEXT,
    "receiverName" TEXT NOT NULL DEFAULT '',
    "receiverPhone" TEXT NOT NULL DEFAULT '',
    "weight" REAL NOT NULL DEFAULT 1,
    "serviceType" TEXT NOT NULL DEFAULT 'INTERCITY',
    "price" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL DEFAULT '',
    "otpHash" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Parcel_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parcel_originDepotId_fkey" FOREIGN KEY ("originDepotId") REFERENCES "Depot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parcel_destDepotId_fkey" FOREIGN KEY ("destDepotId") REFERENCES "Depot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parcel_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Parcel_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScanEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parcelId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ScanEvent_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parcelId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "splitTransitPct" REAL NOT NULL,
    "splitPlatformPct" REAL NOT NULL,
    "splitAgentPct" REAL NOT NULL,
    "settledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_parcelId_fkey" FOREIGN KEY ("parcelId") REFERENCES "Parcel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parcel_trackingId_key" ON "Parcel"("trackingId");
