const chroma = require('chroma-js')
const ColorHash = require('color-hash')
const colorHash = new ColorHash()

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

const getComplementary = (color) => {
  let complementary = chroma(color).set('hsl.h', '+180')

  if (chroma.contrast(color, complementary) < 1.4) {
    complementary = getShade(complementary)
  }

  return complementary
}

const createTheme = (base) => {
  let main = chroma(base)
  let complementary = getComplementary(main)

  const dark = isDark(main)

  const theme = {
    main: main.hex(),
    mainAlt: dark ? main.brighten(0.3).hex() : main.darken(0.3).hex(),
    complementary: complementary.hex(),
    gradient: chroma.scale([main, complementary]).colors(6),
    contrast: contrastText(main).hex(),
    border: dark ? main.brighten(0.9).hex() : main.darken(0.9).hex(),
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
  return createTheme(colorHash.hex(day))
}

module.exports = {
  random,
  fromColor: createTheme,
  daily,
}
