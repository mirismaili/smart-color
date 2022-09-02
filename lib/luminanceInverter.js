/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import NumericalInvFunction from 'num-inv-func/math.js'
import Color from './Color.js'
import {differentiableHslToRgb, rgbToDifferentiableHsl} from './convertors.js'
import {colorLuminance} from './luminance.js'

export default function LuminanceInverter ({darkestColor = '#000', lightestColor = '#fff'} = {}) {
  const leastLum = colorLuminance(new Color(darkestColor))
  const mostLum = colorLuminance(new Color(lightestColor))
  
  return function invertLuminance ({
    red = 0,
    green = 0,
    blue = 0,
    r = red / 255,
    g = green / 255,
    b = blue / 255,
  } = {}) {
    const { // differentiable-hue: A little different from conventional hue:
      h: dH, // See: https://www.desmos.com/calculator/ksrl5six33 & https://www.desmos.com/calculator/cudn0wmlwk
      s,
    } = rgbToDifferentiableHsl({r, g, b})
    const luminance = colorLuminance({r, g, b})
    const lightnessToPerceivedLum = (l) => colorLuminance(differentiableHslToRgb({h: dH, s, l}))
    const luminanceToLightness = NumericalInvFunction(
      lightnessToPerceivedLum,
      [0, 1], 0.0001,
    )
    const invertedPerceivedLum = mostLum + leastLum - luminance
    if (invertedPerceivedLum <= 0) return new Color([0, 0, 0])
    if (invertedPerceivedLum >= 1) return new Color([1, 1, 1])
    const l = luminanceToLightness(invertedPerceivedLum)
    return differentiableHslToRgb({h: dH, s, l})
  }
}
