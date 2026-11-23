import puppeteer from 'puppeteer-core'

async function testLetterOpen() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  })

  // Desktop
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })

  await page.evaluate(() => {
    const el = document.getElementById('letter')
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await new Promise(r => setTimeout(r, 1000))

  // Click on the envelope to open
  await page.click('#letter .cursor-pointer')
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: 'letter-opened-desktop.png' })
  console.log('Saved letter-opened-desktop.png')

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.reload({ waitUntil: 'networkidle2' })
  await page.waitForFunction(() => !document.querySelector('.z-50'), { timeout: 10000 })
  await page.evaluate(() => {
    const el = document.getElementById('letter')
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await new Promise(r => setTimeout(r, 1000))
  await page.evaluate(() => {
    const wax = document.querySelector('#letter .cursor-pointer')
    if (wax) wax.click()
  })
  await new Promise(r => setTimeout(r, 1200))

  await page.screenshot({ path: 'letter-opened-mobile.png' })
  console.log('Saved letter-opened-mobile.png')

  await browser.close()
}

testLetterOpen().catch(console.error)
