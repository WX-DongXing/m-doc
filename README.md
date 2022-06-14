<h1 align="center">M-Doc</h1>

<div align="center">
适配 Vue2 项目的方法流程文档工具

![github][github] ![npm][npm] ![jetBrains][jetBrains]
</div>


![preview](./screenshots/preview.gif)


[github]:https://img.shields.io/github/license/WX-DongXing/m-doc
[npm]:https://img.shields.io/npm/v/@wx-xingdong/m-doc?style=flat&logo=npm
[jetBrains]:https://img.shields.io/badge/thanks-JetBrains-%23000?style=flat&logo=jetBrains

## ✨ 特性

- 方法流程记录以及可视化展示
- API 方法自动解析以及生成
- 支持 Markdown 语法进行 API 注释以及描述

## 📦 安装
```bash
yarn add babel-plugin-m-doc @wx-xingdong/m-doc -D
```

## 🧐 Usage

#### 配置 Babel 插件
```javascript
// babel.config.js

const mDocPlugin = require('babel-plugin-m-doc')

module.exports = {
  plugins: [
    mDocPlugin
  ]
}

```

#### 方法标记
使用 `@doc` 进行方法注释标记，仅对标记的方法进行记录，并生成 API 文档

```javascript
// @doc 方法C
const c = () => {
  console.log('c')
}

// @doc 方法B
const b = () => {
  console.log('b')
  c()
}

// @doc 方法A
const a = () => {
  console.log('a')
  b()
  c()
}

// @doc 未命名方法
const noName = () => {
}

/**
 * @doc 主方法
 * @example main()
 */
function main () {
  state.count += 1
  a()
  b()
  c()
  d()
}

/**
 * @doc 进入方法
 */
const entry = () => {
  main()
  noName()
}

/**
 * @doc 减少计数
 * @param a {string} this is a
 * @param b {string} this is b
 * @example reduce(a, b) => 'none'
 * @returns {string} return none
 */
function reduce (a, b) {
  state.count -= 1
  return 'none'
}
```
#### 启动文档服务
命令行输入 `m-doc` 即可开启文档服务
```
m-doc

----------------------------------
[M-Doc] running at:
- Local:   http://localhost:12149/
- Network: http://192.168.0.1:12149/

Use Ctrl+C to close it
```

## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2022 Dong Xing
