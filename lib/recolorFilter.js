/**
 * Created on 1401/6/19 (2022/9/10).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import Color from './Color.js'

/**
 * @see https://stackoverflow.com/a/62880368/5318303
 * @param color
 * @returns {string}
 */
export default function recolorFilter (color) {
  const [r, g, b, a] = new Color(color).rgb.map(round3)
  const recolorSvg = RECOLOR_SVG_TEMPLATE.replace('R', r).replace('G', g).replace('B', b).replace('A', a)
  return `url('data:image/svg+xml;utf8,${recolorSvg}#recolor')`
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix
 */
const RECOLOR_SVG_TEMPLATE = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <filter id="recolor">
      <feColorMatrix type="matrix" values="
        0 0 0 0 R
        0 0 0 0 G
        0 0 0 0 B
        0 0 0 A 0
      "/>
    </filter>
  </svg>
`.replaceAll(/\s*\n\s*/g, '') // Remove unnecessary white-spaces
  .replaceAll(/[RGB]/g, '$& ') // Reinsert spaces between matrix rows

const round3 = (x) => String(Math.round((x + Number.EPSILON) * 1000) / 1000)
