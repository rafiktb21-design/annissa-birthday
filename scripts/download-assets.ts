import { writeFileSync, mkdirSync, existsSync, statSync } from 'fs'

const ASSETS = [
  {
    name: 'Cherry Blossom Tree (Full)',
    url: 'https://tevy.dev/models/cherry-blossom-tree/v1/lod0.glb',
    path: 'public/assets/models/cherry-blossom-tree.glb',
  },
  {
    name: 'Cherry Blossom Tree (Light)',
    url: 'https://tevy.dev/models/cherry-blossom-tree/v1/lod1.glb',
    path: 'public/assets/models/cherry-blossom-tree-light.glb',
  },
  {
    name: 'Birthday Cake',
    url: 'https://grab3d.com/dl/birthday-cake/birthday-cake.glb',
    path: 'public/assets/models/birthday-cake.glb',
  },
  {
    name: 'Love Letter',
    url: 'https://grab3d.com/dl/letter/letter.glb',
    path: 'public/assets/models/love-letter.glb',
  },
  {
    name: 'Gift Box',
    url: 'https://grab3d.com/dl/gift-box/gift-box.glb',
    path: 'public/assets/models/gift-box.glb',
  },
  {
    name: 'Gift Box Collection',
    url: 'https://files.innerscene.com/library/wrapped-gift-boxes-with-ribbons-and-bows-set-of-three-93bd6c55/8d6ee579097b79357596/wrapped-gift-boxes-with-ribbons-and-bows-set-of-three.glb',
    path: 'public/assets/models/gift-box-collection.glb',
  },
]

const DIRS = [
  'public/assets/models',
  'public/assets/textures',
  'public/assets/backgrounds',
  'public/assets/photos',
  'public/assets/music',
  'public/assets/sounds',
]

// GLB magic bytes: "glTF"
const GLB_MAGIC = Buffer.from([0x67, 0x6c, 0x54, 0x46])

async function main() {
  console.log('🎂 A Journey For Annisa — Asset Downloader\n')

  // Create directories
  for (const dir of DIRS) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
      console.log(`📁 Created: ${dir}`)
    }
  }

  const results: { name: string; status: string; size?: number }[] = []

  for (const asset of ASSETS) {
    // Skip if file already exists and is valid
    if (existsSync(asset.path)) {
      const stat = statSync(asset.path)
      if (stat.size > 1000) {
        console.log(`✅ ${asset.name} — already exists (${(stat.size / 1024).toFixed(1)} KB)`)
        results.push({ name: asset.name, status: 'exists', size: stat.size })
        continue
      }
    }

    console.log(`⬇️  Downloading: ${asset.name}...`)
    try {
      const response = await fetch(asset.url, {
        headers: { 'User-Agent': 'AssetDownloader/1.0' },
        redirect: 'follow',
      })

      if (!response.ok) {
        console.log(`❌ ${asset.name} — HTTP ${response.status}`)
        results.push({ name: asset.name, status: `failed (HTTP ${response.status})` })
        continue
      }

      const buffer = Buffer.from(await response.arrayBuffer())

      // Validate GLB magic bytes
      if (asset.path.endsWith('.glb') && buffer.length > 4) {
        const header = buffer.subarray(0, 4)
        if (!header.equals(GLB_MAGIC)) {
          console.log(`⚠️  ${asset.name} — downloaded but not a valid GLB file (got HTML or other content)`)
          results.push({ name: asset.name, status: 'invalid format' })
          continue
        }
      }

      writeFileSync(asset.path, buffer)
      console.log(`✅ ${asset.name} — saved (${(buffer.length / 1024).toFixed(1)} KB)`)
      results.push({ name: asset.name, status: 'downloaded', size: buffer.length })
    } catch (err) {
      console.log(`❌ ${asset.name} — ${(err as Error).message}`)
      results.push({ name: asset.name, status: `failed (${(err as Error).message})` })
    }
  }

  // Summary
  console.log('\n📊 Download Summary:')
  console.log('─'.repeat(60))
  for (const r of results) {
    const sizeStr = r.size ? ` (${(r.size / 1024).toFixed(1)} KB)` : ''
    const icon = r.status.startsWith('fail') || r.status === 'invalid format' ? '❌' : '✅'
    console.log(`${icon} ${r.name}: ${r.status}${sizeStr}`)
  }

  const failed = results.filter(r => r.status.startsWith('fail') || r.status === 'invalid format')
  if (failed.length > 0) {
    console.log(`\n⚠️  ${failed.length} asset(s) could not be downloaded. Procedural fallbacks will be used.`)
  } else {
    console.log('\n🎉 All assets downloaded successfully!')
  }
}

main()
