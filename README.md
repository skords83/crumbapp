# 🍞 Crumb

**Perfect Bread, Perfect Timing**

A comprehensive bread baking companion app for planning, scheduling, and executing perfect bakes.

[![Version](https://img.shields.io/badge/version-0.4.4-blue)](https://github.com/skords83/crumbapp)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://docker.com)

---

## ✨ Features

### 🥖 Recipe Management
* Import recipes from German baking websites (Plötzblog, Homebaking)
* Automatic ingredient extraction
* Manual recipe creation
* Search across recipes, ingredients, and steps
* Image support & favorites

### ⏱️ Smart Time Planning
* **Backward scheduling:** Set finish time, app calculates start
* Timeline visualization
* Nighttime conflict detection (22:00-6:00)
* Live timers with notifications

### 📊 Baker's Percentage Calculator
* Convert recipes to baker's percentages
* Scale recipes to any size

### 👤 User System
* Login & Registration
* Demo mode
* User profiles with avatars

### 🎨 Customizable Themes
* 3 Color themes (Natural, Modern, Premium)
* Dark mode support
* Responsive design (Desktop & Mobile)

---

## 🚀 Quick Start

### Docker (Recommended)

```bash
# Using docker-compose
docker-compose up -d

# Or pull image directly
docker pull ghcr.io/skords83/crumbapp:latest
docker run -d -p 9083:80 \
  -e DB_HOST=your-postgres-host \
  -e DB_PASSWORD=your-password \
  ghcr.io/skords83/crumbapp:latest
```

Access: `http://localhost:9083`

### Local Development

```bash
# Frontend
npm install
npm start

# Backend (separate terminal)
cd backend
npm install
npm start
```

**Requirements:**
* Node.js 20+
* PostgreSQL 15+ (for persistence)

---

## 📦 Deployment

### With PostgreSQL

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: crumb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your-password
    volumes:
      - ./data/db:/var/lib/postgresql/data

  app:
    image: ghcr.io/skords83/crumbapp:latest
    ports:
      - "9083:80"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: crumb
      DB_USER: postgres
      DB_PASSWORD: your-password
    depends_on:
      - db
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

---

## 🛠️ Tech Stack

**Frontend:** React 18, CSS Variables, date-fns, PWA  
**Backend:** Node.js, Express, PostgreSQL, Cheerio  
**DevOps:** Docker, GitHub Actions, Nginx

---

## 📚 Documentation

* [🚀 Quick Start Guide](QUICKSTART.md)
* [🐳 Deployment Guide](DEPLOYMENT.md)
* [🎨 Branding Guide](BRANDING.md)
* [📝 Changelog](CHANGELOG_V0.4.md)

---

## 🎯 Roadmap

**v0.5.0:**
* Recipe editing
* Image upload
* Collections

**Future:**
* Community sharing
* Mobile apps
* AI suggestions
* Multi-language

---

## 🤝 Contributing

Contributions welcome! Fork, create feature branch, submit PR.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

**Perfect Bread, Perfect Timing** 🍞
