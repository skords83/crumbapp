# 🍞 Crumb Branding Guide

## Brand Identity

### Name
**Crumb** (pronounced: /krʌm/)

### Tagline
**"Perfect Bread, Perfect Timing"**

### Brand Essence
Crumb represents the intersection of traditional bread-making craftsmanship and modern time management. The name "Crumb" refers to the interior texture of bread - the ultimate indicator of quality in artisan baking.

---

## Logo

### Primary Logo
- **File:** `/public/icons/logo.svg`
- **Style:** Hand-drawn sketch of a half-cut sourdough loaf
- **View:** Side perspective showing crust and crumb structure
- **Details:** Medium detail level with visible air pockets

### Logo Usage
- **Minimum Size:** 16×16px (favicon)
- **Optimal Sizes:** 48px, 64px, 128px, 192px, 512px
- **Clear Space:** Minimum 10px around logo
- **Background:** Works on light, dark, and colored backgrounds

### Logo Variations
1. **Full Color** - Default for all uses
2. **Monochrome** - For single-color applications
3. **Inverted** - White on dark backgrounds (header)

---

## Color Palettes

### Theme 1: Natural & Organic (Default)
```
Primary:    #8B7355  (Burlywood Dark)
Secondary:  #F5F5DC  (Bisque)
Accent:     #FFD700  (Gold)
Background: #FAF0E6  (Linen)
```
**Use Case:** Default theme, warm and inviting

### Theme 2: Modern & Fresh
```
Primary:    #1E40AF  (Blue 700)
Secondary:  #F97316  (Orange 500)
Accent:     #10B981  (Emerald 500)
Background: #F9FAFB  (Gray 50)
```
**Use Case:** Tech-savvy users, modern aesthetic

### Theme 3: Premium Minimal
```
Primary:    #1F2937  (Gray 800)
Secondary:  #D4AF37  (Metallic Gold)
Accent:     #DC2626  (Red 600)
Background: #FAFAF9  (Stone 50)
```
**Use Case:** Professional bakers, premium feel

---

## Typography

### Primary Font
```
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'
```

### Hierarchy
- **H1:** 2rem (32px) - Bold - Brown Primary
- **H2:** 1.5rem (24px) - Semi-Bold - Brown Primary
- **H3:** 1.25rem (20px) - Semi-Bold - Brown Primary
- **Body:** 1rem (16px) - Regular - Text Primary
- **Small:** 0.875rem (14px) - Regular - Text Secondary

---

## Icon System

### App Icons
- **Favicon:** 16×16, 32×32, 48×48
- **Apple Touch Icon:** 180×180
- **PWA Icons:** 192×192, 512×512
- **Social Media:** 1200×630 (og:image)

### File Locations
```
/public/icons/
├── logo.svg           # Main logo (SVG)
├── favicon.ico        # Browser favicon
├── icon-192.png       # PWA manifest
├── icon-512.png       # PWA manifest
└── social-preview.png # Open Graph image
```

---

## Voice & Tone

### Brand Personality
- **Warm & Welcoming:** Like a traditional bakery
- **Professional:** Reliable and precise
- **Helpful:** Empowering users to succeed
- **Authentic:** Honest about bread-making realities

### Writing Guidelines
- Use **active voice**
- Keep sentences **concise and clear**
- **Encourage** rather than command
- Use bread-making **terminology appropriately**
- Avoid **jargon** unless necessary

### Example Phrases
✅ "Your bread is ready to bake!"
✅ "Perfect timing for the next step"
✅ "Let's plan your baking schedule"
❌ "Execute fermentation protocol"
❌ "Initiate thermal processing"

---

## UI Patterns

### Material Design Principles
- **Elevation:** 4 levels (0dp, 2dp, 4dp, 8dp)
- **Transitions:** cubic-bezier(0.4, 0, 0.2, 1)
- **Duration:** 200-300ms
- **Spacing:** 8px grid system

### Button Styles
```css
Primary:   Brown Primary background, white text, 8px radius
Secondary: White background, Brown Primary border/text
Tertiary:  Transparent background, Brown Primary text
```

### Card Design
```css
Background: BG Secondary
Border Radius: 12px
Shadow: 0 2px 8px rgba(0,0,0,0.1)
Padding: 1.5-2rem
```

---

## Application Contexts

### Web App
- **URL Pattern:** `crumb.app` or `*.crumb.app`
- **Theme Color:** #8B7355 (Natural) or user-selected
- **Display Mode:** Standalone PWA

### Mobile (PWA)
- **Install Prompt:** "Add Crumb to your home screen for quick access"
- **Splash Screen:** Logo on theme background
- **Orientation:** Portrait-primary

---

## Docker/GitHub

### GitHub Container Registry
```
Image Names:
- ghcr.io/crumbapp/crumb-frontend:latest
- ghcr.io/crumbapp/crumb-backend:latest

Package Names:
- @crumbapp/web
- @crumbapp/backend
```

### Container Labels
```
org.opencontainers.image.title=Crumb
org.opencontainers.image.description=Perfect Bread, Perfect Timing
org.opencontainers.image.vendor=Crumb App
```

---

## Social Media

### Handles (suggested)
- Twitter/X: `@crumbapp`
- Instagram: `@crumb.app`
- GitHub: `crumbapp`

### Profile Images
- Use logo on Natural theme background
- Minimum 400×400px for clarity

### Cover Images
- Feature bread photography with logo
- Include tagline: "Perfect Bread, Perfect Timing"

---

## File Naming Conventions

### Code
```
Components: PascalCase (RecipeList.js)
Functions: camelCase (calculateTime.js)
Constants: UPPER_SNAKE_CASE (API_URL)
CSS Files: kebab-case or match component (RecipeList.css)
```

### Assets
```
Icons: icon-{size}.png (icon-192.png)
Logos: logo.svg, logo-{variant}.svg
Images: {description}-{size}.{ext}
```

---

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast:** Minimum 4.5:1 for text
- **Focus Indicators:** Visible on all interactive elements
- **Alt Text:** Required for all images
- **Keyboard Navigation:** Full support

### ARIA Labels
```html
<button aria-label="Add to favorites">
<nav aria-label="Main navigation">
<img alt="Crumb logo" src="...">
```

---

## Brand Assets Checklist

✅ Logo (SVG, PNG in multiple sizes)
✅ Favicon (ICO, PNG)
✅ PWA Icons (192, 512)
✅ Social Media Preview Image
✅ Color Palette (3 themes)
✅ Typography Guidelines
✅ UI Component Library
✅ Docker Images (GHCR)
✅ GitHub Repository
✅ Documentation

---

## Quick Reference

**Primary Color (Natural):** `#8B7355`
**Logo Path:** `/public/icons/logo.svg`
**Tagline:** "Perfect Bread, Perfect Timing"
**Package:** `@crumbapp/web`
**Docker:** `ghcr.io/crumbapp/crumb-frontend:latest`

---

**Brand Version:** 1.0  
**Last Updated:** February 2026  
**Maintained by:** Crumb Development Team
