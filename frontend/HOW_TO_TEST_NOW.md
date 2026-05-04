# 🧪 Complete Testing Guide - Profile & Logout

## Quick Test (5 minutes)

### Step 1: Start Backend & Frontend
```bash
# Terminal 1
cd backend
npm start

# Terminal 2
python -m http.server 5500
```

### Step 2: Register New Account
1. Go to: `http://127.0.0.1:5500/register.html`
2. Fill form:
   - Full Name: **John Farmer** (remember this name!)
   - Age: **35**
   - Phone: **9876543210**
   - Aadhaar: **123456789012**
   - Email: **john@example.com**
   - Password: **password123**
   - Confirm: **password123**
3. Click **Register**

**Expected:** Redirects to dashboard ✅

### Step 3: Verify Dashboard Shows Correct Data
1. Dashboard should display:
   - **"Hello, John Farmer"** (your registered name, NOT "Ramesh Kumar")
   - **Full Name: John Farmer**
   - **Age: 35**
   - **Phone: 9876543210**
   - **Aadhaar: 123456789012**

**Expected:** Shows YOUR data, not random dummy data ✅

### Step 4: Visit Profile Page
1. Click **"Profile"** link in navbar
2. Form should be pre-filled with your registration data:
   - Full Name: John Farmer ✅
   - Age: 35 ✅
   - Phone: 9876543210 ✅
   - Aadhaar: 123456789012 ✅

3. Add more profile details:
   - Address: Village ABC, District XYZ
   - Land Size: 2.5
   - Farming Type: Organic
   - Crops Grown: Wheat, Rice

4. Click **"Save Profile"**

**Expected:** Message "Profile saved successfully!" ✅

### Step 5: Verify Profile Display
1. After saving, page shows:
   - All your registration data
   - All the new profile details you just added
   - "Edit Profile" button

2. Click **"Edit Profile"** to edit again

**Expected:** Form reappears with all your data ✅

### Step 6: Test Logout
1. Click **"Logout"** button (top right)
2. Confirm logout

**Expected:**
- Redirects to login page ✅
- All data cleared ✅

### Step 7: Login Again
1. Login with same credentials:
   - Email: john@example.com
   - Password: password123
2. Click **"Login"**

**Expected:**
- Dashboard appears with all your data ✅
- Profile data persists ✅
- Shows "Hello, John Farmer" ✅

---

## Complete Test Scenarios

### Scenario 1: New User Complete Journey
```
Register → Dashboard shows correct data → Visit profile →
Add profile details → Save → View profile → Logout →
Login again → All data intact ✅
```

### Scenario 2: Verify Data Persistence
```
1. Register as "Alice"
2. Go to profile, add details
3. Save profile
4. Logout
5. Login again
6. Dashboard shows "Hello, Alice"
7. Profile shows all saved details ✅
```

### Scenario 3: Edit Profile
```
1. Register and save profile
2. Click "Edit Profile"
3. Change land size: 5 acres
4. Change farming type: Commercial
5. Save
6. View profile - changes should appear ✅
```

### Scenario 4: Authentication Protection
```
1. Clear browser storage (F12 → Application → Clear all)
2. Try to visit dashboard.html directly
3. Should redirect to login.html ✅
4. Try to visit profile.html directly
5. Should redirect to login.html ✅
```

---

## Verification Checklist

### Registration Data Appears on Dashboard ✅
- [ ] Dashboard shows registered name (not "Ramesh Kumar")
- [ ] All registration fields displayed correctly
- [ ] No hardcoded dummy data showing
- [ ] User greeting personalizes with actual name

### Profile Page Works Correctly ✅
- [ ] Form pre-filled with registration data
- [ ] Can add more profile details
- [ ] Save button works
- [ ] Profile display shows saved data
- [ ] Edit Profile button works
- [ ] Can re-edit and save again

### Logout Works Properly ✅
- [ ] Logout button found on both dashboard & profile
- [ ] Confirmation dialog appears
- [ ] Clicking confirm redirects to login
- [ ] localStorage is cleared (check F12 → Application)
- [ ] Cannot access dashboard without logging in again

### Data Persists Across Login/Logout ✅
- [ ] Logout then login again
- [ ] Dashboard shows same data
- [ ] Profile shows same data
- [ ] No data loss

### Authentication Protection ✅
- [ ] Cannot access dashboard without token
- [ ] Cannot access profile without token
- [ ] Redirects to login if token missing
- [ ] Clears localStorage on logout

---

## Browser DevTools Inspection

### Check localStorage after Registration/Login
1. Press **F12** to open DevTools
2. Go to → **Application** → **Local Storage** → **http://127.0.0.1:5500**
3. You should see:

```
authToken: eyJhbGciOiJIUzI1NiIsInR5c... (JWT token)
user: {
  "id": "507f1f77bcf86cd799439011",
  "name": "John Farmer",
  "email": "john@example.com",
  "photoUrl": null
}
```

### Check localStorage after Saving Profile
4. Still in Local Storage, you should see:

```
farmerProfile: {
  "fullName": "John Farmer",
  "age": "35",
  "phone": "9876543210",
  "aadhar": "123456789012",
  "address": "Village ABC, District XYZ",
  "landSize": "2.5",
  "farmingType": "Organic",
  "crops": "Wheat, Rice",
  ... more fields ...
}
```

### Check localStorage After Logout
5. After logout, localStorage should be EMPTY:
```
(no items)
```

---

## Expected Results

### ✅ Everything Working
```
✓ Dashboard shows "Hello, [Your Name]"
✓ Profile data pre-filled correctly
✓ Can save and edit profile
✓ Logout clears all data
✓ Login re-loads all data
✓ No hardcoded dummy data
✓ No random values
✓ Authentication protects pages
```

### ❌ If Something's Wrong
```
✗ Dashboard shows "Ramesh Kumar" → dashboard.js not loading
✗ Profile form empty → localStorage not reading properly
✗ Logout does nothing → onclick handler not working
✗ Data disappears after logout/login → localStorage not persisting
✗ Can access dashboard without login → auth check missing
```

---

## Troubleshooting

### Issue: Dashboard shows "Ramesh Kumar"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Close and reopen browser
- Check console (F12) for errors
- Verify backend is running on port 10000

### Issue: Profile form is empty
**Solution:**
- Check if you're logged in (should see token in localStorage)
- Verify registration data was saved
- Check browser console for JavaScript errors
- Try registering a new account

### Issue: Logout button doesn't work
**Solution:**
- Check that dashboard.html has `id="logoutBtn"`
- Check profile.html has `handleLogout()` function
- Try clicking from different page (dashboard vs profile)
- Check browser console for errors

### Issue: Data disappears after logout/login
**Solution:**
- Make sure you click "Save Profile" before logout
- Check localStorage for `farmerProfile` key after save
- Verify backend/frontend both running
- Try in incognito/private window (no cache)

---

## Success Indicators

When everything is working correctly, you should see:

1. **On Registration:**
   - ✅ Form accepts all data
   - ✅ Redirects to dashboard
   - ✅ Token saved to localStorage

2. **On Dashboard:**
   - ✅ Shows your registration name
   - ✅ All fields populated correctly
   - ✅ Profile link works

3. **On Profile Page:**
   - ✅ Form pre-filled with registration data
   - ✅ Can add more information
   - ✅ Save button persists data

4. **On Logout:**
   - ✅ Confirmation dialog appears
   - ✅ Redirects to login
   - ✅ localStorage cleared

5. **On Second Login:**
   - ✅ Dashboard shows same name
   - ✅ Profile shows all saved data
   - ✅ No data loss

---

## 🎉 When All Tests Pass

Your system is **production-ready** with:
- ✅ Complete authentication flow
- ✅ User data persistence
- ✅ Profile management
- ✅ Logout functionality
- ✅ Security protections

**Ready to deploy!** 🚀
