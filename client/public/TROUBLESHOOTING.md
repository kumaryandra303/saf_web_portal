# SAF Website Troubleshooting Guide

## Problem: Blank Page / Website Not Loading

### Step 1: Verify Server is Running

Check your terminal/command prompt. You should see:
```
VITE v5.4.21  ready in XXXXms

➜  Local:   http://localhost:3000/
```

If you don't see this, run:
```bash
npm run dev
```

### Step 2: Access Correct URL

**IMPORTANT**: Make sure you're accessing the correct port!

✅ **Correct URL**: `http://localhost:3000`
❌ **Wrong URL**: `http://localhost:3001` or any other port

### Step 3: Clear Browser Cache

1. Press `Ctrl + Shift + Delete` (Windows)
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (`Ctrl + F5`)

### Step 4: Check Browser Console

1. Open the website at `http://localhost:3000`
2. Press `F12` to open Developer Tools
3. Click the "Console" tab
4. Look for any red error messages
5. Take a screenshot and share it

### Step 5: Try Different Browser

If using Chrome, try:
- Microsoft Edge
- Firefox
- Or open in Incognito/Private mode

### Step 6: Check Firewall

Make sure your firewall isn't blocking localhost connections.

### Quick Fix Commands

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev

# Or kill all node processes and restart:
taskkill /F /IM node.exe
npm run dev
```

### Alternative: Use Batch File

Double-click `open-website.bat` in the SAF folder to automatically open the correct URL.

### Still Not Working?

1. **Check terminal for errors** - Look for red error messages
2. **Verify Node.js version** - Run `node --version` (should be v16 or higher)
3. **Reinstall dependencies**:
   ```bash
   rmdir /s /q node_modules
   npm install
   npm run dev
   ```

### Common Issues

#### Issue: "Cannot GET /"
- **Solution**: Make sure `npm run dev` is running

#### Issue: Port already in use
- **Solution**: Change port in `vite.config.js` or kill the process using port 3000

#### Issue: White screen with loading dots
- **Solution**: Check browser console (F12) for JavaScript errors

#### Issue: CSS not loading
- **Solution**: Make sure Tailwind CSS is properly configured

### Getting Help

If none of these work, provide:
1. Screenshot of terminal showing `npm run dev` output
2. Screenshot of browser console (F12 → Console tab)
3. Screenshot of what you see in the browser
4. Your Node.js version (`node --version`)
