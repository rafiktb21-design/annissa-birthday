import puppeteer from 'puppeteer-core'
import fs from 'fs'

async function getLandscapePhotos() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const queries = [
    'https://unsplash.com/s/photos/kyoto-garden-cherry-blossom?orientation=landscape',
    'https://unsplash.com/s/photos/japanese-garden-sakura-path?orientation=landscape',
    'https://unsplash.com/s/photos/shinjuku-gyoen-cherry-blossom?orientation=landscape'
  ]

  const results = []

  for (const q of queries) {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    try {
      await page.goto(q, { waitUntil: 'networkidle2', timeout: 20000 })
      const imgs = await page.evaluate(() => {
        const list = []
        document.querySelectorAll('figure img').forEach(img => {
          const src = img.currentSrc || img.src
          if (src && src.includes('images.unsplash.com/photo-')) {
            list.push({ src, alt: img.alt || '' })
          }
        })
        return list
      })
      console.log(`URL ${q}: found ${imgs.length} images`)
      results.push(...imgs)
    } catch (e) {
      console.log(`Error:`, e.message)
    }
    await page.close()
  }

  await browser.close()
  fs.writeFileSync('scripts/unsplash-landscape.json', JSON.stringify(results, null, 2))
}

getLandscapePhotos().catch(console.error)
