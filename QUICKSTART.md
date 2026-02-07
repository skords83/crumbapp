# ⚡ BrotZeit Quick Start

## 🚀 In 5 Minuten loslegen

### Option A: Nur Frontend (ohne Backend Features)

```bash
# 1. Projekt öffnen
cd brotzeit-app

# 2. Dependencies installieren
npm install

# 3. Starten
npm start
```

✅ App läuft auf `http://localhost:3000`

**Verfügbare Features:**
- ✅ Rezepte erstellen, bearbeiten, löschen
- ✅ Favoriten
- ✅ Filter
- ✅ Dark Mode
- ✅ Zeitplanung & Timer
- ✅ Bäckerprozent-Rechner
- ❌ URL-Import (braucht Backend)
- ❌ Rezept-Sharing (braucht Backend)

---

### Option B: Full Stack (Frontend + Backend)

**Terminal 1 - Backend:**
```bash
cd brotzeit-app/backend
npm install
npm start
```
Backend läuft auf Port 3001 ✅

**Terminal 2 - Frontend:**
```bash
cd brotzeit-app
npm install
npm start
```
Frontend läuft auf Port 3000 ✅

**Alle Features verfügbar!** 🎉

---

### Option C: Docker (Produktion)

```bash
cd brotzeit-app
docker-compose up -d
```

✅ Frontend: `http://localhost`  
✅ Backend: `http://localhost:3001`

---

## 🎯 Features testen

### 1. Dark Mode
- Klick auf 🌙/☀️ Button oben rechts
- Theme wird automatisch gespeichert

### 2. Rezept manuell erstellen
- Tab "Import" → "Manuell erstellen"
- Name eingeben, Schritte hinzufügen
- Optional: Bild-URL und Rezepttyp

### 3. URL-Import (Backend erforderlich)
- Backend muss laufen!
- Tab "Import" → URL eingeben
- Funktioniert mit Plötzblog & anderen

Beispiel-URLs zum Testen:
- `https://www.ploetzblog.de/...` (beliebiger Artikel)
- Sites mit Schema.org Recipe Markup

### 4. Bäckerprozent-Rechner
- Tab "🧮 Rechner"
- Zutaten eingeben
- Automatische Prozent-Berechnung
- Skalieren auf beliebige Größe

### 5. Filter nutzen
- Tab "Rezepte"
- Filter-Panel über Rezeptliste
- Kombiniere mehrere Filter

### 6. Zeitplanung
- Rezept auswählen → "Backzeit planen"
- Zielzeit eingeben (wann soll Brot fertig sein)
- App berechnet Startzeit rückwärts
- Optional: "Keine Aktionen nachts" aktivieren

---

## 🔧 Entwicklung

### Hot Reload
Beide (Frontend & Backend) haben Hot Reload:
- Datei ändern → automatischer Refresh

### API Testen
```bash
# Health Check
curl http://localhost:3001/health

# URL parsen
curl -X POST http://localhost:3001/api/parse \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.ploetzblog.de/..."}'
```

### Browser DevTools
- React DevTools Extension empfohlen
- Console für Fehler prüfen
- Network Tab für API Calls

---

## 🐛 Häufige Probleme

### "Backend not reachable"
**Lösung:** Backend starten!
```bash
cd backend
npm start
```

### Port 3000 bereits belegt
**Lösung:** Anderen Port nutzen
```bash
PORT=3001 npm start
```

### "Module not found"
**Lösung:** Dependencies neu installieren
```bash
rm -rf node_modules
npm install
```

### Docker Container startet nicht
**Lösung:** Logs prüfen
```bash
docker-compose logs -f
```

---

## 📁 Projekt-Struktur (wichtigste Dateien)

```
brotzeit-app/
├── src/
│   ├── App.js                    # Haupt-App
│   ├── ThemeContext.js           # Dark Mode
│   └── components/
│       ├── RecipeImporter.js     # Import & Erstellen
│       ├── RecipeList.js         # Liste mit Filtern
│       ├── RecipeDetail.js       # Detailansicht
│       ├── BakingScheduler.js    # Zeitplanung
│       ├── TimerManager.js       # Live-Timer
│       ├── BakersPercentage.js   # Rechner (NEU)
│       └── RecipeFilter.js       # Filter
├── backend/
│   ├── server.js                 # Express API (NEU)
│   └── package.json
├── docker-compose.yml            # Docker Setup (NEU)
└── package.json
```

---

## 🎓 Nächste Schritte

1. **Dokumentation lesen:**
   - [README.md](./README.md) - Vollständige Feature-Liste
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Server-Deployment
   - [CHANGELOG_V3.md](./CHANGELOG_V3.md) - Alle neuen Features

2. **Code anpassen:**
   - Farben in `App.css` (CSS Variables)
   - Parser für neue Webseiten in `backend/server.js`
   - UI-Komponenten erweitern

3. **Deployen:**
   - Docker Compose für schnelles Deployment
   - Siehe DEPLOYMENT.md für Cloud-Optionen

---

## 💡 Tipps

- **Dark Mode Default:** Ändere in `ThemeContext.js`
- **API URL:** Setze `REACT_APP_API_URL` in `.env`
- **Port ändern:** Backend Port in `backend/server.js`
- **Mock Data:** In `RecipeImporter.js` Demo-Rezept anpassen

---

## 📞 Support

- **Issues:** GitHub Issues erstellen
- **Fragen:** Siehe Dokumentation
- **Contributions:** Pull Requests willkommen!

---

**Viel Erfolg! 🍞**
