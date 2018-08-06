# bite-log

[![Build Status](https://travis-ci.org/lisaychuang/bite-log.svg?branch=master)](https://travis-ci.org/lisaychuang/bite-log)
[![Version](https://img.shields.io/npm/v/bite-log.svg)](https://www.npmjs.com/package/bite-log)

A bite size (2KB) colorful and tagged logger for Node.js and browsers!

## 🛠Installation

```sh
npm install --save bite-log
```

Once installed, import the library in your JS files:

```js
import Logger from 'bite-log';
```

## 4️⃣Default Levels

`bite-log` supports four methods in the debugging console (e.g. the [Web Console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console) in browsers):

- console.error()
- console.warn()
- console.log()
- console.debug()

You can specify the default level of messages to display in output:

```js
import Logger from 'bite-log';

const myLogger = new Logger(Level.warn); // display error and warnings
const myLogger = new Logger(Level.debug); // display all messages
```

## 🎨Colors and Text Styles

### 2️⃣text sizes:

- big (1.5em)
- huge (2em)

### 5️⃣ text styles:

- bold
- italic
- overline
- underline
- strikethrough

### 1️⃣4️⃣1️⃣ colors

`bite-log` supports 141 [web safe colors](https://en.wikipedia.org/wiki/Web_colors) to be used for text color and background color styling.

See the [complete list of supported colors here.](https://github.com/lisaychuang/bite-log/blob/master/src/colors.ts)

## 📌Usage

### Apply text color

Apply font color with camelcase `color` names:

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.darkGreen.log('A green message! Hurray!');
myLogger.crimson.warn('A crimson warning');
myLogger.deepSkyBlue.debug('STOP! Debug time');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-text-colors">
      <img width=50% src='https://i.imgur.com/qA8DpMT.png' />
    </a>
</p>
<p align='center'>
  ⏩Click on the image for an interactive text color example
</p>

### Apply background colors

Apply background colors by prepending `bg` to camelcase `color` names:

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.bgGold.warn('Bright gold warning!');
myLogger.bgSalmon.error('ERROR! undefined variable');
myLogger.bgChartreuse.debug('Debug session starts here');
myLogger.bgViolet.log('All tests passed');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-background-colors">
      <img width=50% src='https://i.imgur.com/86pHFTi.png' />
    </a>
</p>
<p align='center'>
   ⏩Interactive background color example
</p>

### Apply text styles

Style text with `style` names:

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.underline.warn('An underlined warning');
myLogger.bold.debug('BOLD for extra attention!');
myLogger.italic.debug('Note to self -->>>>>>');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-text-styles">
      <img width=50% src='https://i.imgur.com/porZrlC.png' />
    </a>
</p>
<p align='center'>
   ⏩Interactive text style example
</p>

### Apply text sizes

Change font size with `size` names:

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.log('Regular text');
myLogger.big.warn('Big warning');
myLogger.huge.error('Look out! An error');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-text-sizes">
      <img width=50% src='https://i.imgur.com/mLW5Oy4.png' />
    </a>
</p>
<p align='center'>
   ⏩Interactive text size example
</p>

### Apply multiple colors and styles

You can combine colors, background colors, text style and size by chaining them together!

#### One style combination

You can apply the same styles to your entire message:

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.bgYellow.italic.error('Error! Try again');
myLogger.deepPink.huge.underline.warn('You can"t miss this warning msg!');
myLogger.bgBlack.white.big.bold.log('Check out this Dark theme in my console');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-chained-styles">
      <img width=70% src='https://i.imgur.com/G98gZeK.png' />
    </a>
</p>
<p align='center'>
   ⏩Interactive combined color and styles example
</p>

#### Multple style combinations applied to text segments

You can also divide a message into multiple segments, and apply a different style combination to each segment.

Pass each text segment into `.txt()`, and pass the final text segment into one of the [four logger methods](https://github.com/lisaychuang/bite-log/blob/master/README.md#level):

```js
import Logger, { Level } from 'bite-log';

const myLogger = new Logger(Level.debug);

myLogger.bgYellow.italic.huge
  .txt('ERROR:')
  .blue.big.txt(' Typescript tests have failed..')
  .red.bold.error(' Stacktrace this error below ⬇️');
```

<p align='center'>
    <a href="https://stackblitz.com/edit/bite-log-chained-styles-text-segments">
      <img width=70% src='https://i.imgur.com/8pvwDyu.png' />
    </a>
</p>
<p align='center'>
   ⏩Interactive text segment styling example
</p>

## 🏷Adding Prefixes / Tags

## 🖍Custom styles

## 🤩Contributing

Bug reports and pull requests are welcome on GitHub at [bite-log repo](https://github.com/lisaychuang/bite-log), please open Issues to provide feedback.

This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://github.com/ContributorCovenant/contributor_covenant) code of conduct.

## 📗License

This library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
