# 🚀 BrotZeit Deployment Guide

## Deployment-Optionen

### Option 1: Docker Compose (Empfohlen)

Die einfachste Methode für Full-Stack Deployment.

#### Voraussetzungen
- Docker & Docker Compose installiert
- Port 80 (Frontend) und 3001 (Backend) verfügbar

#### Schritte

1. **Projekt klonen/hochladen:**
```bash
# Upload komplettes Projekt auf Server
scp -r brotzeit-app user@server:/path/to/
ssh user@server
cd /path/to/brotzeit-app
```

2. **Environment-Variablen (optional):**
```bash
# .env Datei erstellen
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3001
PORT=3001
NODE_ENV=production
EOF
```

3. **Starten:**
```bash
docker-compose up -d
```

4. **Status prüfen:**
```bash
docker-compose ps
docker-compose logs -f
```

5. **Zugriff:**
- Frontend: `http://your-server:80`
- Backend API: `http://your-server:3001`

#### Verwaltung

```bash
# Stoppen
docker-compose down

# Neustart
docker-compose restart

# Logs anzeigen
docker-compose logs -f frontend
docker-compose logs -f backend

# Updates deployen
git pull  # oder neue Version hochladen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Option 2: Einzelne Docker Container

#### Frontend deployen

```bash
# Build
cd brotzeit-app
docker build -t brotzeit-frontend .

# Run
docker run -d \
  --name brotzeit-frontend \
  -p 80:80 \
  -e REACT_APP_API_URL=http://your-backend:3001 \
  brotzeit-frontend
```

#### Backend deployen

```bash
# Build
cd backend
docker build -t brotzeit-backend .

# Run
docker run -d \
  --name brotzeit-backend \
  -p 3001:3001 \
  -e PORT=3001 \
  -e NODE_ENV=production \
  brotzeit-backend
```

---

### Option 3: Traditionelles Hosting (ohne Docker)

#### Frontend (Static Hosting)

```bash
# Build erstellen
npm install
npm run build

# Resultat in 'build/' Ordner kann auf jedem Webserver gehostet werden:
# - Nginx
# - Apache
# - Netlify
# - Vercel
# - GitHub Pages
```

**Nginx Beispiel-Konfiguration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/brotzeit/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Backend (Node.js Hosting)

```bash
cd backend
npm install --production
node server.js

# Oder mit PM2 (empfohlen):
npm install -g pm2
pm2 start server.js --name brotzeit-backend
pm2 save
pm2 startup
```

---

## Cloud Platform Deployment

### Heroku

```bash
# Frontend
heroku create brotzeit-app
git push heroku main

# Backend
cd backend
heroku create brotzeit-api
git push heroku main
```

### DigitalOcean App Platform

1. Repository verbinden
2. App erstellen (Node.js für Backend, Static für Frontend)
3. Environment Variables setzen
4. Deploy

### AWS

#### Frontend (S3 + CloudFront)
- Build hochladen zu S3 Bucket
- Static Website Hosting aktivieren
- CloudFront Distribution erstellen

#### Backend (Elastic Beanstalk / ECS)
- Docker Container deployen
- Load Balancer konfigurieren
- Auto-Scaling einrichten

---

## Reverse Proxy Setup (Nginx)

Für Single-Domain mit /api Routing:

```nginx
server {
    listen 80;
    server_name brotzeit.example.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL/HTTPS mit Let's Encrypt

```bash
# Certbot installieren
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Zertifikat erstellen
sudo certbot --nginx -d brotzeit.example.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### Docker Logs
```bash
# Alle Logs
docker-compose logs -f

# Nur Frontend
docker-compose logs -f frontend

# Nur Backend
docker-compose logs -f backend

# Letzten 100 Zeilen
docker-compose logs --tail=100
```

### Health Checks
```bash
# Backend Health Check
curl http://localhost:3001/health

# Erwartete Antwort:
# {"status":"ok","timestamp":"2024-02-06T..."}
```

---

## Performance-Optimierung

### Frontend
- Aktiviere Gzip (bereits in nginx.conf)
- CDN für static assets
- Service Worker für offline-Nutzung (bereits implementiert)

### Backend
- Redis für Caching (optional)
- Database statt In-Memory Storage für Shared Recipes
- Rate Limiting für API

---

## Troubleshooting

### Frontend startet nicht
```bash
# Check logs
docker logs brotzeit-frontend

# Häufige Probleme:
# - Port 80 bereits belegt → anderer Port: -p 8080:80
# - Build-Fehler → cache clearen: docker-compose build --no-cache
```

### Backend nicht erreichbar
```bash
# Check logs
docker logs brotzeit-backend

# Test direkt
curl http://localhost:3001/health

# Häufige Probleme:
# - Firewall blockiert Port 3001
# - CORS Fehler → Backend CORS Config prüfen
```

### Container stoppt sofort
```bash
# Detaillierte Logs
docker logs brotzeit-backend --tail 50

# Container im interaktiven Modus starten
docker run -it --rm brotzeit-backend sh
```

---

## Backup & Recovery

### Daten sichern
```bash
# Recipe data Volume sichern
docker run --rm \
  -v brotzeit-app_recipe-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/recipes-backup.tar.gz -C /data .
```

### Daten wiederherstellen
```bash
docker run --rm \
  -v brotzeit-app_recipe-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/recipes-backup.tar.gz -C /data
```

---

## Security Checklist

- [ ] HTTPS aktiviert (Let's Encrypt)
- [ ] Firewall konfiguriert (nur 80, 443 offen)
- [ ] Environment Variables für Secrets
- [ ] Rate Limiting implementiert
- [ ] Regelmäßige Updates (docker-compose pull)
- [ ] Backups automatisiert

---

## Produktions-Checkliste

### Vor dem Go-Live

- [ ] Domain DNS konfiguriert
- [ ] SSL Zertifikat installiert
- [ ] Environment Variables gesetzt
- [ ] Monitoring eingerichtet
- [ ] Backups konfiguriert
- [ ] Load Testing durchgeführt
- [ ] Error Tracking (z.B. Sentry)
- [ ] Analytics (optional, z.B. Plausible)

### Nach dem Go-Live

- [ ] Health Checks überwachen
- [ ] Logs regelmäßig prüfen
- [ ] Performance Monitoring
- [ ] User Feedback sammeln
- [ ] Regelmäßige Backups verifizieren

---

## Support & Weitere Hilfe

- **Docker Dokumentation:** https://docs.docker.com
- **Nginx Guide:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/getting-started/
