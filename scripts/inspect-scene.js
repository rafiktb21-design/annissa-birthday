import puppeteer from 'puppeteer-core'

async function inspectScene() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  page.on('console', msg => console.log('LOG:', msg.type(), msg.text()))
  page.on('pageerror', err => console.log('ERROR:', err.message))

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })

  await page.evaluate(() => {
    const navGarden = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Garden'))
    if (navGarden) navGarden.click()
  })

  await new Promise(r => setTimeout(r, 3000))

  const info = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'))
    // Canvas 1 is garden canvas
    const c = canvases[1]
    if (!c) return 'No canvas 1'
    const fiberKey = Object.keys(c).find(k => k.startsWith('__reactFiber'))
    return {
      canvasCount: canvases.length,
      hasFiber: !!fiberKey,
      clientRect: c.getBoundingClientRect()
    }
  })

  console.log('Canvas info:', info)
  await browser.close()
}

inspectScene().catch(console.error)
