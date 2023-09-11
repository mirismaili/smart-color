/**
 * Created on 1401/6/22 (2022/9/13).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import RGBColor from './RGBColor.js'

// The below customization should happen in "RGBColor.js" file itself. But, webpack (until v5.74.0) has some issues
// with
// it. So we pull it out here and now, node.js users should import this file separately (in addition to "RGBColor.js")
// if they want custom inspection. :(
//
// The first webpack bug is the issue with "node:" scheme/prefix. See: https://github.com/webpack/webpack/issues/14166.
// (Here is a workaround for it: https://github.com/webpack/webpack/issues/13290#issuecomment-987880453)
//
// But the harder bug is the issue with top-level `await` for any dynamic `import`! This causes HANGING dev-server on
// code changes (instead of hot-reload)!

await import('node:util').then((util) => {
  // @ts-expect-error
  RGBColor.prototype[util.inspect.custom] = function () { return this.toString() }
}).catch(() => {}) // Ignore `import` error to sure it works properly in both node and browser environments
