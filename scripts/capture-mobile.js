import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

async function captureMobile() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  // Mobile viewport: iPhone 14 Pro / standard smartphone
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })

  // Wait 4s for assets to load
  await new Promise(r => setTimeout(r, 4000))

  const gardenEl = await page.$('#garden')
  if (gardenEl) {
    const shotPath = path.resolve('garden-mobile.png')
    await gardenEl.screenshot({ path: shotPath })
    console.log('Saved garden-mobile.png! Size:', fs.statSync(shotPath).size)
  }

  await browser.close()
}

captureMobile().catch(console.error)
