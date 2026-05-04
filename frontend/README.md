# KRISHI-SATHI
Krishi Saathi - Farmer Assistant Website
Welcome to Krishi Saathi — your comprehensive digital companion designed to support farmers with essential information, tools, and resources. From weather updates to crop tips, pest management, and market prices, Krishi Saathi aims to enhance agricultural productivity and sustainability.

Features
---------
Weather Forecasts: Get real-time weather updates specific to your location.
Crop Management Tips: Expert advice on planting, caring, and harvesting various crops.
Pest & Disease Support: Identification and management guidance for pests and plant diseases.
Market Prices: Access current market rates for different crops in your region.
Resource Library: Educational articles and tutorials on best agricultural practices.
User Dashboard: Personalized space for farmers to save preferences and track activities.

---

## Backend Setup 🛠️

The server code lives in the `backend/` directory. To run it correctly you must create a `.env` file containing your configuration values and install the dependencies.

### .env variables
```dotenv
MONGO_URI=<your MongoDB connection string, include username/password>
DB_NAME=krishiDB          # optional, defaults to krishiDB
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ALLOWED_ORIGIN=http://127.0.0.1:5500   # or your frontend URL

# SMTP settings used for sending OTP emails (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=krishi-no-reply@yourdomain.com
```

- _Database errors_ such as `querySrv ENOTFOUND` are almost always due to an incorrect or incomplete `MONGO_URI`. Make sure you replace placeholders with the actual username/password and include the correct cluster address/DB name from your MongoDB Atlas dashboard.
- If you are using Atlas you also need to whitelist the IP address of the machine running the server (or `0.0.0.0/0` for open access during development). A typical error message will look like:
  
  ```
  ❌ Mongo Error: Could not connect to any servers in your MongoDB Atlas cluster. 
  One common reason is that you're trying to access the database from an IP that isn't whitelisted.
  ```

- Alternatively you can run a local MongoDB server (`mongod`) and set `MONGO_URI=mongodb://localhost:27017`.

### OTP/email verification
The signup flow now requires email verification. When a user clicks **Send OTP** the backend generates a six‑digit code and either logs it to the console (development) or sends it via SMTP if credentials are provided.

Endpoints:
- `POST /auth/send-otp` → `{ email }`
- `POST /auth/verify-otp` → `{ email, code }`

The client-side `js/register.js` handles the UI and interacts with these endpoints.

If you don't want to configure SMTP, omit the SMTP variables and check the server console to retrieve the OTP during testing.

Make sure `MONGO_URI` is a valid URI; the placeholder `<aman>` in the example should be replaced with the actual password for the `admin` user or any account you create.

## Vercel Deployment 🚀

This project is ready to deploy from the repository root on Vercel. The static frontend is served directly, and the backend routes are exposed as serverless functions under `/api`.

### How it works
- Frontend pages remain in the repository root.
- Backend API endpoints are routed through Vercel functions in the `api/` folder.
- Client-side code uses `const API_BASE_URL = '/api';` so it works automatically after deployment.

### Required Vercel environment variables
```dotenv
MONGO_URI=<your MongoDB connection string>
DB_NAME=krishiDB
JWT_SECRET=<your jwt secret>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
USE_IN_MEMORY_DB=false
```

If you prefer a temporary fallback mode without MongoDB, set `USE_IN_MEMORY_DB=true`. Data will not persist across server restarts.

### Deploy to Vercel
1. Install dependencies in the root:
```
npm install
```
2. Deploy from the repo root:
```
vercel
```

### Local Vercel development
Run the Vercel development environment to test functions locally:
```
vercel dev
```

### API routes after deployment
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/farm/profile`
- `POST /api/farm/profile`

### Notes
- `vercel.json` is configured to route `/api/*` to the correct serverless handlers.
- If you use `vercel dev`, Vercel will load the same environment variables from your Vercel project settings.

### Start the server
```
cd backend
npm install
npm start
```

Health check: `GET http://localhost:10000/` should respond with `KRISHI backend running ✅`.

Signup/Login endpoints are mounted under `/auth` (`/auth/signup`, `/auth/login`).

---
