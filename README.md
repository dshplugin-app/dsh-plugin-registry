# DSH Plugin Registry

**Discover the right DeepSeek Harness plugins without leaving DSH.**

Search, browse, and compare DeepSeek Harness plugins directly inside the Settings UI. See what a plugin does, how popular it is, what Registry evidence is available, and how to install it — before leaving your current DSH workspace.

[Browse the Registry](https://dshplugin.app/plugins) · [中文文档](./README.zh-CN.md)

<!--
Add the real DSH Plugin Registry screenshot here after the first working build.

![DSH Plugin Registry inside DeepSeek Harness](./docs/images/dsh-plugin-registry.png)
-->

## Find plugins faster

DSH Plugin Registry brings the growing DeepSeek Harness plugin ecosystem directly into DSH.

- **Search the Registry** — find plugins by name, repository, description, and supported capabilities.
- **Browse by category** — explore Vision, UI, Terminal, Developer Tools, Browser, Security, Workflows, Remote Access, and more.
- **Compare before installing** — see GitHub Stars, Registry status, repository state, Security Signals, and Compatibility Evidence.
- **Sort the ecosystem** — browse popular, recently updated, newly indexed, or alphabetically sorted plugins.
- **Copy install commands** — use the installation command collected and verified by the Registry.
- **Open full details** — jump to dshplugin.app for complete plugin intelligence and source information.

## Built for better plugin discovery

Finding a DeepSeek Harness plugin should not require opening dozens of repositories and figuring out what each project actually does.

DSH Plugin Registry gives you a compact view of the information that matters before installation.

**Plugin identity**

Name, repository, plugin type, categories, description, GitHub Stars, and repository availability.

**Registry evidence**

Registry status, Security Signals summary, and Compatibility Evidence collected from the DSH Plugin Registry.

**Installation**

The Registry-provided installation command is shown directly in DSH and can be copied with one click.

DSH Plugin Registry does **not** automatically execute installation commands. You stay in control of what gets installed.

## Full Registry intelligence

The DSH plugin gives you the information needed for fast discovery and comparison.

For deeper research, **Full Details** opens the plugin page on [dshplugin.app](https://dshplugin.app/plugins), where you can explore:

- Plugin overview and capabilities
- Use cases and target users
- Known limitations
- Security Signals and supporting evidence
- Compatibility test results
- Repository activity and provenance
- Related plugins

The plugin and website are designed to work together: quick discovery inside DSH, deeper evidence when you need it.

## Install

> **Pre-release:** the first public npm package will be published after the Registry API and DSH integration complete end-to-end testing.

After release:

```bash
dsh plugin --profile web add dshplugin-registry
```

Then open:

**Settings → Plugin Registry**

No separate account is required.

## Privacy

**No account. No prompts. No workspace files.**

DSH Plugin Registry does not send your prompts, workspace files, model configuration, or installed-plugin list to the Registry.

Only public Registry requests such as search terms, categories, filters, sorting, pagination, and the plugin version are sent to the Registry service.

## How it works

The plugin uses a small host-side proxy so the DSH browser client only talks to its own host:

```text
DeepSeek Harness
      │
      ▼
Plugin Registry UI
      │
      │ same-origin
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

Search and filtering are handled server-side. The plugin does not need to download the entire Registry, so the same client architecture can continue to work as the ecosystem grows.

## Development

Requirements:

- Node.js
- pnpm
- A DeepSeek Harness development environment

Install dependencies and validate the project:

```bash
pnpm install
pnpm check
```

The production plugin uses:

```text
https://api.dshplugin.app
```

For local integration testing, the Registry API base URL can be overridden in the DSH host environment:

```bash
DSH_PLUGIN_REGISTRY_API_BASE=http://localhost:3000
```

## Links

- Registry: https://dshplugin.app/plugins
- Website: https://dshplugin.app
- GitHub: https://github.com/dshplugin-app/dsh-plugin-registry

## License

MIT
