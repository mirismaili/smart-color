/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import RGBColor from './RGBColor.js'

/** @see https://stackoverflow.com/a/56678483/5318303 */
export const colorLuminance = ({r, g, b}: RGBColor) =>
  0.2126 * linearizeRGB(r) + 0.7152 * linearizeRGB(g) + 0.0722 * linearizeRGB(b)

export const perceivedLightness = (rgbColor: RGBColor) =>
  perceivableLightness(colorLuminance(rgbColor))

export const perceivableLightness = (digitalLum: number) =>
  digitalLum > 216 / 24389 ? 1.16 * digitalLum ** (1 / 3) - 0.16 : digitalLum * (24389 / 2700)
export const perceivableLightnessToLuminance = (perceivedLum: number) =>
  perceivedLum > 216 / 2700 ? ((perceivedLum + 0.16) / 1.16) ** 3 : perceivedLum * (2700 / 24389)

export const linearizeRGB = (v: number) => v > 0.04045 ? ((v + 0.055) / 1.055) ** 2.4 : v / 12.92
export const deLinearizeRGB = (v: number) => v > 0.04045 / 12.92 ? v ** (1 / 2.4) * 1.055 - 0.055 : v * 12.92
