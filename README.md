# Smarak AR (स्मारक एआर) • Heritage & Culture of India

> **An immersive, mobile-first WebXR Augmented & Virtual Reality platform connecting humanity with the timeless monuments and sacred sculpted creatures of India.**

![Smarak AR Banner](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![WebXR](https://img.shields.io/badge/WebXR-AR%20%26%20VR-F59E0B?style=for-the-badge)

---

## 🌟 Vision & Motive

India’s cultural heritage faces the dual challenge of physical distance and environmental decay. Inspired by the [Smarak AR](https://smarak-ar.vercel.app/about) initiative, this platform brings the past back to life by:

1. **Connecting Users with Both Monuments AND Sacred Creatures**: Celebrating not only architectural marvels, but also the rich mythological beasts, divine vahanas, and celestial chimeras carved into stone (*Yali, Makara, Airavata, Garuda, Nandi, Sharaba, Mayura*).
2. **Dual-Mode AR Exploration**:
   - **Remote Mode**: Place 3D monuments and sacred beasts right onto your living room floor, classroom desk, or table with 360° rotation and scale gestures.
   - **On-Site Mode ("Physically Present")**: Stand in front of actual monuments with real camera feeds, compass radar bearing, and a **Time-Travel Cross-Fade Slider** to see fallen spires and ancient golden-era architecture reconstructed over modern stone relics.
3. **Mobile-First Experience**: Motion gyroscope look-around (`DeviceOrientation`), mobile sticky bottom navigation bar, haptic vibration feedback (`navigator.vibrate`), and instant QR code connectivity between desktop and phone.

---

## 🏛️ Monuments Featured

| Monument | Location | Era & Dynasty | Key Architectural Marvel |
| :--- | :--- | :--- | :--- |
| **Taj Mahal** | Agra, Uttar Pradesh | 1631–1648 CE (Mughal) | Bilateral symmetry, optical tilt minarets, Pietra Dura inlay |
| **Konark Sun Temple** | Puri, Odisha | 1250 CE (Eastern Ganga) | 24 astrolabe sundial wheels, 7 galloping horses, reconstructed 229ft tower |
| **Meenakshi Amman** | Madurai, Tamil Nadu | 1623 CE (Nayak) | 14 polychromatic gopurams, Thousand Pillar Hall, Yali guardians |
| **Kailasa Temple** | Ellora, Maharashtra | 756 CE (Rashtrakuta) | World's largest monolithic top-down basalt rock-cut excavation |
| **Hawa Mahal** | Jaipur, Rajasthan | 1799 CE (Rajput) | 953 honeycomb jharokhas cooling desert breezes via Venturi effect |
| **Hampi Stone Chariot** | Hampi, Karnataka | 1513 CE (Vijayanagara) | Monolithic granite Garuda chariot, axis-rotating wheels, musical pillars |
| **Qutub Minar** | Delhi | 1192 CE (Delhi Sultanate) | 72.5m brick minaret, muqarnas balconies, 1600-year rustless Iron Pillar |
| **Brihadisvara Temple**| Thanjavur, Tamil Nadu | 1010 CE (Chola) | 66m granite vimana crowned by an 80-tonne monolithic kumbam capstone |

---

## 🦁 Sacred Creatures (Virasat Bestiary)

- **Yali (Vyala)**: Composite predator (lion body, elephant trunk, boar tusks) guarding temple thresholds with free-rolling stone balls inside open fangs.
- **Makara**: Ancient sea-dragon chimera (crocodile jaws, peacock tail) vehicle of Ganga and Varuna, adorning temple water spouts and torana arches.
- **Airavata & Royal Gaja**: Celestial multi-tusked white elephant born of Samudra Manthan carrying the cosmic foundation plinths.
- **Garuda**: Golden-winged solar eagle vehicle of Vishnu, crowned atop chariot shrines and monolithic stambhas.
- **Nandi**: Monolithic sacred bull of Shiva, emblem of unwavering focus and eternal meditation.
- **Sharaba**: Eight-legged winged beast pacifying extreme cosmic energies.
- **Mayura**: Regal celestial peacock adorning Rajasthani palace gates and mosaic courtyards.

---

## ⚡ Core Features

- **Interactive 3D WebGL Sandbox**: Orbit around monuments with 4 time-of-day lighting presets (*Dawn Usha, Surya Noon, Golden Hour Sandhya Aarti, Moonlit Ratri*), wireframe X-Ray mode, and 3D projected hotspot pins.
- **Live Camera AR Mode**: Real-time camera feed with ground reticle, time-travel reconstruction crossfade slider, AI feature recognition reticle, and souvenir postcard snapshot capture.
- **360° Virtual Reality Photospheres**: Gyroscope-tracked phone look-around with teleportation markers between Aerial Skyline, Inner Sanctum (*Garbhagriha*), and Outer Courtyards.
- **Procedural Audio Synthesizer**: Authentic Indian Tanpura drone in Raag Bhairav and resonant bronze temple bell synthesis via browser Web Audio API.
- **Bilingual Voice Guide**: Spoken voiceover narration in English and Hindi (`hi-IN`) powered by Web Speech API.
- **Kala-Chakra Time Machine**: Century scrubbing slider visualizing architectural evolution across ages.
- **Smarak AR Digital Passport**: Collect discovery seals and earn ranks from *Yatri* to *Smarak Rakshak* with celebratory confetti bursts.
- **Pilgrimage Trip Planner**: Curated itineraries for the Golden Triangle, Southern Temple Trail, Deccan Rocks, and Kalinga Chariot circuits with cultural etiquette protocols.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/smarak-ar.git
cd smarak-ar

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### API authentication setup

The API uses server-side user accounts and JWTs. Browser sessions use an
`HttpOnly` cookie; native/API clients may still send a bearer token. Copy `server/.env.example` to
`server/.env`, set a random `JWT_SECRET` with at least 32 characters, then run
the server from the `server` directory. To create initial administrators, set
`ADMIN_SEED_USERS` to a JSON array of accounts before running the Prisma seed
command; passwords are hashed before storage and are never bundled into the
frontend.

Set `CORS_ORIGINS` to the exact frontend origin(s) used in deployment. The API
also throttles registration and login attempts; adjust the rate-limit settings
only when the deployment has an equivalent edge protection layer.

```bash
cd server
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

The backend exposes `GET /health/live` for process/liveness checks and
`GET /health/ready` for load balancer readiness checks (including a database
connectivity check). Configure deployments to route traffic only when the
readiness endpoint returns `200`; it returns `503` while the database is
unavailable. Requests are logged as structured JSON with a request ID, status,
and duration. See `server/.env.example` for body-limit, shutdown, and
production environment settings.

### Mobile Phone Testing
Run with network host enabled:
```bash
npm run dev -- --host
```
Open the provided local IP (e.g. `http://192.168.x.x:5173`) in your mobile browser, or click **"Open on Phone"** in the top navigation bar to scan the QR code with your phone camera!

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Glassmorphism
- **3D & WebGL**: Three.js (procedural parametric architecture & models)
- **WebXR / Mobile AR**: Google `<model-viewer>` + WebCam AR Overlay + Gyroscope Motion Tracking
- **Audio**: Web Audio API (procedural Tanpura & bell synth) + Web Speech API (bilingual narration)
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

---

## 📜 License
Open-source under the MIT License. Created with deep reverence for the timeless architectural and cultural heritage of India.
