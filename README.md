# bite-log

[![Build Status](https://travis-ci.org/lisaychuang/bite-log.svg?branch=master)](https://travis-ci.org/lisaychuang/bite-log)
[![Version](https://img.shields.io/npm/v/bite-log.svg)](https://www.npmjs.com/package/bite-log)

A bite size colorful and tagged logger for Node.js and browsers!

## Installation

```sh
npm install --save bite-log
```

Once installed, you can import the library in your JS files:

```js
import Logger from 'bite-log';
```

## Level

`bite-log` supports four methods in the debugging console (e.g. the [Web Console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console) in browsers):

- console.error()
- console.warn()
- console.log()
- console.debug
  error = 1,
  warn = 2,
  log = 3,
  debug = 4

## Colors and Text Styles

`bite-log` supports 141 [web safe colors](https://en.wikipedia.org/wiki/Web_colors) to be used for text color and background color styling. See the [complete list of supported colors here.](https://github.com/lisaychuang/bite-log/blob/master/src/colors.ts)

### This includes standard HTML colors:

- white
- silver
- gray
- black
- red
- maroon
- yellow
- olive
- lime
- green
- aqua
- teal
- blue
- navy
- fuchsia
- purple

### Five text styles:

- bold
- italic
- overline
- underline
- strikethrough

### Two text size variations:

- big (1.5em)
- huge (2em)

## Usage

### Apply font color

Apply font color with camelcase `color` names, for example:

```js
myLogger.darkGreen.log('Forest of green trees');
```

### Apply background colors

Apply background colors by prepending `bg` to camelcase `color` names, for example:

```js
myLogger.bgCrimson.warn('Warning!');
```

### Apply text styles

Style text with `style` names, for example:

```js
myLogger.underline.warn('An underlined msg');
myLogger.bold.debug('Extra attention!');
```

### Apply text sizes

Change font size with `size` names, for example:

```js
myLogger.debug('Just another bug'); // regular console font size
myLogger.big.warn('Bigger warning');
myLogger.huge.error('Look out! An error');
```

### Apply multiple colors and styles

You can combine colors, background colors, text style and size by chaining them together!

#### One style combination

You can apply the same styles to your entire message:

```js
myLogger.bgDarkBlue.white.italic.big.log('This is pretty cool');
```

#### Different style combination applied to text segments

Or you can divide your message into segments, and apply a different style combination to each segment.

```js
myLogger.bgRed.white.txt('Error:').bold.error(' Stop and review your code!');
```

## Adding Prefixes / Tags

## Custom styles

## Contributing

Bug reports and pull requests are welcome on GitHub at [bite-log repo](https://github.com/lisaychuang/bite-log), please open Issues to provide feedback.

This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://github.com/ContributorCovenant/contributor_covenant) code of conduct.

## License

This library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
