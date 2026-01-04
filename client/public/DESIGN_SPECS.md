# SAF Website Design Specifications

## Brand Identity

### Logo
- **Primary Logo**: Red shield with raised fist symbolizing empowerment and community strength
- **Colors**: Deep red (#dc2626) with dark maroon accents (#7f1d1d)
- **Typography**: Bold, modern sans-serif (SAF text)

### Color Palette

#### Primary Colors
- **SAF Red**: `#dc2626` - Main brand color, used for CTAs, headers, and key elements
- **SAF Dark Red**: `#991b1b` - Darker variant for depth and shadows
- **SAF Maroon**: `#7f1d1d` - Deepest shade for text and borders

#### Secondary Colors
- **SAF Gold**: `#eab308` - Accent color for highlights and premium elements
- **SAF Dark**: `#1a1d20` - Primary text and dark backgrounds
- **White**: `#ffffff` - Clean backgrounds and contrast

#### Neutral Colors
- **Gray 50-900**: Full spectrum for backgrounds, borders, and text hierarchy

### Typography

#### Font Families
- **Display/Headings**: Poppins (Bold, SemiBold)
- **Body Text**: Inter (Regular, Medium, SemiBold)

#### Font Sizes
- **Hero Title**: 56-72px (mobile: 40-48px)
- **Section Titles**: 36-48px (mobile: 28-36px)
- **Card Titles**: 20-24px
- **Body Text**: 16-18px
- **Small Text**: 14px

### Design Elements

#### Cards
- **Border Radius**: 12-16px (rounded-xl)
- **Shadow**: Soft shadows with red tint on hover
- **Padding**: 24-32px
- **Hover Effect**: Scale(1.02-1.05) + enhanced shadow

#### Buttons
- **Primary**: Red background, white text, rounded-lg
- **Secondary**: White background, red border and text
- **Hover**: Scale(1.05) + shadow enhancement

#### Spacing
- **Section Padding**: 80px vertical (mobile: 60px)
- **Container Max Width**: 1280px (7xl)
- **Grid Gaps**: 24-32px

## Component Specifications

### Navigation Bar
- **Height**: 72px
- **Background**: White with subtle backdrop blur
- **Shadow**: Appears on scroll
- **Logo**: Shield icon + SAF text
- **Links**: Hover with red background transition
- **Mobile**: Hamburger menu with slide-down animation

### Hero Section
- **Background**: Gradient from red-600 to dark-900
- **Pattern Overlay**: Subtle geometric pattern at 20% opacity
- **Height**: 100vh minimum
- **Content**: Left-aligned text with right-side visual
- **CTAs**: Two buttons (primary + secondary)
- **Stats**: 3-column grid with large numbers

### Mission Cards
- **Layout**: 4-column grid (responsive: 2-col mobile, 4-col desktop)
- **Icon Header**: Gradient background with white icon
- **Content**: Title + description + stats badge
- **Colors**: Each card has unique gradient (pink, blue, green, orange)

### About Section
- **Layout**: 2-column (text left, timeline right)
- **Timeline**: Vertical with dots and connecting lines
- **Background**: White with floating gradient orbs
- **Mission Statement**: Full-width red gradient banner

### Programs Section
- **Layout**: 2-column grid
- **Cards**: Large with gradient header + feature list
- **Icons**: Lucide React icons
- **Features**: Checkmark list with green icons

### Transparency Section
- **Stats Grid**: 4-column with icons
- **Updates Feed**: Stacked cards with colored icon badges
- **Commitment Box**: Green gradient background

### Gallery
- **Layout**: 3-column grid (2-col mobile)
- **Images**: Square aspect ratio, rounded corners
- **Hover**: Scale effect

### Leadership
- **Layout**: 3-column grid
- **Cards**: Centered with circular avatar
- **Avatar**: Gradient background with user icon

### Footer
- **Background**: Dark (saf-dark-900)
- **Layout**: 4-column grid (responsive)
- **Social Icons**: Hover with color transitions
- **Bottom Bar**: Copyright + links

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Animations

- **Fade In Up**: Entry animation for sections
- **Hover Scale**: 1.02-1.05 for cards
- **Smooth Scroll**: CSS scroll-behavior: smooth
- **Transitions**: 300ms duration, ease-out timing

## Accessibility

- **Contrast Ratio**: AA compliant (4.5:1 minimum)
- **Focus States**: Visible outline on interactive elements
- **Alt Text**: All images and icons
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: For icon-only buttons

## Social Media Integration

### Hashtags
- #SettibalijaActionForce
- #VasamsettiSubash
- #SAFTeam
- #Andhrapradesh
- #Telangana

### Social Links
- Facebook
- Twitter/X
- Instagram
- YouTube
- LinkedIn

## Assets Location

- **Gallery Images**: `C:\Users\user\Downloads\SAF_GALARY\`
- **Logo**: Included in project as SVG
- **Videos**: Available in gallery folder (4 videos)

## Technical Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **Animations**: Framer Motion (optional)

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Mobile Friendly**: 100%
