import fs from 'fs'
import jpeg from 'jpeg-js'

const WIDTH = 1200
const HEIGHT = 900

function createMemoryImage(type) {
  const frameData = Buffer.alloc(WIDTH * HEIGHT * 4)

  for (let y = 0; y < HEIGHT; y++) {
    const ny = y / HEIGHT
    for (let x = 0; x < WIDTH; x++) {
      const nx = x / WIDTH
      const idx = (y * WIDTH + x) * 4

      let r = 0, g = 0, b = 0

      if (type === 1) {
        // Memory 1: Under the Starlit Sky (Deep Indigo, Violet, Golden Milky Way)
        const skyGrad = 1 - ny
        r = 18 * skyGrad + 35 * (1 - skyGrad) * Math.sin(nx * Math.PI)
        g = 22 * skyGrad + 30 * (1 - skyGrad)
        b = 58 * skyGrad + 75 * (1 - skyGrad)

        // Nebula / Milky Way streak
        const distToDiag = Math.abs((nx - 0.5) * 1.5 - (ny - 0.35))
        const nebula = Math.exp(-distToDiag * 6) * 0.45
        r += 110 * nebula
        g += 70 * nebula
        b += 140 * nebula

        // Stars & Golden stardust
        const starSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
        const starVal = starSeed - Math.floor(starSeed)
        if (starVal > 0.985 && ny < 0.75) {
          const intensity = (starVal - 0.985) / 0.015
          r += 240 * intensity
          g += 235 * intensity
          b += 255 * intensity
        }

        // Soft Moon glow
        const mdx = nx - 0.78, mdy = ny - 0.25
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mDist < 0.18) {
          const mg = Math.exp(-mDist * 16)
          r += 255 * mg * 0.9
          g += 245 * mg * 0.85
          b += 220 * mg * 0.7
        }

        // Hillside silhouette at bottom
        const hill = 0.82 + Math.sin(nx * 4) * 0.04 + Math.sin(nx * 11) * 0.02
        if (ny > hill) {
          r = 12; g = 14; b = 25
        }
      } else if (type === 2) {
        // Memory 2: Spring Sakura Walk (Dreamy Rose Pink & Golden Sunbeams)
        const skyGrad = ny
        r = 252 - skyGrad * 30 + Math.sin(nx * 6) * 12
        g = 210 - skyGrad * 45
        b = 225 - skyGrad * 35

        // Sunflare in top corner
        const sDist = Math.sqrt(nx * nx + ny * ny)
        const flare = Math.exp(-sDist * 2.5) * 0.7
        r += 40 * flare; g += 50 * flare; b += 20 * flare

        // Tree branches silhouette with pink blossoms
        const branchDist = Math.abs(ny - (0.28 + Math.sin(nx * 5) * 0.12))
        if (branchDist < 0.025) {
          r = 85; g = 52; b = 42
        }

        // Soft bokeh orbs of sakura petals
        for (let i = 0; i < 28; i++) {
          const bx = ((i * 137.5) % 100) / 100
          const by = ((i * 73.1) % 100) / 100
          const br = 0.03 + ((i % 5) * 0.012)
          const d = Math.sqrt((nx - bx) * (nx - bx) + (ny - by) * (ny - by))
          if (d < br) {
            const alpha = (1 - d / br) * 0.35
            r = r * (1 - alpha) + 248 * alpha
            g = g * (1 - alpha) + 165 * alpha
            b = b * (1 - alpha) + 190 * alpha
          }
        }
      } else if (type === 3) {
        // Memory 3: Twilight by the Ocean (Golden Peach & Lavender Horizon)
        if (ny < 0.58) {
          // Sky gradient from lavender to rich golden peach sunset
          const t = ny / 0.58
          r = 140 * (1 - t) + 252 * t
          g = 115 * (1 - t) + 160 * t
          b = 185 * (1 - t) + 130 * t

          // Glowing setting sun on horizon
          const sdx = nx - 0.5, sdy = ny - 0.54
          const sDist = Math.sqrt(sdx * sdx * 2.5 + sdy * sdy * 8)
          if (sDist < 0.4) {
            const glow = Math.exp(-sDist * 8)
            r = r * (1 - glow) + 255 * glow
            g = g * (1 - glow) + 235 * glow
            b = b * (1 - glow) + 180 * glow
          }
        } else {
          // Ocean with golden reflection column
          const t = (ny - 0.58) / 0.42
          r = 45 * (1 - t) + 25 * t
          g = 55 * (1 - t) + 40 * t
          b = 85 * (1 - t) + 65 * t

          const colDist = Math.abs(nx - 0.5)
          if (colDist < 0.22) {
            const wave = Math.sin(ny * 90 + nx * 30) * 0.5 + 0.5
            const sheen = (1 - colDist / 0.22) * wave * (1 - t * 0.5)
            r += 190 * sheen
            g += 130 * sheen
            b += 70 * sheen
          }
        }
      } else if (type === 4) {
        // Memory 4: Warm Cafe Conversations (Rich Espresso, Wood Grain & Warm Fairy Glow)
        const woodT = ny
        r = 165 - woodT * 50 + Math.sin(nx * 180) * 8
        g = 115 - woodT * 42 + Math.sin(nx * 180) * 6
        b = 80 - woodT * 32

        // Two artisan coffee cups with heart latte art
        const c1x = 0.38, c1y = 0.52, cRadius = 0.16
        const c2x = 0.64, c2y = 0.48
        const d1 = Math.sqrt((nx - c1x) * (nx - c1x) * 1.3 + (ny - c1y) * (ny - c1y) * 1.3)
        const d2 = Math.sqrt((nx - c2x) * (nx - c2x) * 1.3 + (ny - c2y) * (ny - c2y) * 1.3)

        if (d1 < cRadius || d2 < cRadius) {
          const d = Math.min(d1, d2)
          if (d > cRadius - 0.02) {
            // Ceramic rim (Ivory)
            r = 250; g = 244; b = 236
          } else {
            // Latte coffee tone
            r = 195; g = 145; b = 105
            // Heart froth center
            if (d < 0.075) {
              r = 252; g = 248; b = 242
            }
          }
        }

        // Warm fairy lights in background
        const lightDist = Math.sqrt((nx - 0.5) * (nx - 0.5) + (ny - 0.15) * (ny - 0.15))
        const warmGlow = Math.exp(-lightDist * 3) * 0.45
        r += 90 * warmGlow; g += 65 * warmGlow; b += 20 * warmGlow
      } else if (type === 5) {
        // Memory 5: Festival of Floating Lanterns (Midnight Blue & Luminous Gold Lanterns)
        const skyGrad = 1 - ny
        r = 12 * skyGrad + 20 * (1 - skyGrad)
        g = 18 * skyGrad + 25 * (1 - skyGrad)
        b = 45 * skyGrad + 55 * (1 - skyGrad)

        // Multiple floating lanterns with warm glowing gradients
        const lanterns = [
          { x: 0.50, y: 0.38, s: 0.055 },
          { x: 0.32, y: 0.28, s: 0.038 },
          { x: 0.68, y: 0.24, s: 0.042 },
          { x: 0.20, y: 0.18, s: 0.025 },
          { x: 0.82, y: 0.32, s: 0.032 },
          { x: 0.44, y: 0.15, s: 0.022 },
          { x: 0.60, y: 0.12, s: 0.018 },
        ]

        lanterns.forEach(lt => {
          const ldx = (nx - lt.x) / lt.s
          const ldy = (ny - lt.y) / (lt.s * 1.35)
          const ld = Math.sqrt(ldx * ldx + ldy * ldy)
          if (ld < 1.0) {
            const int = 1 - ld
            r = r * (1 - int) + (255 * int + 240 * (1 - int))
            g = g * (1 - int) + (205 * int + 160 * (1 - int))
            b = b * (1 - int) + (110 * int + 60 * (1 - int))
          } else if (ld < 3.2) {
            const aura = Math.exp(-ld * 1.2) * 0.6
            r += 230 * aura
            g += 170 * aura
            b += 70 * aura
          }
        })

        // Water reflection at bottom
        if (ny > 0.68) {
          const wy = (ny - 0.68) / 0.32
          const ripple = Math.sin(ny * 120 + nx * 40) * 0.4 + 0.6
          r = r * 0.8 + 80 * ripple * (1 - wy)
          g = g * 0.8 + 55 * ripple * (1 - wy)
          b = b * 0.8 + 20 * ripple * (1 - wy)
        }
      } else {
        // Memory 6: A Promise for Tomorrow (Golden Hour Field & Endless Romantic Horizon)
        if (ny < 0.60) {
          // Sunset golden sky
          const t = ny / 0.60
          r = 255
          g = 210 * (1 - t) + 165 * t
          b = 175 * (1 - t) + 140 * t

          // Radiant Sun orb
          const sdx = nx - 0.5, sdy = ny - 0.48
          const sDist = Math.sqrt(sdx * sdx + sdy * sdy)
          if (sDist < 0.28) {
            const glow = Math.exp(-sDist * 7)
            r = r * (1 - glow) + 255 * glow
            g = g * (1 - glow) + 245 * glow
            b = b * (1 - glow) + 215 * glow
          }
        } else {
          // Lush flower meadow with golden rim light
          const t = (ny - 0.60) / 0.40
          r = 135 * (1 - t) + 75 * t
          g = 145 * (1 - t) + 85 * t
          b = 90 * (1 - t) + 50 * t

          // Colorful flower flecks (blush pink, soft gold)
          const flowerSeed = Math.sin(x * 37.1 + y * 91.3) * 43758.5453
          const flr = flowerSeed - Math.floor(flowerSeed)
          if (flr > 0.94) {
            if (flr > 0.97) {
              r = 245; g = 175; b = 195 // Pink bloom
            } else {
              r = 248; g = 215; b = 135 // Gold bloom
            }
          }
        }
      }

      // Vignette & subtle analog film grain
      const vdx = nx - 0.5, vdy = ny - 0.5
      const vignette = 1 - (vdx * vdx + vdy * vdy) * 0.65
      const grain = (Math.random() - 0.5) * 8

      frameData[idx] = Math.min(255, Math.max(0, Math.round(r * vignette + grain)))
      frameData[idx + 1] = Math.min(255, Math.max(0, Math.round(g * vignette + grain)))
      frameData[idx + 2] = Math.min(255, Math.max(0, Math.round(b * vignette + grain)))
      frameData[idx + 3] = 255
    }
  }

  const rawImageData = {
    data: frameData,
    width: WIDTH,
    height: HEIGHT,
  }

  return jpeg.encode(rawImageData, 92).data
}

console.log('Rendering 6 high-definition photographic memory snapshots...')
for (let i = 1; i <= 6; i++) {
  const buf = createMemoryImage(i)
  const pathMem = `public/assets/images/memories/memory-0${i}.jpg`
  const pathPhoto = `public/assets/photos/memory-0${i}.jpg`
  fs.writeFileSync(pathMem, buf)
  fs.writeFileSync(pathPhoto, buf)
  console.log(`Saved ${pathMem} & ${pathPhoto} (${buf.length} bytes, genuine JPEG)`)
}
console.log('Done!')
