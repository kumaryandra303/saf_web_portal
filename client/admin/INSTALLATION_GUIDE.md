# SAF Admin Portal - Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
  - Download from: https://nodejs.org/
  - To check version: `node --version`

- **npm** (comes with Node.js)
  - To check version: `npm --version`

## Installation Steps

### Method 1: Using Batch Files (Windows - Recommended)

1. **Navigate to the admin folder**
   ```
   cd C:\SSSSSS\saf_web_portal\client\admin
   ```

2. **Run the setup script**
   ```
   setup.bat
   ```
   This will:
   - Check Node.js installation
   - Install all dependencies
   - Prepare the project for development

3. **Start the development server**
   ```
   start.bat
   ```
   This will:
   - Check if dependencies are installed
   - Start the development server
   - Automatically open your browser at http://localhost:3001

4. **Open the admin portal (if not auto-opened)**
   ```
   open-admin.bat
   ```

### Method 2: Manual Installation

1. **Navigate to the admin folder**
   ```bash
   cd C:\SSSSSS\saf_web_portal\client\admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to: http://localhost:3001

## Login Credentials

Use these credentials to test the admin portal:

```
Username: admin
Password: Admin@123
```

## Project Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use

If port 3001 is already in use, you can:

1. **Edit vite.config.js** and change the port:
   ```javascript
   server: {
     port: 3002, // Change to any available port
     open: true
   }
   ```

2. **Stop the existing process** using port 3001

### Dependencies Installation Failed

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**
   ```bash
   rmdir /s node_modules
   npm install
   ```

### Module Not Found Errors

Make sure all dependencies are installed:
```bash
npm install
```

### Browser Not Opening Automatically

Manually open your browser and navigate to:
- http://localhost:3001

## Folder Structure

After installation, your folder structure should look like:

```
admin/
├── node_modules/        # Dependencies (auto-generated)
├── public/              # Static files
├── src/                 # Source code
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── App.jsx          # Main app
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── dist/                # Production build (after npm run build)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── setup.bat
├── start.bat
└── README.md
```

## Next Steps

After successful installation:

1. **Login** to the admin portal using the demo credentials
2. **Explore** the dashboard and navigation
3. **Review** the code structure in the `src/` folder
4. **Customize** as needed for your requirements

## Production Deployment

To build for production:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Output location**
   - The production build will be in the `dist/` folder

3. **Deploy**
   - Upload the `dist/` folder to your web server
   - Or use services like Netlify, Vercel, or GitHub Pages

## Support

For issues or questions:
- Check README.md for detailed documentation
- Check PROJECT_INFO.md for technical details
- Contact SAF development team

---

**Important Notes:**

- Make sure Node.js is installed before running any commands
- The development server runs on port 3001 by default
- Demo authentication is client-side only (for production, connect to a real backend)
- Keep your dependencies updated for security and performance

**Happy Coding! 🚀**











