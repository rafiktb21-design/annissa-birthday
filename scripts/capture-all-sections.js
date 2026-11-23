import puppeteer from 'puppeteer-core'
import path from 'path'

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  // Desktop view
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))

  const sections = ['top', 'garden', 'memories', 'letter', 'celebration', 'finale']

  for (const s of sections) {
    const el = await page.$(`#${s}`)
    if (el) {
      await el.screenshot({ path: `section-${s}-desktop.png` })
      console.log(`Captured section-${s}-desktop.png`)
    }
  }

  // Mobile view
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await new Promise(r => setTimeout(r, 2000))

  for (const s of sections) {
    const el = await page.$(`#${s}`)
    if (el) {
      await el.screenshot({ path: `section-${s}-mobile.png` })
      console.log(`Captured section-${s}-mobile.png`)
    }
  }

  await browser.close()
}

captureAll().catch(console.error)
