# 🚀 How to Run the Preset Accounts Script

## Quick Start

### Option 1: Using npm script (Easiest)

```bash
npm run create-accounts
```

### Option 2: Direct Node.js command

```bash
node create-preset-accounts.js
```

---

## Step-by-Step Instructions

### Step 1: Make Sure You Have a .env File

Your `.env` file should be in the project root and contain:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Run the Script

Open your terminal in the project directory and run:

```bash
npm run create-accounts
```

### Step 3: Check the Output

You should see output like:

```
🚀 Creating preset demo accounts...

📝 Creating admin account: admin@demo.com
✅ Firebase Auth user created: abc123xyz789...
✅ Firestore document created with role: admin

📝 Creating institution account: institution@demo.com
✅ Firebase Auth user created: def456uvw012...
✅ Firestore document created with role: institution

📊 Summary:
==================================================
✅ ADMIN: admin@demo.com / admin123456
✅ INSTITUTION: institution@demo.com / institution123456
==================================================

✨ Done! You can now login with these accounts.
```

### Step 4: Test Login

Try logging in with:
- **Admin**: `admin@demo.com` / `admin123`
- **Institution**: `school@demo.com` / `school123`

---

## What the Script Does

1. ✅ Reads your Firebase config from `.env` file
2. ✅ Creates two Firebase Authentication accounts:
   - `admin@demo.com` with password `admin123`
   - `school@demo.com` with password `school123`
3. ✅ Creates Firestore documents for each account with the correct role
4. ✅ Shows a summary of created accounts

---

## Troubleshooting

### Error: "Error reading .env file"
**Solution:** Make sure you have a `.env` file in the project root with your Firebase config.

### Error: "Missing Firebase configuration"
**Solution:** Check that all required Firebase config values are in your `.env` file.

### Error: "email-already-in-use"
**Solution:** The account already exists. The script will skip it and continue. You can still use the existing account.

### Error: "Cannot find module 'firebase'"
**Solution:** Run `npm install` to install dependencies first.

### Error: "Permission denied" in Firestore
**Solution:** Make sure your Firestore security rules allow creating user documents. The rules should allow users to create their own documents.

---

## Manual Alternative

If the script doesn't work, you can manually create the accounts:

1. Go to Firebase Console → Authentication → Users
2. Click "Add user" for each account
3. Go to Firestore Database → users collection
4. Create documents with the user's UID and set the role field

See `PRESET_ACCOUNTS.md` for detailed manual instructions.

---

## Customizing Account Credentials

If you want to change the email/password, edit `create-preset-accounts.js`:

```javascript
const accounts = [
  { email: "your-admin@email.com", password: "your-password", role: "admin" },
  { email: "your-institution@email.com", password: "your-password", role: "institution" }
];
```

Then run the script again.

