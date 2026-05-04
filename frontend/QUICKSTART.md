# 🚀 Quick Start - Krishi Sathi (No OTP)

## In 3 Steps:

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
npm start
```
**Expected output:**
```
✅ MongoDB Connected
🚀 Server on port 10000
```

### Step 2: Start Frontend (Terminal 2)
```bash
# From project root (republic folder)
python -m http.server 5500
```

### Step 3: Open Browser
```
http://127.0.0.1:5500
```

---

## ✅ What's Ready

- ✅ **Registration**: Direct signup (no OTP needed)
- ✅ **Login**: Email + password authentication
- ✅ **Passwords**: Securely hashed with bcryptjs
- ✅ **Sessions**: JWT tokens (valid 7 days)
- ✅ **Database**: MongoDB Atlas connected
- ✅ **Storage**: User data saved in localStorage

---

## 🧪 Test It

### Register New User
1. Go to: `http://127.0.0.1:5500/register.html`
2. Fill form:
   - Full Name: Test Farmer
   - Age: 35
   - Phone: 9876543210
   - Aadhaar: 123456789012
   - Email: testfarmer@example.com
   - Password: password123
   - Confirm: password123
3. Click "Register"
4. ✅ Redirects to dashboard

### Login
1. Go to: `http://127.0.0.1:5500/login.html`
2. Use same email & password
3. Click "Login"
4. ✅ Redirects to dashboard

### Verify Storage
- Open DevTools (F12) → Application → Local Storage
- See `authToken` (JWT)
- See `user` (JSON with name, email, etc.)

---

## 📝 Test Credentials Example

**Email:** testfarmer@example.com
**Password:** password123

---

## 🔗 API Base URL

All frontend API calls use: `http://127.0.0.1:10000`

**Make sure backend is running before testing!**

---

## 💾 Database

**MongoDB Atlas** credentials already configured:
- URI: `mongodb+srv://krishisathi:aman@cluster0.be9e4tj.mongodb.net/krishiDB`
- User: `krishisathi`
- Password: `aman`
- Database: `krishiDB`

**No additional setup needed!** ✅

---

## 📚 Documentation Files

1. **QUICKSTART.md** ← You are here
2. **FINAL_BACKEND.md** - Complete backend details
3. **IMPLEMENTATION_SUMMARY.md** - Technical details
4. **SETUP_GUIDE.md** - Detailed setup instructions

---

## 🎉 You're All Set!

Your **Krishi Sathi** application is **COMPLETE** and **READY TO USE**!

Backend: Simplified, secure, production-ready ✅
Frontend: Connected and working ✅
Database: MongoDB Atlas connected ✅

**Start coding or deploy!** 🚀
