# Zoho People Attendance Sync

This project syncs attendance logs from a biometric device to Zoho People using the Zoho People API. It uses a PostgreSQL database (managed by Prisma) to store attendance records and their sync status.

## Features

- Fetches attendance logs from a biometric device (ZKTeco).
- Stores logs in a PostgreSQL database.
- Automatically syncs unsynced records to Zoho People via their API.
- Marks records as synced after successful upload.

## Project Structure

- `src/autoSync.js` — Main entry point for auto-syncing.
- `src/zoho/zkService.js` — Fetches logs from the biometric device.
- `src/zoho/sync.js` — Handles syncing logic between device, database, and Zoho People.
- `src/zoho/zohoService.js` — Pushes attendance data to Zoho People API.
- `src/zoho/tokenmanager.js` — Manages Zoho OAuth tokens.
- `src/db/db.js` — Prisma database client.
- `prisma/schema.prisma` — Prisma schema for the Attendance model.
- `.env` — Environment variables (database, Zoho API, device config).

## Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd zoho-prople-attendance
   ```

2. **Install dependencies**

   ```sh
   npm i
   ```

3. **Configure environment variables**

   Edit the `.env` file with your database, Zoho API, and device details.

   
DATABASE_URL=

ZOHO_REFRESH_TOKEN=
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=

DEVICE_IP=
DEVICE_PORT=

ZOHO_TOKEN_URL=
ZOHO_PEOPLE_API_URL=


4. **Run database migrations**

   ```sh
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Start the sync process**

   ```sh
   npm start
   ```

   Or for development with auto-reload:

   ```sh
   npm run dev
   ```

## Requirements

- Node.js
- PostgreSQL database
- ZKTeco biometric device
- Zoho People account with API access


