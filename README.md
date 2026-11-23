# A Journey For Annisa ✨

A romantic 3D cinematic birthday website created with love for **Annisa Nur Fadilah**.

An interactive experience with six connected scenes, 3D models, particle effects, and smooth scroll-based animations — designed to feel like a personal romantic short film.

## 🎂 Features

- **6 Cinematic Scenes**: Intro → Sakura Garden → Memories → Love Letter → Birthday → Ending
- **Real 3D Models**: Cherry blossom trees, birthday cake, gift boxes, envelope
- **Particle Effects**: Stars, sakura petals, fireflies, confetti
- **Smooth Scroll Navigation**: GSAP ScrollTrigger + Lenis
- **Interactive Elements**: Clickable polaroids, openable envelope, birthday wish button
- **Music Player**: Floating player with play/pause/volume controls
- **Responsive**: Desktop, tablet, and mobile
- **Configurable**: All messages editable from one config file

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite 8
- Three.js + React Three Fiber + Drei
- Tailwind CSS 4
- GSAP + Lenis (smooth scroll)
- Lucide React (icons)

## 📦 Installation

```bash
npm install
```

## 🎨 Download 3D Assets

Assets are included, but if you need to re-download:

```bash
npm run download:assets
```

## 🚀 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 👀 Preview Production Build

```bash
npm run preview
```

## ✏️ Customization

### Change Messages

Edit `src/data/websiteConfig.ts` to change:

- Recipient & creator names
- Love letter content
- Birthday messages
- Photo captions
- Final messages

### Add Personal Photos

Place photos in `public/assets/photos/`:

```
memory-01.jpg
memory-02.jpg
memory-03.jpg
memory-04.jpg
memory-05.jpg
```

If photos are missing, elegant gradient placeholders are shown.

### Add Music

Place MP3 files in `public/assets/music/`:

```
romantic-piano.mp3   (main background music)
```

Recommended source: [Pixabay Music](https://pixabay.com/music/) (free for personal use).

The music player only appears when audio files are present. Music never autoplays.

### Change Colors

Edit the `@theme` block in `src/index.css` to adjust the color palette.

## 🚀 Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Cloudflare Pages

Connect the repository on [Cloudflare Pages](https://pages.cloudflare.com/).

Build command: `npm run build`
Output directory: `dist`

## 📄 License

Personal project. 3D assets are CC0 licensed. See [ASSET_CREDITS.md](./ASSET_CREDITS.md) for details.

---

*Made with ❤️ by Rafi for Annisa*
