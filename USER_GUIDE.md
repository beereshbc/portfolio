# Portfolio Feature Guide

## New Features Overview

### 1. Internal Browser Modal (Project Preview)

The portfolio now includes an embedded browser window for previewing live projects without opening new tabs.

**How It Works:**
1. Navigate to the **Works** section
2. Click the **"Preview"** button on any project card
3. A modal with a macOS-style browser window opens
4. The project loads in an iframe with a professional browser chrome
5. Press **ESC** or click outside the modal to close

**Browser Features:**
- Colored traffic light dots (red, yellow, green)
- URL bar showing the project link
- Simulated browser header with professional styling
- Loading indicator while iframe loads
- Close button and keyboard shortcut support

**Mobile:** On mobile devices, the browser modal takes up the full viewport with proper scrolling.

---

### 2. Parallax Scroll Animations

Multiple sections now feature smooth parallax effects that create depth as you scroll:

#### **Hero Section**
- Background text moves at a slower speed than the foreground
- Creates a 3D layering effect
- Dust particles float with subtle parallax

#### **About (Me) Section**
- Background glows parallax on scroll
- Hero image zooms and fades as you enter the viewport
- Text blocks fade in with staggered timing
- Responsive image sizing on all devices

#### **Works Section**
- Background colored shape parallaxes on scroll
- Floating particles animate with depth
- Carousel cards scale and rotate smoothly

#### **Skills Section**
- Background glows parallax and rotate with scroll
- Atmospheric effects create immersive vibe
- 3D carousel responds to scroll position

---

### 3. Scroll-Triggered Animations

All sections feature viewport-triggered animations that fire when elements enter the visible area:

**Implemented Across:**
- Text reveals (fade + slide up)
- Card reveals (scale + fade)
- Stat counters (count animation)
- Education timeline (staggered reveals)
- Skill cards (3D transforms)

---

## Performance Features

### Hardware Acceleration
- All animations use only `transform` and `opacity` properties
- GPU-accelerated for smooth 60 FPS performance
- No layout thrashing or reflow-causing animations

### Lazy Loading
- Browser modal iframe only renders when modal opens
- Images load on demand
- Carousel components mount conditionally

### Mobile Optimization
- Responsive text sizing at all breakpoints
- Touch-friendly buttons (minimum 44x44px)
- No horizontal scroll anywhere
- Optimized parallax intensity for mobile

---

## Using the Parallax Hooks

If you want to add parallax effects to custom components, use the provided hooks:

### `useParallax()`
```javascript
import { useParallax } from "../hooks/useParallax";

function MyComponent() {
  const { ref, y } = useParallax(0.5, 100); // speed=0.5, offset=100px
  
  return (
    <motion.div ref={ref} style={{ y }}>
      Content parallaxes as you scroll
    </motion.div>
  );
}
```

### `useScrollOpacity()`
```javascript
import { useScrollOpacity } from "../hooks/useParallax";

function MyComponent() {
  const { ref, opacity, y } = useScrollOpacity(100);
  
  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      Fades and slides up as you scroll
    </motion.div>
  );
}
```

### `useImageReveal()`
```javascript
import { useImageReveal } from "../hooks/useParallax";

function MyComponent() {
  const { ref, scale, opacity } = useImageReveal([0.9, 1]);
  
  return (
    <motion.img ref={ref} style={{ scale, opacity }} src="..." />
  );
}
```

---

## Customization Options

### Adjust Parallax Intensity
In Me component:
```javascript
const glowY1 = useTransform(scrollY, (latest) => latest * 0.3); // 0.3 = intensity
```
Increase the multiplier for stronger effect, decrease for subtle.

### Adjust Modal Animations
In BrowserModal or animations.js:
```javascript
export const modalContentVariants = {
  visible: {
    transition: {
      damping: 25,    // Lower = bouncier, Higher = more stiff
      stiffness: 300, // Higher = faster spring
    },
  },
};
```

### Add More Animation Variants
Add to `frontend/src/utils/animations.js`:
```javascript
export const myCustomVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
```

Then use in components:
```javascript
<motion.div variants={myCustomVariant} initial="hidden" whileInView="visible">
  Content
</motion.div>
```

---

## Browser Support

✅ **Fully Supported:**
- Chrome/Chromium (v88+)
- Firefox (v78+)
- Safari (v14+)
- Edge (v88+)
- Mobile browsers (iOS Safari, Chrome Android)

**Note:** Some older projects may not work in iframe if they have X-Frame-Options DENY headers.

---

## Troubleshooting

### Modal won't close
- Make sure you're clicking outside the modal content or using ESC key
- Check DevTools console for errors

### Parallax feels jerky
- This shouldn't happen with Lenis smooth scroll installed
- Check that Lenis is properly initialized in Home.jsx
- Verify hardware acceleration is enabled in DevTools

### Projects won't load in preview
- Project must have a live URL (check assets.js worksData)
- Project may have X-Frame-Options header blocking iframes
- Try opening in new tab instead to confirm the URL works

### Animation stutters on mobile
- Reduce parallax intensity (lower useTransform multipliers)
- Disable parallax on very small devices if needed
- Check for background processes consuming mobile CPU

---

## Next Steps

To further enhance your portfolio:

1. **Add more projects** to works section (update assets.js)
2. **Customize colors** - Edit `tailwind.config.js` color palette
3. **Add more parallax** - Use the useParallax hooks in new components
4. **Customize animations** - Edit animation variants in utils/animations.js
5. **Add more sections** - Create new components with parallax hooks
6. **Deploy** - Build with `npm run build` and deploy to Vercel/GitHub Pages

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/hooks/useParallax.js` | Parallax animation hooks |
| `src/components/BrowserModal.jsx` | Project preview modal |
| `src/components/Hero.jsx` | Landing section |
| `src/components/Me.jsx` | About section with parallax |
| `src/components/Works.jsx` | Projects with preview modal |
| `src/components/Skills.jsx` | Skills carousel with parallax |
| `src/utils/animations.js` | Reusable animation variants |
| `src/pages/Home.jsx` | Main page with Lenis setup |

---

## Support

If you encounter issues:
1. Check console for error messages
2. Verify all imports are correct
3. Check that dependencies are installed (`npm install`)
4. Ensure Lenis is running smoothly
5. Test on different browsers

