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

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()))
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message))

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })

  // Wait for loading screen to complete
  await new Promise(r => setTimeout(r, 2200))

  // Scroll to garden section
  await page.evaluate(() => {
    const el = document.getElementById('garden')
    if (el) el.scrollIntoView({ behavior: 'instant' })
  })

  await new Promise(r => setTimeout(r, 1500))

  const shotPath = path.resolve('garden-section.png')
  await page.screenshot({ path: shotPath })
  console.log('Captured garden-section.png! Size:', fs.statSync(shotPath).size)

  await browser.close()
}

capture().catch(err => console.error('Capture failed:', err))
