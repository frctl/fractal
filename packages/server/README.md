# Fractal Server

Component API server for Fractal

## Installation

Install from NPM:

```
npm i @frctl/server
```

## Usage

```js
const fractal = require('@frctl/fractal')({
  // fractal config here...
})
const server = require('@frctl/server')(fractal, {
  // opts go here...
});

server.start();
```

## Requirements

* Node >= v7.6
