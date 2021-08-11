const rewire = require('rewire')
const themer = require('./index')
const examples = require('./examples')

const themerRewired = rewire('./index.js')

// isDark function
const isDark = themerRewired.__get__('isDark')

test('#000 to be dark', () => {
  expect(isDark('#000')).toBe(true)
})

test('#fff to be light', () => {
  expect(isDark('#fff')).toBe(false)
})

test('#777 to be light', () => {
  expect(isDark('#777')).toBe(false)
})

test('#666 to be dark', () => {
  expect(isDark('#666')).toBe(true)
})

// contrastText function
const contrastText = themerRewired.__get__('contrastText')
test('Contast text colors', () => {
  for (const theme of examples) {
    const textColor = contrastText(theme.main)
    expect(textColor.hex()).toBe(theme.contrast)
  }
})

const getComplementary = themerRewired.__get__('getComplementary')
test('Complementary colors', () => {
  for (const theme of examples) {
    const color = getComplementary(theme.main)
    expect(color.hex()).toBe(theme.complementary)
  }
})

// getShade function
const getShade = themerRewired.__get__('getShade')
test('Get shade', () => {
  expect(getShade('#000').hex()).toBe('#555555')
  expect(getShade('#fff').hex()).toBe('#9b9b9b')
  expect(getShade('hotpink').hex()).toBe('#ffd1ff')
  expect(getShade('cornflowerblue').hex()).toBe('#cff8ff')
})

// getGlass function
const getGlass = themerRewired.__get__('getGlass')
test('Glass colors', () => {
  for (const theme of examples) {
    const glassColor = getGlass(theme.main)
    expect(glassColor).toBe(theme.glass)
  }
})

test('Theme generation', () => {
  for (const theme of examples) {
    const createdTheme = themer.fromColor(theme.main)
    expect(createdTheme).toEqual(theme)
  }
})

// Test random theme
test('Random theme', () => {
  const theme = themer.random()
  expect(theme).toHaveProperty('main')
  expect(theme).toHaveProperty('mainAlt')
  expect(theme).toHaveProperty('border')
  expect(theme).toHaveProperty('complementary')
  expect(theme).toHaveProperty('contrast')
  expect(theme).toHaveProperty('glass')
  expect(theme).toHaveProperty('gradient')
  expect(Array.isArray(theme.gradient)).toBe(true)
  expect(theme.gradient.length).toBe(6)
})

// Test daily theme
test('Daily theme', () => {
  const intialTheme = themer.daily()
  const secondTheme = themer.daily()
  expect(intialTheme).toHaveProperty('main')
  expect(intialTheme).toHaveProperty('mainAlt')
  expect(intialTheme).toHaveProperty('border')
  expect(intialTheme).toHaveProperty('complementary')
  expect(intialTheme).toHaveProperty('contrast')
  expect(intialTheme).toHaveProperty('glass')
  expect(intialTheme).toHaveProperty('gradient')
  expect(Array.isArray(intialTheme.gradient)).toBe(true)
  expect(intialTheme.gradient.length).toBe(6)
  expect(intialTheme).toEqual(secondTheme)
})

// Test that daily theme is different with a different date
test('Daily theme to change with different date', () => {
  const intialTheme = themer.daily()

  global.Date = class extends Date {
    constructor(date) {
      if (date) {
        return super(date)
      }

      return new Date('2020-01-02')
    }
  }
  const differentTheme = themer.daily()
  console.log({ intialTheme, differentTheme })
  expect(differentTheme).not.toEqual(intialTheme)
})
