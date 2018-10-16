 
## 2.1.0 ( Thu Jul 19 2018 16:53:33 GMT+0200 (CEST) )


## Bug Fixes
  - #147 seperate HTTP and HTTPS requests, important for apps which load both modules (http and https)
  ([78c944cc](https://github.com/keymetrics/pm2-io-apm/commit/78c944cc0b319123405ddfed4bf1f52c95078bc3))
  - #151 add environment variable to force inspector on node 8
  ([ecd0dba4](https://github.com/keymetrics/pm2-io-apm/commit/ecd0dba4dc0152973b3a3c0d0be00c19b9b1ade2))
  - #150 load event loop inspector module only once
  ([27fdf377](https://github.com/keymetrics/pm2-io-apm/commit/27fdf377203eb7a93eb3d625848da30149d320ae))
  - issue with keys function .... I should be tired !
  ([2fedff44](https://github.com/keymetrics/pm2-io-apm/commit/2fedff4405b134d55a94a48e1ffac9e5278cacf0))
  - #148 allow inspector only on node 10, else we can't handle multiple sessions
  ([58043f1b](https://github.com/keymetrics/pm2-io-apm/commit/58043f1bc58f098d6d4edca26a9360f132440941))
  - add precision in test when remove listener
  ([bc14c135](https://github.com/keymetrics/pm2-io-apm/commit/bc14c1353f0dc7063db8ddb206d9dad356f3d001))
  - check fd 1 and 2, can happen with pm2 and fork mode
  ([43cc2403](https://github.com/keymetrics/pm2-io-apm/commit/43cc2403f2b7711ba9501515e900ad90a093fa5b))




## Hot Fixes
  - #145 ensure apm removes all listeners to prevent event loop from running
  ([4ac7f64c](https://github.com/keymetrics/pm2-io-apm/commit/4ac7f64c6c061a1c33c5ab7c5ff4fa370c9bfe5a))
  - do not listen on process message if actions are not used
  ([c416d82f](https://github.com/keymetrics/pm2-io-apm/commit/c416d82f9a1b235308614948ca1701eddf197a20))




## Refactor
  - rename variable and stabilize tests
  ([29e77290](https://github.com/keymetrics/pm2-io-apm/commit/29e7729031439fd630004043be7883a6263be9ac))
  - #145 use event-loop-inspector as native module
  ([714a6ae4](https://github.com/keymetrics/pm2-io-apm/commit/714a6ae437e550bcc9b9a30112bb2ed8f7b83217))




## Test
  - exclude test on node 10 concerning v8-profiler module
  ([6588e431](https://github.com/keymetrics/pm2-io-apm/commit/6588e431d8f4e613079978006d3f4c0062684902))
  - do not install profiler module on node 10, it can break tests
  ([b508a88b](https://github.com/keymetrics/pm2-io-apm/commit/b508a88bc2a727462ea314a026885f5572f31e7b))
  - fix test on node 4/6
  ([e51dfb3e](https://github.com/keymetrics/pm2-io-apm/commit/e51dfb3e82dc9d1ef5cf043f94883dd6e3e5616f))
  - switch profiler module depending on node version
  ([675b7245](https://github.com/keymetrics/pm2-io-apm/commit/675b7245e84f3d9121f9a7bb9a52da3d543ce6b3))
  - clean test
  ([080a5e59](https://github.com/keymetrics/pm2-io-apm/commit/080a5e59ef1ca6f018baadc6c58371c9f55e4f11))
  - improve event loop inspector test
  ([c19b66a4](https://github.com/keymetrics/pm2-io-apm/commit/c19b66a48c3252eee474567cd6d3f902eca8fa4a))
  - try to stabilize test on event loop inspector module
  ([4096c5d5](https://github.com/keymetrics/pm2-io-apm/commit/4096c5d576f5c9ed9e639943bbff20cd2c6eff1a))
  - clean timer and destroy io when test is done
  ([291f3a12](https://github.com/keymetrics/pm2-io-apm/commit/291f3a12da479b7360147cf689e4b9f0b799d0f4))
  - decrease timeout for auto exit
  ([4a0c12d0](https://github.com/keymetrics/pm2-io-apm/commit/4a0c12d06890a00381572ab84a32718eb6e6f87e))
  - increase timeout for auto exit
  ([50579097](https://github.com/keymetrics/pm2-io-apm/commit/50579097176f36e5f282e47bbb8d525abab956e3))
  - align test with unref timers on node 8
  ([0c92b064](https://github.com/keymetrics/pm2-io-apm/commit/0c92b06479f3fd9f2f622cfce288f8a6fcf16c8b))
  - align test with unref timers on node 4/6
  ([9e48c381](https://github.com/keymetrics/pm2-io-apm/commit/9e48c3813139295a831e51d8034a12db06f4d92b))
  - align test with unref timers
  ([ade41be2](https://github.com/keymetrics/pm2-io-apm/commit/ade41be294dd5eb35ea58b411dfba8736b88f2f5))




## Chore
  - upgrade some packages
  ([b4cc2f57](https://github.com/keymetrics/pm2-io-apm/commit/b4cc2f573ea46e0501a5dca1d487315b3c2c13fb))
  - upgrade version to 2.1.0-beta5
  ([012c5868](https://github.com/keymetrics/pm2-io-apm/commit/012c5868c0f47ce54052c05ffbfdbc5022c53237))
  - upgrade version to 2.1.0-beta4
  ([4c0a04b7](https://github.com/keymetrics/pm2-io-apm/commit/4c0a04b778de95afcb2461bc500945a1ccc25302))
  - add publishing section in readme file
  ([522ef26b](https://github.com/keymetrics/pm2-io-apm/commit/522ef26b808a158ffe09363f6a58731cf44bdb62))
  - upgrade version to 2.1.0-beta3
  ([53dcaafa](https://github.com/keymetrics/pm2-io-apm/commit/53dcaafab3b9f721c677d48cf8af13cc11434357))
  - add prepublish hook to auto build sources
  ([a01b5f5d](https://github.com/keymetrics/pm2-io-apm/commit/a01b5f5d5bbdf80e44ebe3368e220e1947aae5f0))
  - update to 2.1.0-beta
  ([03cefe06](https://github.com/keymetrics/pm2-io-apm/commit/03cefe064194e266156001178db5c39a7993f652))
  - add node 10 on CI
  ([f645c69d](https://github.com/keymetrics/pm2-io-apm/commit/f645c69dc88a0506ff9a8a309c690be82ae0b891))




## Branchs merged
  - Merge branch 'master' of github.com:keymetrics/pmx-2
  ([f40e172f](https://github.com/keymetrics/pm2-io-apm/commit/f40e172feeaf235b8a3f85925c185ee68a633799))





