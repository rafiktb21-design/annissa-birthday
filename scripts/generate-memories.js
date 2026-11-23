import fs from 'fs'

const memories = [
  {
    name: 'memory-01.svg',
    title: 'Under the Starlit Sky',
    date: 'Dec 11, 2024',
    bg1: '#0f0c29', bg2: '#302b63', bg3: '#24243e',
    accent: '#ff758c',
    icon: '✨',
    art: '<circle cx="300" cy="150" r="80" fill="#ffeedd" opacity="0.9" /><circle cx="300" cy="150" r="60" fill="#fff5eb"/><path d="M0,350 Q150,300 300,340 T600,320 L600,450 L0,450 Z" fill="#161329"/><circle cx="220" cy="180" r="2" fill="#fff"/><circle cx="380" cy="120" r="3" fill="#ffeedd"/><circle cx="140" cy="90" r="2.5" fill="#ffb7c5"/>'
  },
  {
    name: 'memory-02.svg',
    title: 'Spring Sakura Walk',
    date: 'April 2025',
    bg1: '#ff9a9e', bg2: '#fecfef', bg3: '#fecfef',
    accent: '#e84393',
    icon: '🌸',
    art: '<circle cx="450" cy="180" r="120" fill="#ffffff" opacity="0.7"/><path d="M50,450 C120,380 200,260 220,180 C240,100 280,60 300,50" stroke="#5d3a1a" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="260" cy="90" r="40" fill="#ff6b81" opacity="0.85"/><circle cx="320" cy="70" r="35" fill="#ff758c" opacity="0.9"/><circle cx="200" cy="140" r="45" fill="#ffb7c5" opacity="0.9"/>'
  },
  {
    name: 'memory-03.svg',
    title: 'Twilight by the Ocean',
    date: 'July 2025',
    bg1: '#ff7e5f', bg2: '#feb47b', bg3: '#6a11cb',
    accent: '#ff5e62',
    icon: '🌅',
    art: '<circle cx="300" cy="280" r="90" fill="#ffeaa7"/><path d="M0,320 C150,310 250,330 600,315 L600,450 L0,450 Z" fill="#2d3436" opacity="0.6"/><path d="M0,350 C200,340 400,360 600,345 L600,450 L0,450 Z" fill="#1e272e"/>'
  },
  {
    name: 'memory-04.svg',
    title: 'Warm Cafe Conversations',
    date: 'October 2025',
    bg1: '#3e2723', bg2: '#5d4037', bg3: '#8d6e63',
    accent: '#d4a574',
    icon: '☕',
    art: '<circle cx="300" cy="200" r="100" fill="#d4a574" opacity="0.2"/><path d="M220,260 L380,260 C370,350 230,350 220,260 Z" fill="#fff8e7"/><path d="M380,270 C410,270 410,310 380,310" stroke="#fff8e7" stroke-width="12" fill="none"/>'
  },
  {
    name: 'memory-05.svg',
    title: 'Festival of Floating Lanterns',
    date: 'November 2025',
    bg1: '#090a0f', bg2: '#1b1b2f', bg3: '#162447',
    accent: '#e43f5a',
    icon: '🏮',
    art: '<circle cx="200" cy="140" r="35" fill="#ff9f43" opacity="0.85"/><circle cx="350" cy="180" r="25" fill="#feca57" opacity="0.9"/><circle cx="420" cy="100" r="20" fill="#ff6b6b" opacity="0.8"/><circle cx="140" cy="220" r="18" fill="#feca57" opacity="0.85"/><circle cx="280" cy="80" r="28" fill="#ff9f43" opacity="0.95"/>'
  },
  {
    name: 'memory-06.svg',
    title: 'A Promise for Tomorrow',
    date: 'December 2026',
    bg1: '#2c3e50', bg2: '#fd746c', bg3: '#ff9068',
    accent: '#ff6b81',
    icon: '💖',
    art: '<circle cx="300" cy="200" r="130" fill="#ffffff" opacity="0.15"/><path d="M300,290 C300,290 190,210 190,150 C190,110 230,90 260,110 C280,125 300,150 300,150 C300,150 320,125 340,110 C370,90 410,110 410,150 C410,210 300,290 300,290 Z" fill="#ff4757" opacity="0.9"/>'
  }
]

fs.mkdirSync('public/assets/images/memories', { recursive: true })
fs.mkdirSync('public/assets/photos', { recursive: true })

memories.forEach((m, idx) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
    <defs>
      <linearGradient id="bg-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${m.bg1}" />
        <stop offset="50%" stop-color="${m.bg2}" />
        <stop offset="100%" stop-color="${m.bg3}" />
      </linearGradient>
    </defs>
    <rect width="600" height="450" fill="url(#bg-${idx})" />
    <g>${m.art}</g>
    <rect width="600" height="450" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="16" />
    <rect x="40" y="340" width="520" height="70" rx="12" fill="rgba(0,0,0,0.55)" />
    <text x="60" y="372" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="bold" fill="#ffffff">${m.title}</text>
    <text x="60" y="395" font-family="'Poppins', sans-serif" font-size="13" fill="${m.accent}">${m.icon} ${m.date} — A Special Memory</text>
  </svg>`

  fs.writeFileSync(`public/assets/images/memories/${m.name}`, svg)
  fs.writeFileSync(`public/assets/images/memories/memory-0${idx + 1}.jpg`, svg)
  fs.writeFileSync(`public/assets/photos/memory-0${idx + 1}.jpg`, svg)
})

console.log('Generated aesthetic memory images!')
