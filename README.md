Darwin Award<br>
One of the most likely candidates

[BLOG](https://jiangxue.org/~ritsu) - [SECURITY](https://hackerone.com/iepn) - [DESIGN](https://www.behance.net/1ui) - [STEAM](http://steamcommunity.com/profiles/76561199761586064)

## 本地开发

使用 Node.js 22 LTS（本次验证为 22.23.4）和 pnpm 10.32.1。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm test        # 流程图、异步交互、运行时和开发工具回归
pnpm test:dev    # 依赖预编译和代理断连回归
pnpm generate    # 静态站点输出到 .output/public
pnpm perf:report # 统计已生成的资源与页面数据大小
```

优化内容、测量口径与回归结果见 [性能优化记录](docs/performance.md)。

Node.js 22 / pnpm 下的启动警告修复与依赖补丁说明见 [开发环境兼容修复](docs/development.md)。
