import chroma from 'chroma-js'
import ColorHash from 'color-hash'

const isDark = (color) => {
  const whiteContrast = chroma.contrast(color, '#fff')
  const blackContrast = chroma.contrast(color, '#000')
  return whiteContrast > blackContrast
}

const contrastText = (color) => {
  return isDark(color)
    ? chroma.mix(color, '#fff', 0.8)
    : chroma.mix(color, '#000', 0.9)
}

const getShade = (color) => {
  let shade = chroma(color)
  const luminance = shade.luminance()

  // Darken or lighten depending on luminance
  if (luminance > 0.5) {
    shade = shade.darken(2)
  } else {
    shade = shade.brighten(2)
  }

  return shade
}

const getGlass = (base) => {
  const color = chroma(base)
  const glass = isDark(color)
    ? color.brighten(2).alpha(0.1)
    : color.darken(2).alpha(0.1)
  return glass.css()
}

const defaultComplementaryOptions = {
  type: 'hue',
  hueRotation: '+180',
  shadeRotation: '+10',
  opinionated: true,
}
const getComplementary = (color, options = defaultComplementaryModifiers) => {
  const hue = chroma(color).get('hsl.h')
  const saturation = chroma(color).get('hsl.s')
  const lightness = chroma(color).get('hsl.l')
  const defaultHue = chroma(color).set('hsl.h', options.hueRotation)

  let complementary = defaultHue

  if (options.type === 'hue' && options.opinionated) {
    // These are a kinda ugly combo of green / purple so use a better color
    if (
      hue > 60 &&
      hue < 160 &&
      saturation > 0.5 &&
      lightness > 0.2 &&
      lightness < 0.8
    ) {
      complementary = chroma(color).set('hsl.h', options.shadeRotation)
      complementary = getShade(complementary)
    }

    // Some more ugly combos to pick different colors for
    if (
      hue > 240 &&
      hue < 320 &&
      saturation > 0.5 &&
      lightness > 0.2 &&
      lightness < 0.8
    ) {
      complementary = chroma(color).set('hsl.h', options.shadeRotation)
      complementary = getShade(complementary)
    }
  }

  if (options.type === 'shade') {
    complementary = getShade(color)
  }

  // Use a shade instead of hue if there's not enough contrast
  if (chroma.contrast(color, complementary) < 1.4) {
    complementary = getShade(complementary)
  }

  return complementary
}

const defaultModifiers = {
  alt: 0.3,
  gradientCount: 6,
  border: 0.9,
  complementaryType: defaultComplementaryOptions.type,
  complementaryHueRotation: defaultComplementaryOptions.hueRotation,
  complementaryShadeRotation: defaultComplementaryOptions.shadeRotation,
  complementaryOpinionated: defaultComplementaryOptions.opinionated,
}

const createTheme = (base, modifiers = defaultModifiers) => {
  let main = chroma(base)
  let complementary = getComplementary(main, {
    type: modifiers.complementaryType,
    hueRotation: modifiers.complementaryHueRotation,
    shadeRotation: modifiers.complementaryShadeRotation,
    opinionated: modifiers.complementaryOpinionated,
  })

  const dark = isDark(main)

  const theme = {
    main: main.hex(),
    mainAlt: dark
      ? main.brighten(modifiers.alt).hex()
      : main.darken(modifiers.alt).hex(),
    complementary: complementary.hex(),
    gradient: chroma
      .scale([main, complementary])
      .mode('lab')
      .colors(modifiers.gradientCount),
    contrast: contrastText(main).hex(),
    border: dark
      ? main.brighten(modifiers.border).hex()
      : main.darken(modifiers.border).hex(),
    glass: getGlass(main),
    isDark: dark,
  }

  return theme
}

const random = () => {
  let color = chroma.random()
  let theme = createTheme(color)

  while (chroma.contrast(theme.main, theme.complementary) < 2) {
    color = chroma.random()
    theme = createTheme(color)
  }

  return theme
}

const daily = () => {
  const now = new Date()
  const year = now.getFullYear()
  const day = now.getDate() * (now.getMonth() + 1) + 365 * year
  const colorHashOptions = {
    // Note I've duplicated some of the colors I prefer to get them to appear more often than the ugly ones.
    hue: [
      { min: 0, max: 20 }, // Nice red or pink with blue
      { min: 0, max: 20 }, // Nice red or pink with blue
      { min: 0, max: 20 }, // Nice red or pink with blue
      { min: 20, max: 40 }, // Nice peach - red with blue
      { min: 20, max: 40 }, // Nice peach - red with blue
      { min: 20, max: 40 }, // Nice peach - red with blue
      { min: 40, max: 60 }, // Nice Sand - yellow with blue
      { min: 40, max: 60 }, // Nice Sand - yellow with blue
      { min: 40, max: 60 }, // Nice Sand - yellow with blue
      { min: 60, max: 80 }, // Not my favourite greeny yellow with blue
      { min: 60, max: 80 }, // Not my favourite greeny yellow with blue
      // { min: 80, max: 100 }, // All ugly green purple
      { min: 100, max: 120 }, // Still mostly ugly green purple
      { min: 120, max: 140 }, // Still too much green purple
      { min: 140, max: 160 }, // Starting to get better, but still not great green pink
      { min: 140, max: 160 }, // Starting to get better, but still not great green pink
      { min: 160, max: 180 }, // Nice Turquoisey minty with pink
      { min: 160, max: 180 }, // Nice Turquoisey minty with pink
      { min: 160, max: 180 }, // Nice Turquoisey minty with pink
      { min: 180, max: 200 }, // Nice sea greeny blues with peach - red
      { min: 180, max: 200 }, // Nice sea greeny blues with peach - red
      { min: 180, max: 200 }, // Nice sea greeny blues with peach - red
      { min: 200, max: 220 }, // All of these are very nice blues with sandy earthy yellow brown
      { min: 200, max: 220 }, // All of these are very nice blues with sandy earthy yellow brown
      { min: 200, max: 220 }, // All of these are very nice blues with sandy earthy yellow brown
      { min: 220, max: 240 }, // Nice blue & yellows
      { min: 220, max: 240 }, // Nice blue & yellows
      { min: 220, max: 240 }, // Nice blue & yellows
      { min: 240, max: 260 }, // Getting towards more purple again
      { min: 240, max: 260 }, // Getting towards more purple again
      // { min: 260, max: 280 }, // Gross green purple again
      // { min: 280, max: 300 }, // Nasty green purple
      { min: 300, max: 320 }, // Pink green still not the nicest
      { min: 320, max: 340 }, // Not so bad pink green
      { min: 320, max: 340 }, // Not so bad pink green
      { min: 340, max: 360 }, // Nicer red /deep pink green
      { min: 340, max: 360 }, // Nicer red /deep pink green
    ],
    saturation: [0.4, 0.6, 0.8],
    lightness: [0.1, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8],
  }
  const colorHash = ColorHash.default
    ? new ColorHash.default(colorHashOptions)
    : new ColorHash(colorHashOptions)
  const dayColor = colorHash.hex(day.toString())
  return createTheme(dayColor)
}

export { random }
export { daily }
export { createTheme as fromColor }
