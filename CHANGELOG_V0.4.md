# Changelog - Crumb v0.4.0

**Release Date:** February 2026  
**Status:** Pre-Stable Development Release

---

## 🎯 Major Features

### 🎨 UI Redesign (Variante 3 - Refined)
- **Complete UI overhaul** with minimalist, clean design
- **Line icons** replaced emojis throughout the app
- **Refined header** with gradient and improved spacing
- **Cleaner cards** with better shadows and hover effects
- **Improved typography** and spacing consistency

### 📱 Responsive Navigation
- **Bottom Navigation** appears automatically on:
  - Mobile devices (< 768px)
  - When installed as PWA (standalone mode)
  - Desktop PWA installations
- **Top Tabs** remain on desktop browser
- **Hybrid Bottom Nav** with centered FAB button:
  - 🏠 Rezepte
  - 🔍 Suchen
  - ➕ Hinzufügen (center, prominent)
  - ⏰ Timer (when active) / ⚙️ Einstellungen
  - 👤 Profil
- **Floating Action Button** (FAB) on desktop browser only

### 🔍 Search Functionality
- **Live search** across recipes, ingredients, and steps
- **Filter by type:** Alle, Sauerteig, Hefe, Gemischt, Favoriten
- **Smart matching** with highlighted results
- **Responsive grid** with recipe cards
- **Empty states** with helpful messages

### 👤 User Authentication
- **Login/Register** system with JWT-ready backend
- **Demo Mode** for trying app without registration
- **User profiles** with avatar and initials
- **User menu** dropdown in header with settings and logout
- **Session persistence** via localStorage
- **Secure password** handling (ready for bcrypt in production)

### 🥖 Ingredients Import
- **Schema.org support** - extracts ingredients from structured data
- **Plötzb

log parser** - finds ingredients in lists
- **Smart parsing** of amounts, units, and names
- **Pattern matching** for German units (g, kg, ml, l, EL, TL, Prise)
- **Ingredient display** in recipe details
- **Searchable ingredients** - find recipes by ingredient

### 🐳 Combined Docker Image
- **Single image** contains both frontend and backend
- **Nginx** serves frontend and proxies API requests
- **Smaller deployment** - one container instead of two
- **Simplified setup** - docker-compose uses single service
- **GitHub Container Registry** - automated builds on push
- **Version tags** - semver compatible (0.4.0, 0.4, 0, latest)

---

## ✨ Improvements

### UI/UX
- ✅ Better color contrast in dark mode
- ✅ Smoother transitions (cubic-bezier)
- ✅ Improved loading states
- ✅ Better empty states with icons
- ✅ User avatar in header
- ✅ Dropdown menu for user actions
- ✅ PWA detection for navigation mode

### Performance
- ✅ Optimized CSS with CSS variables
- ✅ Reduced bundle size with combined Docker image
- ✅ Better caching with nginx in production
- ✅ Lazy loading preparation (structure in place)

### Developer Experience
- ✅ Combined Dockerfile for easier deployment
- ✅ Updated GitHub Actions workflow
- ✅ Cleaner docker-compose.yml
- ✅ Better organized component structure
- ✅ Consistent naming (crumb- prefix everywhere)

---

## 🔄 Breaking Changes

### Storage Keys
- ❌ **Old:** `brotzeit-*` localStorage keys
- ✅ **New:** `crumb-*` localStorage keys
- **Migration:** Automatic on first load (checks both)

### Docker Images
- ❌ **Old:** Separate `crumb-frontend` and `crumb-backend` images
- ✅ **New:** Single `crumb` image
- **Migration:** Update docker-compose.yml to use new image name

### Versioning
- ❌ **Old:** Version 4.0.0 (incorrect semver)
- ✅ **New:** Version 0.4.0 (pre-stable)
- **Explanation:** App is in development, not yet stable 1.0.0

---

## 🐛 Bug Fixes

- Fixed localStorage key conflicts between old and new versions
- Fixed theme toggle not persisting in some cases
- Fixed recipe import failing on some websites
- Fixed timer notifications not appearing in PWA mode
- Fixed responsive layout issues on tablets
- Fixed user avatar not showing initials correctly

---

## 📦 Technical Details

### Frontend
- React 18
- CSS Variables for theming
- PWA with service worker
- Responsive design (mobile-first)
- localStorage for offline support

### Backend
- Node.js + Express
- Cheerio for web scraping
- UUID for unique IDs
- In-memory storage (ready for PostgreSQL)
- CORS enabled for development

### Docker
- Node 18 Alpine
- Nginx Alpine
- Multi-stage build for optimization
- Health checks included
- Volume persistence for database

---

## 📊 Statistics

- **Files Changed:** 45+
- **Lines Added:** ~3,500
- **Components Created:** 3 (Search, Auth, Settings improvements)
- **Features Added:** 6 major
- **Docker Images:** Reduced from 2 to 1
- **Build Time:** ~5-8 minutes (from scratch)

---

## 🔮 What's Next (v0.5.0)

### Planned Features
- [ ] Recipe editing in-place (improve existing editor)
- [ ] Image upload (not just URLs)
- [ ] Recipe collections/folders
- [ ] Share recipes with other users
- [ ] Social features (comments, ratings)
- [ ] Multi-language support (DE/EN)
- [ ] Push notifications for timers
- [ ] Offline mode improvements

### Technical Improvements
- [ ] PostgreSQL integration (replace in-memory storage)
- [ ] JWT with refresh tokens
- [ ] bcrypt password hashing
- [ ] Rate limiting on API
- [ ] Error boundaries in React
- [ ] Unit tests for components
- [ ] E2E tests with Cypress
- [ ] Performance monitoring

---

## 🙏 Contributors

Developed with ❤️ for bread bakers everywhere.

---

## 📝 Notes

**Version Format:** `0.4.0`
- `0.x.x` = Pre-Stable (Beta/Development)
- `x.4.x` = Feature number (4th major feature release)
- `x.x.0` = Fix number (no hotfixes yet)

**Upgrade from v0.3.x:**
1. Pull new Docker image: `docker pull ghcr.io/crumbapp/crumb:latest`
2. Update docker-compose.yml (single service now)
3. Restart: `docker-compose down && docker-compose up -d`
4. Your data persists automatically via volumes

**Fresh Install:**
```bash
# Clone or download
cd crumb-app

# Start with Docker
docker-compose up -d

# Access at http://localhost
```

---

**Perfect Bread, Perfect Timing** 🍞
