# DSA Curriculum Full-Stack App

**Frontend:** React + Vite → Vercel  
**Backend:** Node.js + Express → Render  
**Database:** MongoDB Atlas  
**Auth:** one private admin account, bcrypt password hash + JWT in HTTP-only cookie

The database is seeded from the previously audited PDF-derived curriculum: **207 entries, 15 sessions, 92 planned dates**. Intentional repeated PDF entries remain separate records.

## 1. MongoDB Atlas
1. Create an Atlas project and cluster.
2. Create a database user.
3. Configure Network Access for your deployment. For a quick Render deployment, Atlas can allow `0.0.0.0/0`; use strong DB credentials and least-privilege access.
4. Copy the Atlas connection string into Render's `MONGODB_URI`. **Do not put it in the frontend.**

## 2. Backend locally
```bash
cd backend
npm install
cp .env.example .env
```
Set:
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `FRONTEND_ORIGIN=http://localhost:5173`
- `COOKIE_SECURE=false`

Then:
```bash
npm run seed
npm run dev
```

## 3. Frontend locally
```bash
cd frontend
npm install
cp .env.example .env
```
Set `VITE_API_URL=https://saikrishna1235-207-dsa-challange-3rd.onrender.com`, then:
```bash
npm run dev
```

## 4. Render backend
Create a Web Service from `backend/`.
- Build: `npm ci`
- Start: `npm start`
- Environment: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `FRONTEND_ORIGIN=https://YOUR-VERCEL-DOMAIN`, `COOKIE_SECURE=true`

Run the seed command against Atlas once (locally with the same Atlas URI, or via a one-off Render shell):
```bash
npm run seed
```

## 5. Vercel frontend
Import the `frontend/` directory as the Vercel project root. Set:
`VITE_API_URL=https://saikrishna1235-207-dsa-challange-3rd.onrender.com`

## Security notes
- Never commit `.env` files.
- Never put `MONGODB_URI` or `JWT_SECRET` in Vercel.
- The frontend never connects directly to MongoDB.
- Progress is stored server-side in MongoDB.
- Only the authenticated admin can access the API in this one-admin design.
