import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const outPath = path.resolve('garden-preview.png')

const args = [
  '--headless=new',
  '--hide-scrollbars',
  '--disable-gpu',
  '--window-size=1280,1800',
  `--screenshot=${outPath}`,
  '--virtual-time-budget=5000',
  'http://localhost:5173/'
]

console.log('Taking screenshot via Chrome headless...')
const p = spawn(chromePath, args)
p.on('close', (code) => {
  console.log('Chrome process exited with code', code)
  if (fs.existsSync(outPath)) {
    console.log('Success! Screenshot size:', fs.statSync(outPath).size, 'bytes at', outPath)
  } else {
    console.log('Screenshot file not created.')
  }
})
