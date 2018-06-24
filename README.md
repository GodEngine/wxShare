# 运营活动

## 技术栈
- ES6
- Babel
- Webpack2
- React Stack
  - Preact
  - React DOM
  - React Router DOM
- SCSS
- Unit Test
  - Karma
  - Jasmine
  - Enzyme
  - PhantomJS
- E2E Test
  - Nightwatch
- API
  - [apidoc](https://github.com/apidoc/apidoc)

## NPM Scripts
- `npm run dev` 开发
- `npm run build` 编译
- `npm run test:unit` 单元测试 使用 PhantomJS 容器（执行1次单元测试并退出）
- `npm run test:unit:watch` 单元测试 使用 PhantomJS 容器（挂起，监听修改并重新测试）
- `npm run coverage`   运行一个基于 http-server 的 webServer 来查看单元测试覆盖率

## 目录结构
```javascript
/hd
 - /components // 基于组件化思想，把活动页面通用的部分提出来作为公共组件，开发时可按需引入
 - /constants // 定义全局使用的常量
 - /coverage // 单元测试覆盖率报告
 - /libs // 常用库函数（获取用户详情、handlebars helper 等）
 - /npm-scripts // 交互式的 NPM Scripts
 - /public // Webpack 打包编译后文件存放目录
 - /routes // Koa 路由
 - /SCSS // 通用 SCSS 样式
 - /src // 开发目录
 - /test // 测试（unit、e2e）
 - /utils // 工具函数
 - /views // Koa 模板
 - /webpack // 拆分的 Webpack 任务（若全部写在 webpack.config.js 中，会导致文件臃肿、不便阅读）
 - .babelrc // Babel 配置
 - .eslintrc // ESLint 配置
 - .gitignore // Git 忽略定义
 - CHANGELOG.md // 更新日志
 - karma.conf.js // Karma 配置
 - nightwatch.conf.js // Nightwatch 配置
 - package-lock.json // 锁定 NPM 依赖包的版本
 - package.json // NPM Package JSON
 - postcss.config.js // Post CSS 配置
 - README.md // 说明文档
 - webpack.config.babel.js // Webpack 配置
```

## 开发流程
- 从 master 分支创建你的分支
- cd apps/hd/ 安装依赖 yarn install
- `npm run dev` to coding
- `npm run build` to building
- 测试：push code to `test`
- 上线：create `merge request` from your branch to master
