import puppeteer from 'puppeteer-core'

async function captureFullMemories() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })

  // Scroll through memories so all elements trigger whileInView
  await page.evaluate(() => {
    const el = document.getElementById('memories')
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await new Promise(r => setTimeout(r, 1200))

  const el = await page.$('#memories')
  if (el) {
    await el.screenshot({ path: 'memories-all-6-desktop.png' })
    console.log('Saved memories-all-6-desktop.png')
  }

  await browser.close()
}

captureFullMemories().catch(console.error)
