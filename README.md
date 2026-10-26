# The Baltimore Chop™ ⚾
### Cross-Platform Baseball Card Battler, 26-Man Franchise GM Engine & Hobby Collect Slab Vault

[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 🌟 Game & Platform Overview

**The Baltimore Chop™** is a fast-paced, tactile baseball card battler and franchise management simulation. Built with a high-end **iOS liquid glass** design system, authentic **metallic foil refractors**, **MLB Statcast game-tracker graphics**, and procedural **Web Audio API** ballpark synthesizers, it delivers a nostalgic yet modern baseball experience.

---

## 🚀 Key Feature Highlights

### 1. 🏟️ At-Bat Showdown Arena
* **Counter-Pitch Strategy**: Guess pitch type (4-Seam, Slider, Sinker, Changeup, Curveball) and strike zone (3x3 grid).
* **The Baltimore Chop Mechanics**: Targeting low sinkers in the bottom zone triggers a towering 35-foot bounce over the infielder's head for high-percentage infield singles.
* **Scouting Hints**: Dynamic scouting insights based on your current consecutive hit streak.

### 2. 📺 Memorial Stadium Jumbotron 1983 (Retro 8-Bit Broadcast)
* **CRT Scanline Visuals**: Authentic phosphor glow (Amber, Green, Cyan) with dot-matrix LED effects.
* **Pixel Animations**: Custom 8-bit scenes for Baltimore Chops, Home Run moonshots, Double laser ropes, and Strikeout ꓘ's.
* **Customizable Stadium Marquee Ticker**:
  * **Speed Controls**: Slower (45s), Normal (32s), Fast (20s), or fine-tune from 16s to 60s.
  * **Hover to Freeze**: Hovering or touching freezes the ticker text for easy reading.
  * **Announcement Feeds**: Official Rules, Strategy Tips, Orioles Legends, or **Custom Text** where you type your own live stadium cheers.

### 3. 🎴 3D Liquid Glass Card Slabs (Hobby Collect Engine)
* **3D Tactile Gyro & Mouse Tilt**: Cards dynamically rotate in 3D space with specular liquid glass reflections and an **ambient orange gradient backlighting aura**.
* **Mini Baseball Field Game Tracker**: Replaces standard avatar icons with an authentic MLB Statcast infield diamond featuring an **illuminated radar position pin** (`SS 6`, `P 1`, `1B 3`, `CF 8`, etc.).
* **Authentic Blue Ballpoint Pen Signature**: High-fidelity `#183cba` royal blue ink with ink-bleed shadow, certified as either a **`Chop™ Certified On-Card Autograph`** or a holographic **`Chop™ Certified Issue Autograph`** sticker.
* **Apple Music Lossless-Style bRef WAR Badge**: Compact `bRef WAR 95.9 ▸` pill badge that opens an interactive popover detailing Baseball-Reference WAR, OPS+, wRC+, DRS, and skill percentile bars.
* **5-Tier Refractor Forge**: Base, Atomic Mojo, Sapphire, Gold Wave, and 1-of-1 Superfractor.

### 4. 📋 26-Man Depth Chart (StickToTheModel-Style Board)
* Complete 26-man roster matrix spanning Infielders, Outfielders, Starting Pitchers, and Relievers.
* Detailed sabermetrics, era tags (1970 Gold Glove, 1983 World Series, 1996 All-Star, 2024 Modern), and equipment buffs.

### 5. 🥫 Equipment Vending & Refractor Forge
* **Task-Based Dispenser**: Complete challenges (hitting chops, strikeouts, home runs) to earn Vending Tokens.
* **Equipment Buffs**: Equip vintage bats, gloves, pine tar, and ballpark coffee to boost contact, power, and chop bounce.

### 6. 🔥 5-in-7 Days Login Streak
* Rolling 7-day calendar check-in tracker stored in `localStorage`.
* Logging in 5 days within any 7-day window unlocks the **Milestone Bundle**:
  * **+1,500 Franchise Points**
  * **+5 Vending Machine Tokens**
  * **Free Foil Pack Rip**

### 7. 👤 Google & Apple Cloud Auth & Username Quotas
* **Identity Linking**: One-click sign-in and account linking with **Google** or **Apple ID** via Firebase Authentication.
* **Username Rate Limiting**:
  * **1x Monthly Cooldown**: Usernames can only be changed once every 30 days.
  * **5x Annual Cap**: Maximum of 5 changes per calendar year.
  * **Paid Tier Notice**: Changes beyond free limits require a Paid Name Pass (pricing tier coming soon).

### 8. 🔒 Covert Operations Command (GM Console)
* **Secure Access**: Protected by 6-digit administrator code (`892308`), with completely masked UI.
* **Covert Triggers**:
  * Keyboard shortcut: `Ctrl + Shift + O` (or `Cmd + Shift + O` on Mac)
  * URL hash: Append `#ops` to your domain
  * Footer trigger: Tap the tiny lock icon (`🔒`) in the footer
* **Diagnostics & Overrides**: Live crash report inspector, user session analytics, instant currency adjustments (+/- Points & Tokens), and custom 1-of-1 card minting.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS 3D Transforms |
| **Backend & Auth** | [Firebase](https://firebase.google.com/) (Firestore & Auth for Google/Apple) |
| **Audio Engine** | Procedural Web Audio API (Synthesizers for bat cracks, organ, & 8-bit chiptunes) |
| **PWA** | Service Workers + Web App Manifest for offline & standalone install |

---

## 📦 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* `npm` or `pnpm`

### Installation
```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/baltimore-chop.git
cd baltimore-chop

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
```
Build output will be generated in the `dist/` directory.

### Running Unit Tests
```bash
npm test # or: npx tsx --test src/game/*.test.ts
```

---

## 🌐 Deploying to Cloudflare Pages (Recommended & 100% Free)

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Compute (Workers & Pages)** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository.
4. Set build settings:
   * **Framework preset**: `Vite`
   * **Build command**: `npm run build`
   * **Build output directory**: `dist`
5. Click **Save and Deploy**. Your site will be live with free global CDN and SSL in under 60 seconds!

---

## 📄 License
Apache-2.0 License. Built for baseball collectors and enthusiasts.
