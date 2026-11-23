import puppeteer from 'puppeteer-core'

const viewports = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '375x812', width: 375, height: 812 },
]

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  for (const vp of viewports) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
    await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
    await new Promise(r => setTimeout(r, 1000))

    const metrics = await page.evaluate(() => {
      const scrollW = document.documentElement.scrollWidth
      const clientW = document.documentElement.clientWidth
      const ids = ['top', 'garden', 'memories', 'letter', 'celebration', 'finale']
      const bounds = {}
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el) {
          const r = el.getBoundingClientRect()
          bounds[id] = { width: r.width, left: r.left }
        }
      }
      return { scrollW, clientW, hasOverflow: scrollW > clientW, bounds }
    })

    console.log(`Viewport ${vp.name}: hasOverflow = ${metrics.hasOverflow} (scrollWidth: ${metrics.scrollW}, clientWidth: ${metrics.clientW})`)
    await page.close()
  }

  await browser.close()
}

verify().catch(console.error)
