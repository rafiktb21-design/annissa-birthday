import puppeteer from 'puppeteer-core'
import fs from 'fs'

async function getPhotos() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const queries = [
    'japanese-garden-cherry-blossom',
    'kyoto-cherry-blossom-path',
    'romantic-cherry-blossom-garden'
  ]

  const results = []

  for (const q of queries) {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    try {
      await page.goto(`https://unsplash.com/s/photos/${q}`, { waitUntil: 'networkidle2', timeout: 20000 })
      const imgs = await page.evaluate(() => {
        const list = []
        document.querySelectorAll('figure img').forEach(img => {
          const src = img.currentSrc || img.src
          if (src && src.includes('images.unsplash.com/photo-')) {
            const alt = img.alt || ''
            list.push({ src, alt })
          }
        })
        return list
      })
      console.log(`Query ${q}: found ${imgs.length} images`)
      results.push(...imgs)
    } catch (e) {
      console.log(`Query ${q} error:`, e.message)
    }
    await page.close()
  }

  await browser.close()
  fs.writeFileSync('scripts/unsplash-results.json', JSON.stringify(results, null, 2))
  console.log(`Total results saved: ${results.length}`)
}

getPhotos().catch(console.error)
