/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import NumericalInvFunction from 'num-inv-func'
import RGBColor, { HexColor } from './RGBColor.js'
import { differentiableHslToRgb, rgbToDifferentiableHsl } from './convertors.js'
import { colorLuminance } from './luminance.js'

// noinspection JSUnusedGlobalSymbols
export default function LuminanceInverter(
  {darkestColor = '#000', lightestColor = '#fff'}: { darkestColor?: HexColor, lightestColor?: HexColor } = {},
) {
  const leastLum = colorLuminance(new RGBColor(darkestColor))
  const mostLum = colorLuminance(new RGBColor(lightestColor))

  return function invertLuminance(rgbColor: RGBColor) {
    const { // differentiable-hue: A little different from conventional hue:
      h: dH, // See: https://www.desmos.com/calculator/ksrl5six33 & https://www.desmos.com/calculator/cudn0wmlwk
      s,
    } = rgbToDifferentiableHsl(rgbColor)
    const luminance = colorLuminance(rgbColor)
    const lightnessToPerceivedLum = (l: number) => colorLuminance(differentiableHslToRgb({h: dH, s, l}))
    const luminanceToLightness = NumericalInvFunction(
      lightnessToPerceivedLum,
      [0, 1], 0.0001,
    )
    const invertedPerceivedLum = mostLum + leastLum - luminance
    if (invertedPerceivedLum <= 0) return new RGBColor([0, 0, 0])
    if (invertedPerceivedLum >= 1) return new RGBColor([1, 1, 1])
    const l = luminanceToLightness(invertedPerceivedLum)
    return differentiableHslToRgb({h: dH, s, l})
  }
}
