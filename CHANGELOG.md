# Changelog

## [0.15.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.14.0...v0.15.0) (2025-06-06)


### Features

* migrate `stable-hash` to `stable-hash-x` ([0ee9d28](https://github.com/9romise/eslint-import-resolver-oxc/commit/0ee9d28c26407c2b65718c0cb0e494bb60d8e906))
* treat `oxc-resolver` as peerDependency ([2a396f2](https://github.com/9romise/eslint-import-resolver-oxc/commit/2a396f2f5ea8e0ce01415ed72dc7fff811490638))


### Performance

* remove unnecessary hash cache ([4cc59a0](https://github.com/9romise/eslint-import-resolver-oxc/commit/4cc59a0ef0f19ea5cb1856fd67023559606ee73f))

## [0.14.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.13.2...v0.14.0) (2025-05-08)


### Features

* update `oxc-resolver` to ^8.0.0 ([d2de3f1](https://github.com/9romise/eslint-import-resolver-oxc/commit/d2de3f166b8c2ab3c1ce085bc7c7e4174983fea9))

## [0.13.2](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.13.1...v0.13.2) (2025-04-22)


### Bug Fixes

* update `oxc-resolver` to ^5.3.0 ([a467655](https://github.com/9romise/eslint-import-resolver-oxc/commit/a467655ea9d40eaf6942ed5781768d759be1afe0))

## [0.13.1](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.13.0...v0.13.1) (2025-03-13)


### Performance

* faster hashing for config object ([#73](https://github.com/9romise/eslint-import-resolver-oxc/issues/73)) ([9f18801](https://github.com/9romise/eslint-import-resolver-oxc/commit/9f188010ec81a69fcadf46db1b36566b18f80ef8))

## [0.13.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.12.0...v0.13.0) (2025-03-11)


### Features

* update `oxc-resolver` to ^5.0.0 ([f3926bc](https://github.com/9romise/eslint-import-resolver-oxc/commit/f3926bc0a1912f916bf34f17b479ac3f07bbbdc8))


### Bug Fixes

* export typings ([862dbdb](https://github.com/9romise/eslint-import-resolver-oxc/commit/862dbdbba7977af2a036e6bf46f1a1e13c870e09))
* remove querystring from module id ([9dac236](https://github.com/9romise/eslint-import-resolver-oxc/commit/9dac236e60b578cd595fcf82a099e1331d4c8850))

## [0.12.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.11.0...v0.12.0) (2025-02-19)


### Features

* update `oxc-resolver` to ^4.2.0 ([34a5ec0](https://github.com/9romise/eslint-import-resolver-oxc/commit/34a5ec0790b89ccf8df91bc49a9a1200e214d576))

## [0.11.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.10.1...v0.11.0) (2025-02-16)


### Features

* bump `oxc-resolver` to ^4.1.0 ([4a49f77](https://github.com/9romise/eslint-import-resolver-oxc/commit/4a49f777b699701ac1a7f3d6c745ebe1a561e0e7))


### Bug Fixes

* export `transformRspackConfig` ([68b0d11](https://github.com/9romise/eslint-import-resolver-oxc/commit/68b0d113ad6d912cd8b58643a25b3b0b6a2ae24b))

## [0.10.1](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.10.0...v0.10.1) (2025-01-23)


### Bug Fixes

* respect `rspack` default options ([97ea404](https://github.com/9romise/eslint-import-resolver-oxc/commit/97ea404518955c584a76aba55277c00a868f453d))

## [0.10.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.9.1...v0.10.0) (2025-01-23)


### Features

* experimental support for `rspack` ([#60](https://github.com/9romise/eslint-import-resolver-oxc/issues/60)) ([2ba9968](https://github.com/9romise/eslint-import-resolver-oxc/commit/2ba9968bdfc24ac5dd7fa0eed09e667989575bac))
* update `oxc-resolver` to v4.0.0 ([76e3ef5](https://github.com/9romise/eslint-import-resolver-oxc/commit/76e3ef5985cf4d165183aa605cbe1af64029771e))

## [0.9.1](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.9.0...v0.9.1) (2025-01-20)


### Bug Fixes

* dynamic import optional peerDependency ([#59](https://github.com/9romise/eslint-import-resolver-oxc/issues/59)) ([045970f](https://github.com/9romise/eslint-import-resolver-oxc/commit/045970fec7847af70e3284d255782ed7e66d7ac9))

## [0.9.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.8.0...v0.9.0) (2025-01-18)


### Features

* experimental support for `vite.config` ([#52](https://github.com/9romise/eslint-import-resolver-oxc/issues/52)) ([5a8d8a9](https://github.com/9romise/eslint-import-resolver-oxc/commit/5a8d8a9c9aba348efb602eaab000a0bfe53b8d4c))
* experimental support for `webpack` ([#56](https://github.com/9romise/eslint-import-resolver-oxc/issues/56)) ([1bc1f7c](https://github.com/9romise/eslint-import-resolver-oxc/commit/1bc1f7c5a5e16464768dddf7053d0e746a6c0feb))
* introduce `createOxcImportResolverAsync` ([2800396](https://github.com/9romise/eslint-import-resolver-oxc/commit/2800396f033187d46533344bde5348c4d422c9d8))


### Chores

* separate bundler test cases ([1b27e25](https://github.com/9romise/eslint-import-resolver-oxc/commit/1b27e256e8bd0631603c4c53515968129dc6480a))

## [0.8.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.7.0...v0.8.0) (2025-01-02)


### Features

* bump `oxc-resolver` to 3.0.3 ([9c26f6c](https://github.com/9romise/eslint-import-resolver-oxc/commit/9c26f6cab7b4e193494f2c9a027cf1d2baf73ef2))


### Chores

* optimize unit tests ([5eeb2b6](https://github.com/9romise/eslint-import-resolver-oxc/commit/5eeb2b6cd6f5cf64e0a4f6828a1fa13f794a0406))

## [0.7.0](https://github.com/9romise/eslint-import-resolver-oxc/compare/v0.6.0...v0.7.0) (2024-12-20)


### Features

* auto-detect `jsconfig` at root ([#46](https://github.com/9romise/eslint-import-resolver-oxc/issues/46)) ([973d147](https://github.com/9romise/eslint-import-resolver-oxc/commit/973d147436adaa220a99471f67297e87ee3123f3))
