/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import Color from './Color.js'

const {acos, abs, floor, max, min, PI, round, tan} = Math
const SQRT3 = 3 ** 0.5
const PI6TH = PI / 6
const PI3TH = PI / 3
const DEG_TO_RAD_RATIO = PI / 180
const RAD_TO_DEG_RATIO = 180 / PI

/**
 * @see https://stackoverflow.com/a/64090995/5318303
 * @see https://www.30secondsofcode.org/js/s/hsl-to-rgb
 * @see https://jsben.ch/fr0Xt
 * @param {Object} [channels={}] The **hue** value in degrees
 * @param {number} [channels.hue=0] The **hue** value in degrees
 * @param {number} [channels.saturation=0] The percentage of **saturation**
 * @param {number} [channels.lightness=0] The percentage of **lightness**
 * @param {number} [channels.s=saturation/100] An alternative **saturation** value as a number in `[0, 1]` interval
 * @param {number} [channels.l=lightness/100] An alternative **lightness** value as a number in `[0, 1]` interval
 * @returns {Color}
 */
export function hslToRgb0 ({
  hue,
  saturation,
  lightness,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
} = {}) {
  const ll = min(l, 1 - l) // === 0.5 - abs(l - 0.5)
  const sll = s * ll
  return new Color([f(0), f(8), f(4)])
  
  function f (n) {
    const h12 = (n + h / PI6TH) % 12
    const number = min(max(3 - h12, h12 - 9, -1), 1)
    return l + sll * number
  }
}

/**
 * @see https://jsben.ch/fr0Xt
 * @param {Object} [channels={}] The **hue** value in degrees
 * @param {number} [channels.hue=0] The **hue** value in degrees
 * @param {number} [channels.saturation=0] The percentage of **saturation**
 * @param {number} [channels.lightness=0] The percentage of **lightness**
 * @param {number} [channels.s=saturation/100] An alternative **saturation** value as a number in `[0, 1]` interval
 * @param {number} [channels.l=lightness/100] An alternative **lightness** value as a number in `[0, 1]` interval
 * @returns {Color}
 */
export function hslToRgb ({
  hue,
  saturation,
  lightness,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
} = {}) {
  const h12 = (h / PI6TH) % 12 // [0, 12)
  const ll = min(l, 1 - l) // === 0.5 - abs(l - 0.5)
  const sll = s * ll
  return new Color(
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
 * @param {import('./Color.js').RgbInputParams} [input={}]
 * @returns {number} The `hue` value in `[0, 2𝜋)` interval
 */
export function rgbToDifferentiableHsl ({
  red = 0, green = 0, blue = 0, r = red / 255, g = green / 255, b = blue / 255,
} = {}) {
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
  const hslColor = [h, s, l]
  const [hue, saturation, lightness] = [h * RAD_TO_DEG_RATIO, s * 100, l * 100].map(round)
  return Object.assign(hslColor, {h, s, l, hue, saturation, lightness})
}

/**
 * @see https://www.desmos.com/calculator/cudn0wmlwk
 * @param {Object} [channels={}] The **hue** value in degrees
 * @param {number} [channels.hue=0] The **hue** value in degrees
 * @param {number} [channels.saturation=0] The percentage of **saturation**
 * @param {number} [channels.lightness=0] The percentage of **lightness**
 * @param {number} [channels.s=saturation/100] An alternative **saturation** value as a number in `[0, 1]` interval
 * @param {number} [channels.l=lightness/100] An alternative **lightness** value as a number in `[0, 1]` interval
 * @returns {Color}
 */
export function differentiableHslToRgb ({
  hue,
  saturation,
  lightness,
  h = hue * DEG_TO_RAD_RATIO,
  s = saturation / 100,
  l = lightness / 100,
} = {}) {
  let max, min // https://www.desmos.com/calculator/5gjtalpywd
  
  if (l > 0.5) {
    max = l - s * l + s
    min = l + s * l - s
  } else {
    max = l * (1 + s)
    min = l * (1 - s)
  }
  // max = (1 - sign(l - 0.5) * s) * l + (1 + sign(l - 0.5)) * s / 2 
  // min = (1 + sign(l - 0.5) * s) * l - (1 + sign(l - 0.5)) * s / 2 
  
  const diff2nd = (max - min) / 2 // (1 - 2 * abs(l - 0.5)) * s / 2
  const sum2nd = l // = (max + min) / 2
  
  const section = floor((h / PI3TH) % 6)  // [0, 1, 2, 3, 4, 5].length === (360°/60°) sections
  const k = 1 - (2 * (section % 2)) // ///// [+, -, +, -, +, -]
  
  // https://www.desmos.com/calculator/cudn0wmlwk
  const theta = h - PI6TH
  const R = () => sum2nd + k * diff2nd * SQRT3 * tan(theta - PI3TH) // = ((g + b) - (g - b) * SQRT3 * tan(theta -
                                                                    // PI3TH)) / 2
  const G = () => sum2nd + k * diff2nd * SQRT3 * tan(theta) // /////// = ((b + r) - (b - r) * SQRT3 * tan(theta)) / 2
  const B = () => sum2nd + k * diff2nd * SQRT3 * tan(theta + PI3TH) // = ((r + g) - (r - g) * SQRT3 * tan(theta +
                                                                    // PI3TH)) / 2
  
  const rgb = [
    () => ({r: max, g: G(), b: min}), // section-0: [000°, 060°) // h6: [0, 1)
    () => ({r: R(), g: max, b: min}), // section-1: [060°, 120°) // h6: [1, 2)
    () => ({r: min, g: max, b: B()}), // section-2: [120°, 180°) // h6: [2, 3)
    () => ({r: min, g: G(), b: max}), // section-3: [180°, 240°) // h6: [3, 4)
    () => ({r: R(), g: min, b: max}), // section-4: [240°, 300°) // h6: [4, 5)
    () => ({r: max, g: min, b: B()}), // section-5: [300°, 360°) // h6: [5, 6)
  ][section]()
  
  return new Color(rgb)
}

/**
 * @see https://www.had2know.org/technology/hsv-rgb-conversion-formula-calculator.html
 * @see https://www.rapidtables.com/convert/color/rgb-to-hsl.html
 * @param {import('./Color.js').RgbInputParams} [input={}]
 * @returns {[number,number,number]} An array of shape **`[h, s, v]`** that its `h` value is in `[0, 2𝜋)` interval and
 *   its `s` and `v` are in `[0, 1]` interval. Also, represented as **`{h, s, v/b}`** (`h∈[0, 2𝜋)` and
 *   `s,v,b∈[0, 1]`) and as **`{hue, saturation, value/brightness}`** (`hue∈[0, 359]` and
 *   `saturation,value,brightness∈[0, 100]`)
 */
export function rgbToHsv ({red = 0, green = 0, blue = 0, r = red / 255, g = green / 255, b = blue / 255} = {}) {
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
 * @see https://www.had2know.org/technology/hsv-rgb-conversion-formula-calculator.html
 * @param {Object} [channels={}] The **hue** value in degrees
 * @param {number} [channels.hue=0] The **hue** value in degrees
 * @param {number} [channels.saturation=0] The percentage of **saturation**
 * @param {number} [channels.value=0] The percentage of **value**
 * @param {number} [channels.s=saturation/100] An alternative **saturation** value as a number in `[0, 1]` interval
 * @param {number} [channels.v=value/100] An alternative **value** value as a number in `[0, 1]` interval
 * @returns {Color}
 */
export function hsvToRgb ({hue, saturation, value, s = saturation / 100, v = value / 100} = {}) {
  const mM = v * 255
  const m = mM * (1 - s)
  const h6 = (hue / 60) % 6 // [0, 6)
  const z = (mM - m) * (1 - abs(h6 % 2 - 1))
  const zm = z + m
  return new Color(
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
 * @param {import('./Color.js').RgbInputParams} [input={}]
 * @returns {[number,number,number]} An array of shape **`[h, s, l]`** that its `h` value is in `[0, 2𝜋)` interval and
 *   its `s` and `l` are in `[0, 1]` interval. Also, represented as **`{h, s, l}`** (`h∈[0, 2𝜋)` and `s,l∈[0, 1]`) and
 *   as **`{hue, saturation, lightness}`** (`hue∈[0, 359]` and `saturation,lightness∈[0, 100]`)
 */
export function rgbToHsl ({red = 0, green = 0, blue = 0, r = red / 255, g = green / 255, b = blue / 255} = {}) {
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
