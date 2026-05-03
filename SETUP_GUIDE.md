# Krishi Sathi - Setup & Testing Guide

## ✅ Completed Setup

### Database
- **MongoDB Atlas** connected with credentials
- Connection URI: `mongodb+srv://krishisathi:aman@cluster0.be9e4tj.mongodb.net/krishiDB`
- Database: `krishiDB`

### Backend Features
- Express.js server running on port **10000**
- JWT authentication with 7-day expiration tokens
- OTP email verification system
- Bcryptjs password hashing
- Cloudinary image upload support

### Frontend Updates
- Login & registration pages configured with API_BASE_URL: `http://127.0.0.1:10000`
- JWT tokens stored in localStorage after login/signup
- User data persisted in localStorage

---

## 🚀 How to Run

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```
You should see:
```
⚠️ SMTP not configured - OTP emails will only be logged to console
🚀 Server on port 10000
✅ MongoDB Connected
```

### Step 2: Serve Frontend (in another terminal)
Use Live Server or a simple server:
```bash
# Option 1: Using Python
python -m http.server 5500

# Option 2: Using Node (http-server)
npx http-server -p 5500
```

### Step 3: Open in Browser
Navigate to: `http://127.0.0.1:5500`

---

## 🧪 Testing Login & Registration

### Test 1: New User Registration
1. Click **"Register"** or go to `http://127.0.0.1:5500/register.html`
2. Fill in details:
   - Full Name: Test Farmer
   - Age: 35
   - Phone: 9876543210
   - Aadhaar: 123456789012
   - Email: testfarmer@example.com
   - Photo: (optional)

3. Click **"Send OTP"** → Check backend console for OTP code (e.g., `123456`)
4. Click **"Verify OTP"** → Enter the code from console
5. Click **"Register"** → Create password (min 6 chars, must match confirmation)
6. ✅ Should redirect to dashboard with token saved

### Test 2: Login with Saved Credentials
1. Go to `http://127.0.0.1:5500/login.html`
2. Enter email and password from previous registration
3. Click **"Login"**
4. ✅ Should redirect to dashboard with token saved

### Test 3: Verify localStorage
Open browser DevTools (F12) → Application → Local Storage:
- `authToken` - JWT token (should be valid 7 days)
- `user` - User JSON object with id, name, email, photoUrl

---

## 📋 API Endpoints

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/send-otp` | Send OTP to email |
| POST | `/auth/verify-otp` | Verify OTP code |
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |

### Request/Response Examples

**POST /auth/login**
```json
Request:
{
  "email": "testfarmer@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Farmer",
    "email": "testfarmer@example.com",
    "photoUrl": null
  }
}
```

---

## 🔐 Security Features

✅ Passwords hashed with bcryptjs (10 salt rounds)
✅ JWT tokens for session management
✅ Email OTP verification required for signup
✅ CORS configured for frontend origin
✅ MongoDB Atlas with encrypted connection

---

## 📝 Environment Variables (.env)

```
MONGO_URI=mongodb+srv://krishisathi:aman@cluster0.be9e4tj.mongodb.net/krishiDB?retryWrites=true&w=majority
DB_NAME=krishiDB
CLOUDINARY_CLOUD_NAME=dgfm0zxsy
CLOUDINARY_API_KEY=982221452294685
CLOUDINARY_API_SECRET=Zoq_jbKaY_h4psy2M15VcCkX_rA
ALLOWED_ORIGIN=http://127.0.0.1:5500
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Could not connect to any servers in your MongoDB Atlas cluster"
**Solution:** Make sure your IP is whitelisted in MongoDB Atlas:
- Go to Atlas → Network Access
- Add your IP or use `0.0.0.0/0` for development

### Issue: OTP not being sent to email
**Solution:** SMTP is not configured. Check server console for OTP code instead.

### Issue: CORS error when calling API from frontend
**Solution:** Make sure backend is running on port 10000 and frontend on 5500

### Issue: "JWT_SECRET is missing"
**Solution:** Add `JWT_SECRET` to backend/.env file

---

## 🎯 Next Steps

- [x] MongoDB Atlas configured
- [x] JWT authentication implemented
- [x] Login/Registration working
- [ ] Add logout functionality
- [ ] Implement protected routes for dashboard
- [ ] Add user profile editing
- [ ] Set up email notifications

---

## 📞 Support

For password-related issues or to reset a user, you can directly query MongoDB Atlas dashboard or use:
```bash
cd backend && npx mongo
# Connect to your database and delete user if needed
```
