# SAF Website Deployment Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The site will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Adding Gallery Images

1. Copy images from `C:\Users\user\Downloads\SAF_GALARY\` to `public/gallery/`
2. Update the Gallery component to reference these images
3. Supported formats: JPG, PNG, WebP

## Customization

### Update Content
- **Hero Section**: `src/components/home/HeroSection.jsx`
- **Mission Cards**: `src/components/home/MissionHighlights.jsx`
- **About Content**: `src/components/home/AboutPreview.jsx`
- **Programs**: `src/components/home/ProgramsPreview.jsx`

### Update Contact Information
- **Footer**: `src/components/Footer.jsx`
- **Contact Page**: `src/pages/Contact.jsx`

### Update Social Media Links
- **Footer**: `src/components/Footer.jsx` (socialLinks array)

### Update Colors
- **Tailwind Config**: `tailwind.config.js`
- **Custom CSS**: `src/index.css`

## Deployment Options

### Option 1: Netlify (Recommended)
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option 2: Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Framework preset: Vite
4. Deploy

### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload `dist` folder to web server
3. Configure server for SPA routing

## Environment Variables

Create `.env` file for sensitive data:
```
VITE_API_URL=your_api_url
VITE_CONTACT_EMAIL=info@saf.org
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance Optimization

- Images are lazy-loaded
- Code splitting enabled
- Tailwind CSS purged in production
- Minified assets

## SEO

- Meta tags in `index.html`
- Semantic HTML structure
- Social media hashtags in footer
- Sitemap (add `public/sitemap.xml`)

## Maintenance

### Regular Updates
- Update dependencies: `npm update`
- Check for security issues: `npm audit`
- Test on multiple devices

### Content Updates
- News/Updates: Edit `src/pages/Updates.jsx`
- Programs: Edit `src/pages/Programs.jsx`
- Gallery: Add images to `public/gallery/`

## Support

For technical issues or questions, contact the development team.

## License

© 2025 Settibalija Action Force (SAF). All rights reserved.
