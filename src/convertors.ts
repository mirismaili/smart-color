/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import RGBColor from './RGBColor.js'

const {acos, abs, floor, max, min, PI, round, tan} = Math
const SQRT3 = 3 ** 0.5
const PI6TH = PI / 6
const PI3TH = PI / 3
const DEG_TO_RAD_RATIO = PI / 180
const RAD_TO_DEG_RATIO = 180 / PI

/**
 * @param channels
 * @param channels.hue The **hue** value in degrees
 * @param channels.saturation The percentage of **saturation**
 * @param channels.lightness The percentage of **lightness**
 */
export function hslToRgb0({hue, saturation, lightness}: { hue: number, saturation: number, lightness: number }): RGBColor
/**
 * @param channels
 * @param channels.h An alternative **hue** value, but in radians
 * @param channels.s An alternative **saturation** value, but as a number in `[0, 1]` interval
 * @param channels.l An alternative **lightness** value, but as a number in `[0, 1]` interval
 */
export function hslToRgb0({h, s, l}: { h: number, s: number, l: number }): RGBColor
/**
 * @see https://stackoverflow.com/a/64090995/5318303
 * @see https://www.30secondsofcode.org/js/s/hsl-to-rgb
 * @see https://jsben.ch/fr0Xt
 */
export function hslToRgb0 ({
                             hue = 0,
                             saturation = 0,
                             lightness = 0,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
                           }: { hue?: number, saturation?: number, lightness?: number, h?: number, s?: number, l?: number } = {}) {
  const ll = min(l, 1 - l) // === 0.5 - abs(l - 0.5)
  const sll = s * ll
  return new RGBColor([f(0), f(8), f(4)])

  function f(n: number) {
    const h12 = (n + h / PI6TH) % 12
    const number = min(max(3 - h12, h12 - 9, -1), 1)
    return l + sll * number
  }
}

/**
 * @param channels
 * @param channels.hue The **hue** value in degrees
 * @param channels.saturation The percentage of **saturation**
 * @param channels.lightness The percentage of **lightness**
 */
export function hslToRgb({hue, saturation, lightness}: { hue: number, saturation: number, lightness: number }): RGBColor
/**
 * @param channels
 * @param channels.h An alternative **hue** value, but in radians
 * @param channels.s An alternative **saturation** value, but as a number in `[0, 1]` interval
 * @param channels.l An alternative **lightness** value, but as a number in `[0, 1]` interval
 */
export function hslToRgb({h, s, l}: { h: number, s: number, l: number }): RGBColor
/** @see https://jsben.ch/fr0Xt */
export function hslToRgb ({
                            hue = 0,
                            saturation = 0,
                            lightness = 0,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
                          }: { hue?: number, saturation?: number, lightness?: number, h?: number, s?: number, l?: number } = {}) {
  const h12 = (h / PI6TH) % 12 // [0, 12)
  const ll = min(l, 1 - l) // === 0.5 - abs(l - 0.5)
  const sll = s * ll
  return new RGBColor(
    [
      { // section-0: [000°, 060°) // h12: [0, 2)
        r: l + sll,
        g: l + (h12 - 1) * sll,
        b: l - sll,
      },
      { // section-1: [060°, 120°) // h12: [2, 4)
        r: l - (h12 - 3) * sll,
        g: l + sll,
        b: l - sll,
      },
      { // section-2: [120°, 180°) // h12: [4, 6)
        r: l - sll,
        g: l + sll,
        b: l + (h12 - 5) * sll,
      },
      { // section-3: [180°, 240°) // h12: [6, 8)
        r: l - sll,
        g: l - (h12 - 7) * sll,
        b: l + sll,
      },
      { // section-4: [240°, 300°) // h12: [8, 10)
        r: l + (h12 - 9) * sll,
        g: l - sll,
        b: l + sll,
      },
      { // section-5: [300°, 360°) // h12: [10, 12)
        r: l + sll,
        g: l - sll,
        b: l - (h12 - 11) * sll,
      },
    ][floor(h12 / 2)], // `floor(h12 / 2)` => [0, 1, 2, 3, 4, 5] // length === (360°/60°) sections
  )
}

/**
 * @see https://www.had2know.org/technology/hsv-rgb-conversion-formula-calculator.html
 * @see https://www.desmos.com/calculator/ksrl5six33
 * @returns {*} An array of shape **`[h, s, l]`** that its `h` value is in `[0, 2𝜋)` interval and its `s` and `l` are
 *   in `[0, 1]` interval. Also, represented as **`{h, s, l}`** (`h∈[0, 2𝜋)` and `s,l∈[0, 1]`) and as **`{hue,
 *   saturation, lightness}`** (`hue∈[0, 359]` and `saturation,lightness∈[0, 100]`)
 */
export function rgbToDifferentiableHsl({r, g, b}: RGBColor) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const delta = max - min
  const s = delta && delta / (1 - abs(2 * l - 1)) // if the denominator is zero => `delta === 0`!
  let h
  if (r === g && g === b) h = 0 // if r=g=b then below |sqr| may be a very little number (!== 0)
  else {
    const sqr = r * r + g * g + b * b - r * g - r * b - g * b
    if (sqr === 0) h = 0
    else {
      const arc = acos((r - (g + b) / 2) / sqr ** 0.5)
      h = g < b ? 2 * PI - arc : arc
    }
  }
  const hslColor = [h, s, l] as const
  const [hue, saturation, lightness] = [h * RAD_TO_DEG_RATIO, s * 100, l * 100].map(round)
  return Object.assign(hslColor, {h, s, l, hue, saturation, lightness})
}


/**
 * @param channels
 * @param channels.hue The **hue** value in degrees
 * @param channels.saturation The percentage of **saturation**
 * @param channels.lightness The percentage of **lightness**
 */
export function differentiableHslToRgb({hue, saturation, lightness}: { hue: number, saturation: number, lightness: number }): RGBColor
/**
 * @param channels
 * @param channels.h An alternative **hue** value, but in radians
 * @param channels.s An alternative **saturation** value, but as a number in `[0, 1]` interval
 * @param channels.l An alternative **lightness** value, but as a number in `[0, 1]` interval
 */
export function differentiableHslToRgb({h, s, l}: { h: number, s: number, l: number }): RGBColor
/** @see https://www.desmos.com/calculator/cudn0wmlwk */
export function differentiableHslToRgb ({
                                          hue = 0,
                                          saturation = 0,
                                          lightness = 0,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
                                        }: { hue?: number, saturation?: number, lightness?: number, h?: number, s?: number, l?: number } = {}) {
  // let max, min // https://www.desmos.com/calculator/5gjtalpywd
  //
  // if (l > 0.5) {
  //   max = l - s * l + s
  //   min = l + s * l - s
  // } else {
  //   max = l * (1 + s)
  //   min = l * (1 - s)
  // }
  // // max = (1 - sign(l - 0.5) * s) * l + (1 + sign(l - 0.5)) * s / 2
  // // min = (1 + sign(l - 0.5) * s) * l - (1 + sign(l - 0.5)) * s / 2
  //
  // const halfDiff = (max - min) / 2 // (1 - 2 * abs(l - 0.5)) * s / 2
  // const mean = l // = (max + min) / 2

  // https://www.desmos.com/calculator/zjzs6ow0po
  const min = l ** (1 + s)
  const max = 2 * l - min // = 1 - (1 - l) ** (1 + s)

  const halfDiff = (max - min) / 2
  const mean = l // = (max + min) / 2
  
  const section = floor((h / PI3TH) % 6)  // [0, 1, 2, 3, 4, 5].length === (360°/60°) sections
  const k = 1 - (2 * (section % 2)) // ///// [+, -, +, -, +, -]
  
  // https://www.desmos.com/calculator/cudn0wmlwk
  const theta = h - PI6TH
  const R = () => mean + k * halfDiff * SQRT3 * tan(theta - PI3TH) // = ((g + b) - (g - b) * SQRT3 * tan(theta -
                                                                    // PI3TH)) / 2
  const G = () => mean + k * halfDiff * SQRT3 * tan(theta) // /////// = ((b + r) - (b - r) * SQRT3 * tan(theta)) / 2
  const B = () => mean + k * halfDiff * SQRT3 * tan(theta + PI3TH) // = ((r + g) - (r - g) * SQRT3 * tan(theta +
                                                                    // PI3TH)) / 2
  
  const rgb = [
    () => ({r: max, g: G(), b: min}), // section-0: [000°, 060°) // h6: [0, 1)
    () => ({r: R(), g: max, b: min}), // section-1: [060°, 120°) // h6: [1, 2)
    () => ({r: min, g: max, b: B()}), // section-2: [120°, 180°) // h6: [2, 3)
    () => ({r: min, g: G(), b: max}), // section-3: [180°, 240°) // h6: [3, 4)
    () => ({r: R(), g: min, b: max}), // section-4: [240°, 300°) // h6: [4, 5)
    () => ({r: max, g: min, b: B()}), // section-5: [300°, 360°) // h6: [5, 6)
  ][section]()

  return new RGBColor(rgb)
}

/**
 * @see https://www.had2know.org/technology/hsv-rgb-conversion-formula-calculator.html
 * @see https://www.rapidtables.com/convert/color/rgb-to-hsl.html
 * @returns {*} An array of shape **`[h, s, v]`** that its `h` value is in `[0, 2𝜋)` interval and its `s` and `v` are
 *   in `[0, 1]` interval. Also, represented as **`{h, s, v/b}`** (`h∈[0, 2𝜋)` and `s,v,b∈[0, 1]`) and as **`{hue,
 *   saturation, value/brightness}`** (`hue∈[0, 359]` and `saturation,value,brightness∈[0, 100]`)
 */
export function rgbToHsv({r, g, b}: RGBColor) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const v = max
  const s = max && 1 - min / max
  const delta = max - min
  const h12 = delta && (
    max === r
    ? (g - b) / delta % 6
    : max === g
      ? (b - r) / delta + 2
      : (r - g) / delta + 4
  )
  const h = h12 * PI / 3
  const hsvColor = [h, s, v]
  const [hue, saturation, value] = [h12 * 60, s * 100, v * 100].map(round)
  return Object.assign(hsvColor, {h, s, v, b: v, hue, saturation, value, brightness: value})
}

/**
 * @param channels
 * @param channels.hue The **hue** value in degrees
 * @param channels.saturation The percentage of **saturation**
 * @param channels.value The percentage of **value**
 */
export function hsvToRgb({hue, saturation, value}: { hue: number, saturation: number, value: number }): RGBColor
/**
 * @param channels
 * @param channels.h An alternative **hue** value, but in radians
 * @param channels.s An alternative **saturation** value, but as a number in `[0, 1]` interval
 * @param channels.v An alternative **value** value, but as a number in `[0, 1]` interval
 */
export function hsvToRgb({h, s, v}: { h: number, s: number, v: number }): RGBColor
/** @see https://www.had2know.org/technology/hsv-rgb-conversion-formula-calculator.html */
export function hsvToRgb({
                           saturation = 0,
                           value = 0,
                           h = 0,
                           hue = h * RAD_TO_DEG_RATIO,
                           s = saturation / 100,
                           v = value / 100,
                         }: { hue?: number, saturation?: number, value?: number, h?: number, s?: number, v?: number } = {}) {
  const mM = v * 255
  const m = mM * (1 - s)
  const h6 = (hue / 60) % 6 // [0, 6)
  const z = (mM - m) * (1 - abs(h6 % 2 - 1))
  const zm = z + m
  return new RGBColor(
    [
      {red: mM, green: zm, blue: m}, // section-0: [000°, 060°) // h6: [0, 1)
      {red: zm, green: mM, blue: m}, // section-1: [060°, 120°) // h6: [1, 2)
      {red: m, green: mM, blue: zm}, // section-2: [120°, 180°) // h6: [2, 3)
      {red: m, green: zm, blue: mM}, // section-3: [180°, 240°) // h6: [3, 4)
      {red: zm, green: m, blue: mM}, // section-4: [240°, 300°) // h6: [4, 5)
      {red: mM, green: m, blue: zm}, // section-5: [300°, 360°) // h6: [5, 6)
    ][floor(h6)], // `floor(h6)` => [0, 1, 2, 3, 4, 5] // length === (360°/60°) sections
  )
}

/**
 * @see https://www.rapidtables.com/convert/color/rgb-to-hsl.html
 * @returns {*} An array of shape **`[h, s, l]`** that its `h` value is in `[0, 2𝜋)` interval and its `s` and `l` are
 *   in `[0, 1]` interval. Also, represented as **`{h, s, l}`** (`h∈[0, 2𝜋)` and `s,l∈[0, 1]`) and as **`{hue,
 *   saturation, lightness}`** (`hue∈[0, 359]` and `saturation,lightness∈[0, 100]`)
 */
export function rgbToHsl({r, g, b}: RGBColor) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const delta = max - min
  const s = delta && delta / (1 - abs(2 * l - 1)) // if the denominator is zero => `delta === 0`!
  const h12 = delta && (
    max === r
    ? (g - b) / delta % 6
    : max === g
      ? (b - r) / delta + 2
      : (r - g) / delta + 4
  )
  const h = h12 * PI3TH
  const hslColor = [h, s, l]
  const [hue, saturation, lightness] = [h12 * 60, s * 100, l * 100].map(round)
  return Object.assign(hslColor, {h, s, l, hue, saturation, lightness})
}
