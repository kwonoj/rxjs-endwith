[![Build Status](https://circleci.com/gh/kwonoj/rxjs-endwith/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/kwonoj/rxjs-endwith/tree/master)
[![codecov](https://codecov.io/gh/kwonoj/rxjs-endwith/branch/master/graph/badge.svg)](https://codecov.io/gh/kwonoj/rxjs-endwith)
[![npm](https://img.shields.io/npm/v/rxjs-endwith.svg)](https://www.npmjs.com/package/rxjs-endwith)

# RxJS-endWith

`rxjs-endWith` provides custom operator `endWith` for RxJS v5, appends specified value at the end of source emission. This operator behaves opposite way of [`startWith`](https://github.com/ReactiveX/rxjs/blob/d2a32f9a18ebbf65bea798f558364571c91a9d79/src/operator/startWith.ts#L33) operator.

This module intended to provide simple, working example of creating custom operator without need of upstream PR to try to change core api surfaces. RxJS v5 and further version tries to reduce core api surface as much and strongly recommend user level custom operator module for extended behaviors. Featurewise, `endWith` can be simply achieved via `concat` operator in most cases so probably won't need to use this module directly. 

Additional detailed walkthrough of creating custom operator can be found at [core repo's guide](https://github.com/ReactiveX/rxjs/blob/master/doc/operator-creation.md) as well as [this post](https://kwonoj.github.io/en/post/rxjs-custom-operator/).  

# Install

This has a peer dependencies of `rxjs@5.*.*`, which will have to be installed as well

```sh
npm install rxjs-endwith
```

# Usage

`rxjs-endWith` does not patch / augment `Observable` directly, instead provide higher order function as `let`-able manner.

```js
import * as Rx from 'rxjs';
import { endWith } from 'rxjs-endwith';

const values = [];
Rx.Observable.of(1, 2, 3).let(endWith(4)).subscribe(values.push.bind(values));

console.log(values); //1,2,3,4
```

Operator's signature is exactly identical to `startWith` and can supply multiple values or schedulers as well.

```js
.let(endWith(4, 5, 6))...
.let(endWith(5, Rx.Scheduler.asap))...
```

# Building / Testing

Few npm scripts are supported for build / test code.

- `build`: Transpiles code to ES5 commonjs to `dist`.
- `build:clean`: Clean up existing build
- `test`: Run unit test. Does not require `build` before execute test.
- `lint`: Run lint over all codebases
- `lint:staged`: Run lint only for staged changes. This'll be executed automatically with precommit hook.
- `commit`: Commit wizard to write commit message