import puppeteer from 'puppeteer-core'

async function captureScrolled() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await new Promise(r => setTimeout(r, 1500))

  const sections = ['top', 'garden', 'memories', 'letter', 'celebration', 'finale']

  for (const sec of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, sec)

    // Wait for framer-motion animations
    await new Promise(r => setTimeout(r, 1000))

    const el = await page.$(`#${sec}`)
    if (el) {
      await el.screenshot({ path: `scrolled-1440-${sec}.png` })
      console.log(`Saved scrolled-1440-${sec}.png`)
    }
  }

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await new Promise(r => setTimeout(r, 1500))

  for (const sec of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, sec)

    await new Promise(r => setTimeout(r, 1000))

    const el = await page.$(`#${sec}`)
    if (el) {
      await el.screenshot({ path: `scrolled-mobile-${sec}.png` })
      console.log(`Saved scrolled-mobile-${sec}.png`)
    }
  }

  await browser.close()
}

captureScrolled().catch(console.error)
