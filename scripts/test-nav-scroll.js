import puppeteer from 'puppeteer-core'

async function testNavScroll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await new Promise(r => setTimeout(r, 1000))

  const links = ['Garden', 'Memories', 'Letter', 'Celebration']

  for (const name of links) {
    await page.evaluate((btnText) => {
      const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes(btnText))
      if (btn) btn.click()
    }, name)

    // Wait for smooth Lenis scroll and animations
    await new Promise(r => setTimeout(r, 2200))

    await page.screenshot({ path: `nav-landed-${name.toLowerCase()}.png` })
    console.log(`Saved nav-landed-${name.toLowerCase()}.png`)
  }

  await browser.close()
}

testNavScroll().catch(console.error)
