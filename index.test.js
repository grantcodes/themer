import test from 'ava'
import * as themer from './index.js'
import examples from './examples.js'
// TODO: Not sure how to get the rewire stuff working with modules and imports
// import rewire from 'rewire'

// const themerRewired = rewire('./index.js')

// isDark function
// const isDark = themerRewired.__get__('isDark')

// test('#000 to be dark', (t) => {
//   t.true(isDark('#000'))
// })

// test('#fff to be light', (t) => {
//   t.false(isDark('#fff'))
// })

// test('#777 to be light', (t) => {
//   t.false(isDark('#777'))
// })

// test('#666 to be dark', (t) => {
//   t.true(isDark('#666'))
// })

// // contrastText function
// const contrastText = themerRewired.__get__('contrastText')
// test('Contast text colors', (t) => {
//   for (const theme of examples) {
//     const textColor = contrastText(theme.main)
//     t.assert(textColor.hex() == theme.contrast)
//   }
// })

// const getComplementary = themerRewired.__get__('getComplementary')
// test('Complementary colors', (t) => {
//   for (const theme of examples) {
//     const color = getComplementary(theme.main)
//     t.assert(color.hex() === theme.complementary)
//   }
// })

// // getShade function
// const getShade = themerRewired.__get__('getShade')
// test('Get shade', (t) => {
//   t.assert(getShade('#000').hex() === '#555555')
//   t.assert(getShade('#fff').hex() === '#9b9b9b')
//   t.assert(getShade('hotpink').hex() === '#ffd1ff')
//   t.assert(getShade('cornflowerblue').hex() === '#cff8ff')
// })

// // getGlass function
// const getGlass = themerRewired.__get__('getGlass')
// test('Glass colors', (t) => {
//   for (const theme of examples) {
//     const glassColor = getGlass(theme.main)
//     t.assert(glassColor === theme.glass)
//   }
// })

test('Theme generation', (t) => {
  for (const theme of examples) {
    const createdTheme = themer.fromColor(theme.main)
    t.deepEqual(createdTheme, theme)
  }
})

// Test random theme
test('Random theme', (t) => {
  const theme = themer.random()
  t.assert(theme.hasOwnProperty('main'))
  t.assert(theme.hasOwnProperty('mainAlt'))
  t.assert(theme.hasOwnProperty('border'))
  t.assert(theme.hasOwnProperty('complementary'))
  t.assert(theme.hasOwnProperty('contrast'))
  t.assert(theme.hasOwnProperty('glass'))
  t.assert(theme.hasOwnProperty('gradient'))
  t.true(Array.isArray(theme.gradient))
  t.assert(theme.gradient.length === 6)
})

// Test daily theme
test('Daily theme', (t) => {
  const intialTheme = themer.daily()
  const secondTheme = themer.daily()
  t.assert(intialTheme.hasOwnProperty('main'))
  t.assert(intialTheme.hasOwnProperty('mainAlt'))
  t.assert(intialTheme.hasOwnProperty('border'))
  t.assert(intialTheme.hasOwnProperty('complementary'))
  t.assert(intialTheme.hasOwnProperty('contrast'))
  t.assert(intialTheme.hasOwnProperty('glass'))
  t.assert(intialTheme.hasOwnProperty('gradient'))
  t.true(Array.isArray(intialTheme.gradient))
  t.assert(intialTheme.gradient.length === 6)
  t.deepEqual(intialTheme, secondTheme)
})

// Test that daily theme is different with a different date
test('Daily theme to change with different date', (t) => {
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
  t.notDeepEqual(differentTheme, intialTheme)
})
