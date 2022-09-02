/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import o from 'objecter'
import WEB_COLORS from './web-colors.js'

export default class Color {
  #r = 0
  #g = 0
  #b = 0
  #a = 1
  #red = 0
  #green = 0
  #blue = 0
  #alpha = 100
  #alpha255 = 255

  /**
   * @param {RgbInputParams|[number?,number?,number?,number?]|string|number} rgbInputParamsOrRgbArrayOrHexFormatOrRed
   * @param {number} green
   * @param {number} blue
   * @param {number} alpha
   */
  constructor ({
    red = 0, green = 0, blue = 0, alpha = 100, r = red / 255, g = green / 255, b = blue / 255, a = alpha / 100,
  } = {}) { // noinspection JSCheckFunctionSignatures
    this.set(...arguments)
  }

  /**
   * @param {RgbInputParams|[number?,number?,number?,number?]|string|number} rgbInputParamsOrRgbArrayOrHexFormatOrRed
   * @param {number} green
   * @param {number} blue
   * @param {number} alpha
   */
  set ({
    red = 0, green = 0, blue = 0, alpha = 100, r = red / 255, g = green / 255, b = blue / 255, a = alpha / 100,
  } = {}) {
    const input = arguments[0] ?? {r: 0, g: 0, b: 0, a: 1}
    const inputType = typeof input

    if (inputType === 'object') {
      if (input instanceof Array) {
        this.rgb = input
        return this
      }

      this.r = r
      this.g = g
      this.b = b
      this.a = a
      return this
    }

    if (inputType === 'number') { // noinspection JSValidateTypes
      this.RGB = arguments
      return this
    }

    if (inputType !== 'string') throw Error(`Unsupported color format: ${input}`)

    if (input.startsWith('#')) { // hex (`#123456`) format:
      this.hex = input
      return this
    }

    const match = input.match(/^rgba?\s*\(\s*(.+)\s*\)$/i) // https://regex101.com/r/TvtRCL/1
    if (match) { // `rgb[a](...)` format:
      const values = match[1].split(/[ ,/]+/)
      this.RGB = values.slice(0, 3).map(v => +v)
      const aa = values[3]
      if (!aa) this.a = 1
      else if (aa.endsWith('%')) this.alpha = +aa.slice(0, -1)
      else this.a = +aa
      return this
    }

    if (input in WEB_COLORS) {
      this.name = input
      return this
    }
    throw Error(`Unsupported color format: ${input}`)
  }

  get r () { return this.#r }
  get g () { return this.#g }
  get b () { return this.#b }
  get a () { return this.#a }
  get red () { return this.#red }
  get green () { return this.#green }
  get blue () { return this.#blue }
  get alpha () { return this.#alpha }
  get alpha255 () { return this.#alpha255 }
  get rgb () { return [this.#r, this.#g, this.#b, this.#a] }
  get RGB () { return [this.#red, this.#green, this.#blue, this.#alpha] }
  get value () { // `>>> 0` is to make the result unsigned. See: https://stackoverflow.com/a/54030756/5318303
    return (this.#red << 24 >>> 0) + (this.#green << 16) + (this.#blue << 8) + this.#alpha255
  }
  get hex () {
    const hex = this.value.toString(16).padStart(8, '0')
    return this.alpha255 < 255 ? `#${hex}` : `#${hex.slice(0, -2)}`
  }
  get name () {return REVERSE_WEB_COLORS[this.hex]}

  set r (r) {
    this.#r = r
    this.#red = Math.round(r * 255)
  }
  set g (g) {
    this.#g = g
    this.#green = Math.round(g * 255)
  }
  set b (b) {
    this.#b = b
    this.#blue = Math.round(b * 255)
  }
  set a (a) {
    this.#alpha = Math.round(a * 100)
    this.#a = a
    this.#alpha255 = Math.round(a * 255)
  }
  set red (red) {
    this.#r = red / 255
    this.#red = red
  }
  set green (green) {
    this.#g = green / 255
    this.#green = green
  }
  set blue (blue) {
    this.#b = blue / 255
    this.#blue = blue
  }
  set alpha (alpha) {
    this.#a = alpha / 100
    this.#alpha = alpha
    this.#alpha255 = Math.round(this.#a * 255)
  }
  set alpha255 (alpha255) {
    this.#a = alpha255 / 255
    this.#alpha255 = alpha255
    this.#alpha = Math.round(this.#a * 100)
  }
  set rgb ([r, g, b, a]) {
    if (typeof r === 'number') this.r = r
    if (typeof g === 'number') this.g = g
    if (typeof b === 'number') this.b = b
    if (typeof a === 'number') this.a = a
  }
  set RGB ([red, green, blue, alpha]) {
    if (typeof red === 'number') this.red = red
    if (typeof green === 'number') this.green = green
    if (typeof blue === 'number') this.blue = blue
    if (typeof alpha === 'number') this.alpha = alpha
  }
  set value (value) { // https://jsben.ch/ZJB9W
    this.alpha255 = value % 0x100
    this.blue = (value >>>= 8) % 0x100
    this.green = (value >>>= 8) % 0x100
    this.red = (value >>> 8) % 0x100
  }
  set hex (hexFormatColor) {
    let hex = hexFormatColor.slice(1)
    // noinspection FallThroughInSwitchStatementJS
    switch (hex.length) { // #123 | #1234 | #123456 | #12345678
      case 3:
        hex += 'f' // default `alpha`
      case 4:
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        break
      case 6:
        hex += 'ff' // default `alpha`
      case 8:
        break
      default:
        throw Error(`Unsupported color format (${hexFormatColor}). The length of hex string must be 3 or 4 or 6 or 8.`)
    }
    this.value = parseInt(hex, 16)
  }
  set name (input) {
    const hexFormatColor = WEB_COLORS[input]
    this.value = (parseInt(hexFormatColor.slice(1), 16) << 8 >>> 0) + 0xFF
  }
  
  toString () { // noinspection JSCheckFunctionSignatures
    const hex = this.hex
    const colorName = this.name
  
    return hex + (this.alpha255 < 255
                  ? ` rgb(${this.#red} ${this.#green} ${this.#blue} / ${this.#alpha}%)`
                  : ` rgb(${this.#red} ${this.#green} ${this.#blue})`
    ) + (colorName ? ` "${colorName}"` : '')
  }
}

await import('util').then((util) => {
  Color.prototype[util.inspect.custom] = function () {
    return this.toString()
  }
}).catch(() => {}) // Ignore `import` error to sure it works properly in both node and browser environments

/**
 * @typedef {Object} RgbInputParams
 * @property {number} [red=0] An integer in `[0, 255]` interval
 * @property {number} [green=0] An integer in `[0, 255]` interval
 * @property {number} [blue=0] An integer in `[0, 255]` interval
 * @property {number} [alpha=0] An integer in `[0, 100]` interval
 * @property {number} [r=red/255] An alternative for **red** channel as a number in `[0, 1]` interval
 * @property {number} [g=green/255] An alternative for **green** channel as a number in `[0, 1]` interval
 * @property {number} [b=blue/255] An alternative for **blue** channel as a number in `[0, 1]` interval
 * @property {number} [a=alpha/100] An alternative for **alpha** channel as a number in `[0, 1]` interval
 */

const REVERSE_WEB_COLORS = o(WEB_COLORS).flip().o
