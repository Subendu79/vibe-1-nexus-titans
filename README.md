# Lawazia · Campus mobility
**Nexus Titans — vibe-1-nexus-titans**

A responsive Next.js web app for one campus Toto, three stops, and permanent passenger boarding records. Dark, minimal styling inspired by CRED.

## Run the working local demo
Requires Node.js 22+ and npm.
```sh
npm install
npm run demo
```
Open http://127.0.0.1:3000. The demo starts a real local MongoDB replica set and stores its data in ignored `.local/mongo-data`. The first run downloads MongoDB; on Windows the archive is about 600 MB. Later runs reuse it.

Demo accounts (local demo only), all using password `CampusRide!2026`:
| Role | Email |
| --- | --- |
| Student | student@lawazia.demo |
| Employee | employee@lawazia.demo |
| Rider | rider@lawazia.demo |
| Group member | rohan@lawazia.demo |
| Group member | ananya@lawazia.demo |

The demo includes two competing requests, an accepted upcoming ride, and completed sample history. Students/employees can register additional accounts. Rider accounts can only be provisioned by the seed script.

## Configure MongoDB Atlas
1. Create an Atlas account and a free M0 cluster at https://www.mongodb.com/atlas.
2. In Database Access, create an application database user with read/write access to this app's database. Choose a private password.
3. Add the IP address of your local machine in Network Access. For hosting, configure access appropriate to your hosting provider.
4. Choose **Connect → Drivers → Node.js**, and copy the connection URI. URL-encode special characters in its username/password.
5. Copy `.env.example` to `.env.local`. Set `MONGODB_URI`, `MONGODB_DB`, `APP_ORIGIN`, and private rider credentials. `APP_ORIGIN` must match the browser origin exactly, e.g. `http://localhost:3000`.
6. Run `npm run seed` once to create the rider, then `npm run dev`.
7. Students and employees register through the app. Rider signup is intentionally unavailable.

No MongoDB credentials, session tokens, or private passwords belong in the public repository.

## Booking rules
- Origins and destinations are College, Railway Station, and Office. They must differ.
- Departures must be future dates within 90 days, on the configured slot grid.
- Default reservation is 30 minutes; set `SLOT_MINUTES` to a suitable duration for the actual route plus turnaround. Changing it affects new bookings only.
- A requester is automatically included. Additional passengers are selected from registered student/employee accounts. Each entry saves its account ID and name snapshot.
- Acceptance reserves the interval `[startsAt, endsAt)`. Pending overlapping requests are marked as conflicts. Requests arriving after reservation are also flagged.
- Schedule mutations use MongoDB transactions and write a shared vehicle guard document before inspecting reservations. This serializes competing accepts; a plain check-then-insert would not.
- Only one trip may be in progress. A rider must complete it before another pickup can start, even if the first runs late.
- The rider marks every passenger Boarded or Missed, then confirms drop completion. Completed boarding results cannot be edited.
- Personal histories include every completed trip where the user was listed, including missed rides. The rider sees their accepted trips and a completed trip log.
- Accepted slots use planned duration. There is no GPS or automated vehicle repositioning. Configure enough time between trips for travel and turnaround.

## Architecture
`app/` — Next.js pages and JSON API routes  
`components/` — responsive interface  
`lib/auth.ts` — custom password verification and database sessions  
`lib/bookings.ts` — custom booking and trip state transitions  
`lib/db.ts` — MongoDB driver, indexes, and transaction guard  
`scripts/` — rider provisioning and local demo  
`tests/` — integration checks using a real MongoDB replica set

Collections: users, sessions, bookings, vehicles, rateLimits.
Passwords use salted scrypt; cookies are HTTP-only, SameSite=Lax, and Secure in production. Sessions store a hash of a random token, expire after seven days, and are revoked on logout. Mutation routes enforce origin checks, login/signup have rate limits, and roles are checked server-side. No auth or booking SDK is used. No GPS, fares, maps, or multiple-vehicle support.

## Verify
```sh
npm run typecheck
npm test
npm run build
```
Tests create an isolated temporary database and verify concurrent slot acceptance, per-passenger boarding, histories for boarded/missed passengers, the rider log, single-vehicle operation, permissions, password checks, and sessions. To run them against an existing **local** replica set, set `MONGODB_URI`; the test database is separate and removed afterward.

## Publish to GitHub
Create a public repository named **vibe-1-nexus-titans**, then from this folder:
```sh
git remote add origin https://github.com/YOUR-USERNAME/vibe-1-nexus-titans.git
git push -u origin main
```
If GitHub CLI is available:
```sh
gh auth login
gh repo create vibe-1-nexus-titans --public --source=. --remote=origin --push
```

## Deploy the web app
Import the GitHub repository into a Next.js-compatible Node hosting service, such as Vercel. Add `MONGODB_URI`, `MONGODB_DB`, `SLOT_MINUTES`, and `APP_ORIGIN` in its environment settings. Set `APP_ORIGIN` to the deployed HTTPS URL. Leave `LOCAL_DEMO` unset. Provision the Atlas rider using the seed script locally. Build command: `npm run build`. The app uses the Node runtime because MongoDB requires TCP access.

## Competition demo
1. Login as student; request a future slot with Rohan and Ananya.
2. Login as employee; request the same slot.
3. Login as rider; accept the group request. The other request becomes Slot unavailable.
4. Open the accepted ride, start pickup, mark two passengers Boarded and one Missed, then end the trip.
5. Check the rider trip log. Sign in as each passenger to check their personal history and individual boarding result.

Built by Nexus Titans.
