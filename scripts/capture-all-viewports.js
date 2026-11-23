import puppeteer from 'puppeteer-core'

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1 },
  { name: 'desktop-1920', width: 1920, height: 1080, dsf: 1 },
  { name: 'tablet-1024', width: 1024, height: 768, dsf: 2 },
  { name: 'tablet-768', width: 768, height: 1024, dsf: 2 },
  { name: 'mobile-390', width: 390, height: 844, dsf: 2 },
  { name: 'mobile-375', width: 375, height: 812, dsf: 2 },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const sections = ['top', 'garden', 'memories', 'letter', 'celebration', 'finale']

  for (const vp of viewports) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf })
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
    await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
    await new Promise(r => setTimeout(r, 2000))

    for (const sec of sections) {
      const el = await page.$(`#${sec}`)
      if (el) {
        await el.screenshot({ path: `capture-${vp.name}-${sec}.png` })
      }
    }
    console.log(`Captured all sections for ${vp.name}`)
    await page.close()
  }

  await browser.close()
}

run().catch(console.error)
