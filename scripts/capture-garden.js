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

  // Wait for loading screen to complete and main page to mount
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  console.log('Loading screen dismissed!')

  // Click on Garden in nav header
  await page.evaluate(() => {
    const navGarden = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Garden'))
    if (navGarden) {
      navGarden.click()
    } else {
      window.scrollTo(0, 920)
    }
  })

  // Wait for Lenis smooth scroll and 3D canvas render
  await new Promise(r => setTimeout(r, 4500))

  const shotPath = path.resolve('garden-test.png')
  await page.screenshot({ path: shotPath })
  console.log('Captured garden-test.png! Size:', fs.statSync(shotPath).size)

  await browser.close()
}

capture().catch(err => console.error('Capture failed:', err))
