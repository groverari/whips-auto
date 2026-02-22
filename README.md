# Whips Auto Website

Premium auto repair shop website with scroll-based interactive 3D car visualization.

## Features

- **Interactive Hero:** Scroll-driven car model that transitions through different scenes (full car → engine → wheel → contact)
- **Dynamic Scene Transitions:** Background colors and CTAs change based on scroll position
- **Services Page:** Complete service offerings with icons and descriptions
- **Contact Form:** Customer inquiry form with Formspree integration
- **Responsive Design:** Mobile-first design with Tailwind CSS
- **Smooth Animations:** Framer Motion for polished transitions

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

## TODO: Add Real 3D Car Model

Currently using emoji placeholders (🚗). To upgrade:

**Option A: Use Spline (Recommended)**
1. Go to [spline.design](https://spline.design)
2. Create free account
3. Search for car models in their library (or import your own)
4. Customize (colors, lighting, camera angles)
5. Export as React component
6. Update `src/pages/Home.jsx` to use Spline component

**Option B: Use Three.js**
1. Install Three.js: `npm install three`
2. Find a car model (Sketchfab, Turbosquid)
3. Create a new component in `src/components/Car3D.jsx`
4. Implement scroll-based camera control
5. Integrate into Home.jsx

## Form Setup (Formspree)

1. Go to [formspree.io](https://formspree.io)
2. Create free account
3. Create new form
4. Copy your Form ID
5. Replace `YOUR_FORM_ID` in `src/pages/Contact.jsx`

## Deployment to Netlify

1. Push repo to GitHub
2. Connect GitHub repo to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

## Customization

- **Colors:** Edit Tailwind classes in components (blue, orange, gray, green themes)
- **Content:** Update shop details in Contact.jsx (address, hours, phone)
- **Services:** Modify services array in Services.jsx
- **Logo:** Update "WHIPS AUTO" text or add actual logo in Navbar.jsx

## Notes

- The scroll mechanism is 100% functional with emoji placeholders
- Replace emojis with actual 3D models (Spline recommended for simplicity)
- Form emails will go to your Formspree inbox until you configure actual email forwarding
- Mobile scrolling works perfectly on all devices
