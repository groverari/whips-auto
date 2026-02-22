# Whips Auto - Setup & Deployment Guide

Your website is almost ready! Follow these steps to complete the setup:

## 1️⃣ Formspree Form Setup (5 minutes)

The contact form needs a Formspree form ID to work.

### Quick Setup:
1. Go to [formspree.io](https://formspree.io)
2. Click "Get started" → Create free account
3. Once logged in, click "New form"
4. Name it "Whips Auto Contact"
5. Copy the **Form ID** (it will be something like `f/abc123def`)
6. Open `src/pages/Contact.jsx` and replace:
   ```javascript
   const FORMSPREE_FORM_ID = 'YOUR_FORM_ID'
   ```
   with:
   ```javascript
   const FORMSPREE_FORM_ID = 'abc123def' // your actual ID
   ```
7. Save the file

**That's it!** Submissions will now go to your Formspree inbox.

## 2️⃣ Update Shop Details

Edit `src/pages/Contact.jsx` and update the shop info:

```javascript
// Around line 150, replace the contact info:
<p className="text-gray-400">Your Address<br/>City, ST ZIP</p>
<p className="text-gray-400">(555) 123-4567</p>
<p className="text-gray-400">Mon-Fri: 9AM-6PM<br/>Sat: 10AM-4PM</p>
```

## 3️⃣ Deploy to Netlify (5 minutes)

### Option A: Connect GitHub (Recommended)
1. Push this repo to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Whips Auto website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/whips-auto.git
   git push -u origin main
   ```

2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select GitHub and find `whips-auto`
5. Click "Deploy" (Netlify will auto-detect Vite build settings)

### Option B: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 4️⃣ Test Locally (Optional)

```bash
npm run dev
```

Visit `http://localhost:5173` and test:
- [ ] Scroll through the hero section (4 scenes)
- [ ] Services page loads
- [ ] Contact form submits successfully
- [ ] Forms appear in Formspree inbox

## 🎨 Customization

### Colors
Edit Tailwind classes in components. Current theme is red/gray/yellow. To change:
- Hero colors: Edit `color` in `scenes` array in `Home.jsx`
- Button colors: Edit classes like `bg-yellow-400`

### Services
Edit the `services` array in `Services.jsx` to add/remove services

### Car Model
Currently using SVG. To upgrade:
- Find a 3D car model (Sketchfab, Turbosquid)
- Use Three.js or Babylon.js to render it
- Modify `Car3D.jsx` to load and animate the model

## 📊 Analytics (Optional)

Add Google Analytics or Vercel Analytics:
```bash
npm install @vercel/analytics @vercel/web-vitals
```

Then add to `src/main.jsx`:
```javascript
import { Analytics } from "@vercel/analytics/react"
// Add <Analytics /> to your App
```

## 🚨 Troubleshooting

**Form submissions not working?**
- Check that FORMSPREE_FORM_ID is correct (no quotes, just the ID)
- Verify Formspree account is still active
- Check browser console for errors

**Site not deploying?**
- Ensure `dist/` is in `.gitignore` (it is)
- Check that build command is `npm run build`
- Publish directory should be `dist`

**Car not showing?**
- It's SVG-based, should work everywhere
- Check browser console for errors
- Scroll to see the rotation effect

## 📞 Need Help?

- **Vite docs:** https://vitejs.dev
- **React docs:** https://react.dev
- **Tailwind docs:** https://tailwindcss.com
- **Netlify docs:** https://docs.netlify.com

---

**That's it!** Once you push to GitHub, Netlify will auto-deploy any future changes. Just push and wait ~1-2 minutes for the site to update.

Enjoy! 🚗
