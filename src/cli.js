#! /usr/bin/env node

/**
 * Created on 1401/6/11 (2022/9/2).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */

import {Command} from 'commander'
import Color from '../lib/Color.js'
import LuminanceInverter from '../lib/luminanceInverter.js'

const program = new Command()

program
  .name('inv-lum')
  .description('Invert the luminance of colors (DARK <===> LIGHT)')
  .version('1.0.0')
  .option('-d, --darkest <color>', 'Set the darkest color\nExamples: "#111" | "#1e1e1e" | "dimgray"', '#000')
  .option('-l, --lightest <color>', 'Set the lightest color\nExamples: "#EEE" | "#F0F0F0" | "white"', '#fff')
  .showHelpAfterError()
  .usage(
    '[options] colors\nExamples:'
    + '\n\tinv-lum #123456 #123 #12345678 #1234'
    + '\n\tinv-lum --darkest=#1e1e1e #414141 #123,#12345678/#1234-#5f9e44, blue , #ff8c00',
  )

program.parse(process.argv)

const options = program.opts()
const {args} = program
const colors = args.map(arg => arg.split(/\s*[,/-]\s*/).map(anArg => anArg.trim())).flat().filter(Boolean)

const luminanceInverter = LuminanceInverter({darkestColor: options.darkest, lightestColor: options.lightest})

console.info(colors.map(color => luminanceInverter(new Color(color)).hex).join('\n'))
