// Dev-only tooling script. Requires `sharp` to be available
// (e.g. `npm i sharp`); it is not imported by the app at runtime.
import sharp from "sharp"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const SRC = path.join(root, "public/images/fitacle-logo.png")
const OUT = path.join(root, "public/icons")

// White background matches the PWA manifest background_color (#ffffff) and the
// white rounded tiles used in the splash and install UI, so the installed app
// icon looks consistent everywhere. Apple icons ignore transparency, so a solid
// background is required there too.
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

// Trim the transparent margins so every generated icon has consistent padding
// regardless of the source file's whitespace.
async function trimmedLogo() {
  return sharp(SRC).trim({ threshold: 10 }).toBuffer()
}

// Render the logo centered on a white square with the given padding fraction.
async function makeIcon(size, paddingFraction, outFile) {
  const logo = await trimmedLogo()
  const inner = Math.round(size * (1 - paddingFraction * 2))
  const resized = await sharp(logo)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  const offset = Math.round((size - inner) / 2)
  await sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  })
    .composite([{ input: resized, top: offset, left: offset }])
    .png()
    .toFile(path.join(OUT, outFile))
  console.log("wrote", outFile, `${size}x${size} pad=${paddingFraction}`)
}

await makeIcon(192, 0.14, "icon-192.png")
await makeIcon(512, 0.14, "icon-512.png")
// Maskable icons need a ~20% safe zone so Android's circle/squircle mask never clips the mark.
await makeIcon(192, 0.2, "icon-maskable-192.png")
await makeIcon(512, 0.2, "icon-maskable-512.png")
await makeIcon(180, 0.14, "apple-touch-icon.png")
console.log("done")
