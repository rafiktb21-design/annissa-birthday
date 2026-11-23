import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  page.on('console', msg => console.log('LOG:', msg.text()))
  page.on('pageerror', err => console.log('ERROR:', err.message))

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })

  // Wait 4s for assets to load
  await new Promise(r => setTimeout(r, 4000))

  // Find garden section element
  const gardenEl = await page.$('#garden')
  if (gardenEl) {
    const shotPath = path.resolve('garden-element.png')
    await gardenEl.screenshot({ path: shotPath })
    console.log('Saved garden-element.png! Size:', fs.statSync(shotPath).size)
  } else {
    console.log('No #garden found')
  }

  await browser.close()
}

capture().catch(console.error)
