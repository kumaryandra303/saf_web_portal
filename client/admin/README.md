# SAF Admin Portal

A professional React-based admin portal for Settibalija Action Force (SAF) with authentication functionality and modern UI design.

## Features

- ✅ **Secure Authentication** - Login system with captcha verification
- ✅ **Modern UI** - Professional design following SAF brand theme
- ✅ **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Dashboard** - Comprehensive dashboard with statistics and activity tracking
- ✅ **Protected Routes** - Secure routes that require authentication
- ✅ **Context API** - Global state management for authentication
- ✅ **Tailwind CSS** - Utility-first CSS framework for rapid development

## Tech Stack

- **React** 18.2.0 - UI Library
- **React Router DOM** 6.20.0 - Routing
- **Vite** 5.0.8 - Build tool and dev server
- **Tailwind CSS** 3.3.6 - Styling
- **Lucide React** 0.294.0 - Icons
- **Framer Motion** 10.16.16 - Animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```
   Or simply run:
   ```bash
   setup.bat
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Or use:
   ```bash
   start.bat
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Default Login Credentials

For testing purposes, use these credentials:

- **Username:** `admin`
- **Password:** `Admin@123`

## Project Structure

```
admin/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── layout/      # Layout components (Navbar, Sidebar, etc.)
│   │   └── ProtectedRoute.jsx
│   ├── context/         # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   │   └── Login.jsx
│   │   └── dashboard/   # Dashboard pages
│   │       ├── Dashboard.jsx
│   │       ├── DashboardHome.jsx
│   │       └── PlaceholderPage.jsx
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Available Routes

- `/login` - Login page
- `/dashboard` - Main dashboard (protected)
- `/dashboard/users` - Users management (coming soon)
- `/dashboard/reports` - Reports & analytics (coming soon)
- `/dashboard/documents` - Documents (coming soon)
- `/dashboard/projects` - Projects (coming soon)
- `/dashboard/calendar` - Calendar (coming soon)
- `/dashboard/messages` - Messages (coming soon)
- `/dashboard/database` - Database (coming soon)
- `/dashboard/security` - Security (coming soon)
- `/dashboard/settings` - Settings (coming soon)

## Customization

### Changing Colors

Edit `tailwind.config.js` to modify the SAF brand colors:

```javascript
colors: {
  'saf-red': { /* red shades */ },
  'saf-maroon': { /* maroon shades */ },
  'saf-dark': { /* dark shades */ }
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/pages/dashboard/Dashboard.jsx`
3. Add menu item in `src/components/layout/Sidebar.jsx`

## Development Server

The development server runs on `http://localhost:3001` by default.

## License

© 2026 Settibalija Action Force. All rights reserved.

## Support

For support, contact the SAF development team.



