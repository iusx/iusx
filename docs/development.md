# 开发环境兼容修复

适用环境：Node.js 22、pnpm 10、Nuxt 3.11.2。功能、页面样式和 text-flow 的悬停门限不受这些兼容修复影响。

## 依赖与预编译

- 显式声明现有版本的 Vue 3.4.23 / vue-router 4.3.0，满足 Vite 去重时从项目根目录解析的要求。
- Content 2.12 / MDC 0.6 注入的内部依赖采用 Vite 原生的 `所属包 > 依赖` 写法。保留浏览器导出条件，无需开启全局依赖提升。
- 仅在开发客户端配置中提前预编译 `d3`、`three`、`qrcode`，避免首次访问相关页面时追加优化并刷新。生产构建的懒加载分块不变。
- CLI 共享 HTTP 服务处理热更新时，清除旧 Nuxt 随后补入的独立 HMR 端口，让浏览器使用当前页面的端口与协议；保留显式的 `clientPort`。同时兼容默认端口、`--port` 与同源代理。
- 删除九个组件中多余的 Vue 编译宏导入。
- 更新锁文件中的 caniuse-lite 浏览器数据。以后仍需定期更新，不能通过忽略警告永久解决数据过期。

## Node.js 22 的弃用调用

`pnpm.overrides` 将旧 Nuxt CLI 固定为 nuxi 3.12.0，同时只替换 jiti 1.21.0 → 1.21.6、mlly 1.6.1 → 1.7.0。这些版本移除了模块解析失败路径上的 `new fs.Stats()`，保留项目其它依赖使用的 jiti 2.x / mlly 1.8.x。

## 开发代理断连

Nitro 使用的 httpxy 0.1.5 与 nuxi 内嵌副本，会在浏览器刷新关闭连接时将部分 socket 错误作为 Promise 拒绝传播，产生 `unhandledRejection: write ECONNABORTED`。

`patches/` 中的两个 pnpm 补丁仅对**已销毁的下游连接**处理 `ECONNABORTED`、`ECONNRESET`、`EPIPE`，与正常 close 一样完成请求。仍保持打开的连接、未知错误，以及上游连接失败继续拒绝。没有添加全局异常处理器或关闭日志。

补丁已登记到 package.json 和锁文件，`pnpm install --frozen-lockfile` 会自动应用。以后升级 Nuxt/CLI/httpxy 时需重新验证并移除不再需要的覆盖与补丁，不能直接沿用针对旧发布文件的补丁。

## 验证与重启

刷新 JSON 流程图与时间线时，HTML 解析会去掉 NUL 并规范化 CR/CRLF，而客户端原先保留这些不可见字符。显示层现在使用同一规范化函数，避免 hydration 文本不一致；原始 JSON、节点身份、关系与布局计算仍使用原值。

```sh
pnpm test:dev
pnpm test
pnpm generate
```

`test:dev` 使用实际安装的 Vite 预编译十五项依赖，检查浏览器导出解析；并验证 httpxy 的 ESM、CJS 及 nuxi 内嵌代理共六十六个断连/错误传播场景。下游使用真实 Node socket 销毁事件，上游通过实际代理工厂传入的错误回调验证，不需要外网或运行开发服务器。

`pnpm test` 另含显示文本回归：真实 Vue SSR 与 HTML/SVG 解析结果一致，覆盖实际 106 条 JSON 记录中 11 个含控制字符的字段，并确认原始数据未被修改。

2026-10-23 验收：空 Vite 缓存启动无所列警告；首页、设计页、文章页正常，组件 HMR 新增/移除检查标记均到达浏览器；连续刷新不再产生代理异常。文本修复后文章首次渲染无新的浏览器 warning/error，仍显示 16 个代码块与 109 个图节点。静态生成成功输出 115 个路由，无 HTTP 500；生产构建原有的资源解析、分块体积与 cache-driver 提示仍保留。

安装更新后，应在旧开发终端按 `Ctrl+C`，再运行 `pnpm dev`，让已经加载到内存中的旧 CLI 和依赖退出。
