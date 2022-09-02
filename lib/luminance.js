/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

/**
 * @see https://stackoverflow.com/a/56678483/5318303
 * @param {import('./Color.js').RgbInputParams} [input={}]
 * @returns {number}
 */
export const colorLuminance = ({red = 0, green = 0, blue = 0, r = red / 255, g = green / 255, b = blue / 255}) =>
  0.2126 * linearizeRGB(r) + 0.7152 * linearizeRGB(g) + 0.0722 * linearizeRGB(b)

export const perceivedLightness = ({red = 0, green = 0, blue = 0, r = red / 255, g = green / 255, b = blue / 255}) =>
  perceivableLightness(colorLuminance({r, g, b}))

export const perceivableLightness = (digitalLum) => digitalLum > 216 / 24389
                                                    ? 1.16 * digitalLum ** (1 / 3) - 0.16
                                                    : digitalLum * (24389 / 2700)
export const perceivableLightnessToLuminance = (perceivedLum) => perceivedLum > 216 / 2700
                                                                 ? ((perceivedLum + 0.16) / 1.16) ** 3
                                                                 : perceivedLum * (2700 / 24389)

export const linearizeRGB = (v) => v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92
export const deLinearizeRGB = (v) => v > 0.04045 / 12.92 ? v ** (1 / 2.4) * 1.055 - 0.055 : v * 12.92
