import fs from 'fs'

const photos = [
  // 1: Under the Starlit Sky
  { url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=85', name: 'memory-01.jpg' },
  // 2: Spring Sakura Walk
  { url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1200&q=85', name: 'memory-02.jpg' },
  // 3: Twilight by the Ocean
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85', name: 'memory-03.jpg' },
  // 4: Warm Cafe Conversations
  { url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85', name: 'memory-04.jpg' },
  // 5: Festival of Floating Lanterns
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85', name: 'memory-05.jpg' },
  // 6: A Promise for Tomorrow
  { url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=85', name: 'memory-06.jpg' },
]

async function downloadMemories() {
  for (const p of photos) {
    try {
      const res = await fetch(p.url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buf = Buffer.from(await res.arrayBuffer())
      fs.writeFileSync(`public/assets/photos/${p.name}`, buf)
      fs.writeFileSync(`public/assets/images/memories/${p.name}`, buf)
      console.log(`Saved ${p.name} (${buf.length} bytes)`)
    } catch (e) {
      console.error(`Error downloading ${p.name}:`, e.message)
    }
  }
}

downloadMemories().catch(console.error)
