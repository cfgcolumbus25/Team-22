# 🔑 Preset Demo Accounts Setup

## Overview

The system is configured so that:
- ✅ **Learners** can register through the sign-up form
- 🔒 **Admin** and **Institution** accounts are preset (not available for public registration)

## Option 1: Create Preset Accounts Manually (Recommended for Demo)

### Step 1: Create Accounts in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication → Users**
4. Click **Add user**
5. Create two users:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123456` (or your choice)
- Click **Add user**

**Institution Account:**
- Email: `institution@demo.com`
- Password: `institution123456` (or your choice)
- Click **Add user**

### Step 2: Add Roles in Firestore

1. Go to **Firestore Database → Data**
2. For each user you just created:

**For Admin:**
- Click **Start collection** (if no `users` collection exists)
- Collection ID: `users`
- Document ID: [Copy the UID from Authentication → Users → admin@demo.com]
- Add fields:
  - `email` (string): `admin@demo.com`
  - `role` (string): `admin`
  - `createdAt` (timestamp): [current time]
  - `updatedAt` (timestamp): [current time]

**For Institution:**
- Click **Add document** in `users` collection
- Document ID: [Copy the UID from Authentication → Users → institution@demo.com]
- Add fields:
  - `email` (string): `institution@demo.com`
  - `role` (string): `institution`
  - `createdAt` (timestamp): [current time]
  - `updatedAt` (timestamp): [current time]

### Step 3: Test Login

Try logging in with:
- `admin@demo.com` / `admin123456` → Should see Admin Dashboard
- `institution@demo.com` / `institution123456` → Should see Institution Dashboard

---

## Option 2: Use the Script (Alternative)

If you prefer to use a script:

1. Install dotenv: `npm install dotenv`
2. Run: `node create-preset-accounts.js`

This will automatically create the preset accounts.

---

## Demo Account Credentials

After setup, you can use these for demos:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`
- Role: Admin
- Access: Full admin dashboard

**Institution Account:**
- Email: `school@demo.com`
- Password: `institution123`
- Role: Institution
- Access: Institution dashboard

**Learner Account:**
- Any user can register as a learner through the sign-up form
- Email: (user chooses)
- Password: (user chooses)
- Role: Learner (automatically assigned)

---

## Security Notes

- ⚠️ These are demo accounts - change passwords for production
- ⚠️ Admin accounts should be carefully managed
- ⚠️ Consider using Firebase Admin SDK for production preset accounts
- ✅ Registration form only allows learner accounts
- ✅ Preset accounts are not visible in registration form

---

## Updating Preset Accounts

If you need to change preset account credentials:

1. Go to Firebase Console → Authentication → Users
2. Click on the user
3. Click **Reset password** or **Delete user**
4. Create new account and update Firestore document

---

## Troubleshooting

**Can't login with preset account?**
- Check user exists in Firebase Authentication
- Check Firestore document exists with correct UID
- Verify `role` field is set correctly in Firestore

**Role not working?**
- Check Firestore document has `role` field
- Verify role value is exactly: `"admin"` or `"institution"` (lowercase)
- Check browser console for errors

