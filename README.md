# Maizal
<p align="center"><img width="200"src="maizal.png?raw=true"></p>

> Pronounced like /'māisɔːl/

Promise based modern Javascript framework to use your favourite algorithms on the web and node

[![npm](https://img.shields.io/npm/v/maizal.svg?style=flat-square)](https://www.npmjs.com/package/maizal)
[![Travis (.com)](https://img.shields.io/travis/com/benjides/Maizal.svg?style=flat-square)](https://travis-ci.com/benjides/Maizal)
[![Codecov](https://img.shields.io/codecov/c/github/benjides/maizal/master.svg?style=flat-square)](https://codecov.io/github/benjides/maizal?branch=master)
[![NpmLicense](https://img.shields.io/npm/l/maizal.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## Installing

Using npm:

```bash
$ npm install maizal
```

In the browser
```
<script src="https://unpkg.com/maizal/dist/maizal.min.js"></script>
```

## Usage

Perform a `Breadth-first` search

```js
const maizal = require('maizal');

maizal.bfs({
  initial: {
    position: 1,
  },
  goals: {
    position: 4,
  },
  actions: [
    {
      name: 'right',
      expand: (state) => {
        if (state.position + 1 > 5) return undefined;
        return { position: state.position + 1 };
      },
    },
    {
      name: 'left',
      expand: (state) => {
        if (state.position - 1 < 0) return undefined;
        return { position: state.position - 1 };
      },
    },
  ],
  hash: 'position',
})
.then(results => console.log(results))
.catch(error => console.log(error));
```

Perform a `Dijkstra` search
```js
const maizal = require('maizal');

const config = {
  initial: {
    position: 3,
  },
  goals: {
    position: 4,
  },
  actions: [
    {
      name: 'right',
      cost: 50,
      expand: (state) => {
        if (state.position + 1 > 5) return undefined;
        return { position: state.position + 1 };
      },
    },
    {
      name: 'left',
      expand: (state) => {
        if (state.position - 1 < 0) return undefined;
        return { position: state.position - 1 };
      },
    },
  ],
  hash: 'position',
}

async function solveCorridor() {
  try {
    const results = await maizal.dijkstra(config);
    console.log(results);
  } catch (error) {
    console.error(error);
  }
}
```

> **NOTE:** `async/await` is part of ECMAScript 2017 and is not supported in Internet
> Explorer and older browsers, so use with caution.


## Documentation

The config object

### Initial state

| Type   | Defaults | Optional | Description                 |
|--------|----------|----------|-----------------------------|
| Object |          | false    | Initial state of the search |

Examples
```js
const initial = {
  position: [4, 5],
};

const initial = {
  name: 'myFancyName',
};
```

### Goals

| Type   | Defaults | Optional | Description                 |
|--------|----------|----------|-----------------------------|
| Object \| Array |          | false    | Set of goals states |

Examples
```js
const goals = [
  {
    position: [10, 12],
  },
  {
    position: [4, 2],
  }
];

const goals = {
  height: 200,
};
```

### Actions

| Type   | Defaults | Optional | Description                 |
|--------|----------|----------|-----------------------------|
| Object \| Array |          | false    | Set of actions to take for each new state |

|Key    | Type      | Defaults | Optional | Description                 |
|-------|-----------|----------|----------|-----------------------------|
|name   | String    | 'expand' | true     | Action name |
|cost   | Int       | 1        | true     | Action cost |
|expand | Function  |          | false    | Function that takes a state as argument and returns the data for the following states |

Examples
```js
const actions = [
  {
    expand: (state) => {
      return { position: state.position + 1 };
    }
  },
  {
    expand: (state) => {
      return Promise.resolve({ position: state.position - 1});
    }
  },
  {
    name: 'myFancyAction',
    cost: 80,
    expand: (state) => {
      if(state.height > 90) {
        return;
      }
      return { height: state.height + 10 };
    }
  },
];

```
> **NOTE:** Remember to return `undefined` or simply `return` on forbidden actions to avoid generating infinite states

### Hash

Used to establish when two newly generated states are essentially the same , for example, in a maze going to the left one cell and the returning to the same represents essentially the same state and we do not want that

| Type   | Defaults | Optional | Description                 |
|--------|----------|----------|-----------------------------|
| String\|Function|          | false    | Field or function to determine the equality of two states |

Examples

```js
const hash = 'position';

const hash = 'height';

const hash = (state) => `${state.x},${state.y}`;
```

A better documentation its on the way.

## Engines

Available engines

| Engine        | API      |
|---------------|----------|
| Breadth-first | bfs      |
| Dijkstra      | dijkstra |
| Random-search | random   |
| Depth-first   | dfs      |

## Promises

Maizal depends on a native ES6 Promise implementation to be [supported](http://caniuse.com/promises).
If your environment doesn't support ES6 Promises, you can [polyfill](https://github.com/jakearchibald/es6-promise).

## Name

Maizal comes from the spanish word 'maizal' which basically means 'cornfield'. Cross thinking in different languages I got the idea of a maze solving library and the popular cornfield mazes and therefore maizal as a similar word as maze in spanish.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018
