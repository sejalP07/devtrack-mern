# DevTrack

A Developer Task Management System built with the MERN stack.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |

## Current Status

**Milestone 1 — Project Scaffold** ✅

- React + Vite frontend initialised
- Express backend initialised
- MongoDB connection configured
- Health-check endpoint available at `GET /api/health`

## Setup

### Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or local)

### Backend

```bash
cd server
cp .env.example .env   # then fill in MONGODB_URI
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Confirm the API is running |
