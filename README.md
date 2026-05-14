
# MODUL - Industrial Supply Chain Portal

A high-fidelity B2B procurement and inventory management system designed for enterprise-scale manufacturing operations. MODUL centralizes supply chain intelligence, providing real-time telemetry, spatial facility mapping, and financial ledger tracking.

## Architecture & Tech Stack

The application is built on a modern, type-safe stack optimized for real-time data handling and high-performance rendering:

* **Framework:** Next.js 15 (App Router)
* **API Layer:** tRPC (End-to-end type safety)
* **Database:** Neon (Serverless PostgreSQL)
* **ORM:** Drizzle ORM
* **Real-time Telemetry:** Ably WebSockets
* **Styling:** Tailwind CSS
* **Animation & UI:** Framer Motion, Lucide Icons
* **Data Visualization:** Recharts, React Simple Maps
* **Form Management:** React Hook Form, Zod

## Core Modules

* **Dashboard:** Central command interface featuring real-time system metrics and YTD stock health velocity charts.
* **Inventory Matrix:** Comprehensive SKU registry with automated safety stock thresholds and unit-level tracking.
* **Facility Digital Twin:** 2D spatial representation of global warehouses featuring real-time critical stock heatmaps and zone telemetry.
* **Live Freight Network:** Geographic tracking interface monitoring international shipments, route statuses, and supply chain delays.
* **Order Control:** Procurement management system with advanced status filtering and dynamic CSV report generation.
* **Financial Ledger:** Accounts payable tracking, outstanding balance calculation, and print-ready PDF invoice generation.

## Getting Started

### Prerequisites
* Node.js 18.x or later
* PostgreSQL database (Neon DB recommended)
* Ably account for WebSocket infrastructure

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/modul-supply-chain.git](https://github.com/yourusername/modul-supply-chain.git)
cd modul-supply-chain

```

2. Install dependencies:

```bash
npm install

```

3. Configure environment variables:
Create a `.env` file in the root directory and add your credentials:

```env
DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
NEXT_PUBLIC_ABLY_API_KEY="your_ably_api_key"

```

4. Push the database schema:

```bash
npx drizzle-kit push

```

5. Start the development server:

```bash
npm run dev

```

The application will be available at `http://localhost:3000`.

## License

Copyright (c) 2026. All rights reserved.
