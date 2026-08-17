# DSH Plugin Registry

**直接在 DeepSeek Harness 里发现更合适的插件。**

无需离开 DSH，就可以搜索、浏览和比较 DeepSeek Harness 插件。在安装之前了解插件是做什么的、社区关注度如何、Registry 收集到了哪些证据，以及应该如何安装。

[浏览插件 Registry](https://dshplugin.app/zh/plugins) · [English](./README.md)

<!--
首个可运行版本完成后，在这里加入真实的 DSH Plugin Registry 截图。

![DeepSeek Harness 中的 DSH Plugin Registry](./docs/images/dsh-plugin-registry.png)
-->

## 更快找到需要的插件

DSH Plugin Registry 将不断增长的 DeepSeek Harness 插件生态直接带进 DSH。

- **搜索插件** —— 按插件名称、仓库、描述和支持能力查找插件。
- **按分类浏览** —— 浏览 Vision、UI、Terminal、Developer Tools、Browser、Security、Workflows、Remote Access 等分类。
- **安装前比较** —— 查看 GitHub Stars、Registry 状态、仓库状态、安全信号和兼容性证据。
- **多种排序方式** —— 按热门、最近更新、最新收录或名称浏览插件。
- **复制安装命令** —— 直接复制 Registry 收集并确认的插件安装命令。
- **查看完整详情** —— 前往 dshplugin.app 查看更加完整的插件信息和来源证据。

## 为插件发现而设计

寻找一个 DeepSeek Harness 插件，不应该意味着打开十几个 GitHub 仓库，然后逐个判断它们到底能做什么。

DSH Plugin Registry 会把安装前真正有用的信息整理到一个紧凑的界面中。

**插件信息**

插件名称、代码仓库、插件类型、分类、简介、GitHub Stars 和仓库可用状态。

**Registry 证据**

Registry 状态、安全信号摘要，以及 DSH Plugin Registry 收集到的兼容性证据。

**安装**

插件的安装命令会直接显示在 DSH 中，可以一键复制。

DSH Plugin Registry **不会自动执行安装命令**，最终安装什么插件仍然由你自己决定。

## 更完整的 Registry 信息

DSH 插件主要负责快速发现和比较。

点击 **Full Details / 完整详情** 后，会进入 [dshplugin.app](https://dshplugin.app/zh/plugins) 的对应插件页面，在那里可以进一步查看：

- 插件介绍与核心能力
- 使用场景和适用用户
- 已知限制
- 安全信号及对应证据
- 兼容性测试结果
- 仓库活跃度与来源信息
- 相关插件

插件与网站承担不同角色：**DSH 内快速发现，网站上深入了解。**

## 安装

> **预发布状态：** Registry API 与 DSH 集成完成端到端测试后，会发布第一个公开 npm 版本。

发布后可使用：

```bash
dsh plugin --profile web add dshplugin-registry
```

安装完成后打开：

**Settings → Plugin Registry**

无需注册额外账号。

## 隐私

**无需账号，不上传 Prompt，不上传 Workspace 文件。**

DSH Plugin Registry 不会把你的 Prompt、Workspace 文件、模型配置或已安装插件列表发送给 Registry。

发送到 Registry 服务的只有公开的插件查询请求，例如搜索关键词、分类、筛选条件、排序、分页信息和插件版本。

## 工作方式

插件通过一个很轻的 Host 代理连接 Registry API，DSH 浏览器客户端只与自己的 Host 通信：

```text
DeepSeek Harness
      │
      ▼
Plugin Registry UI
      │
      │ 同源请求
      ▼
DSH Plugin Registry Host
      │
      │ HTTPS
      ▼
api.dshplugin.app
      │
      ▼
DSH Plugin Registry
```

搜索和筛选在服务端完成，因此客户端不需要下载完整插件目录。即使未来 Registry 从几百个插件增长到几千、几万个，插件本身的工作方式也不需要改变。

## 开发

环境要求：

- Node.js
- pnpm
- DeepSeek Harness 开发环境

安装依赖并检查项目：

```bash
pnpm install
pnpm check
```

生产环境默认访问：

```text
https://api.dshplugin.app
```

本地联调时，可以在 DSH Host 环境覆盖 Registry API 地址：

```bash
DSH_PLUGIN_REGISTRY_API_BASE=http://localhost:3000
```

## 相关链接

- Plugin Registry: https://dshplugin.app/zh/plugins
- Website: https://dshplugin.app
- GitHub: https://github.com/dshplugin-app/dsh-plugin-registry

## License

MIT
