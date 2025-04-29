---
title: UV 使用指南
---

## 安装 UV

### macOS 和 Linux

使用 `curl` 下载脚本并安装

`curl -LsSf https://astral.sh/uv/install.sh | sh`

也可以使用 `wget`

`wget -qO- https://astral.sh/uv/install.sh | sh`

### Windows

使用 `irm` 下载脚本并通过 `iex` 安装

`powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`

更改 [执行策略](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) 后即可运行来自互联网的脚本。

### PyPI

为方便起见，uv 已发布至 [PyPI](https://pypi.org/project/uv/)。

从 PyPI 安装时，建议将 uv 安装到隔离环境中，例如使用 `pipx`：

`pipx install uv`

当然，也可以直接使用 `pip`：

`pip install uv`

### [Homebrew](https://hellowac.github.io/uv-zh-cn/getting-started/installation/#homebrew)

uv 已包含在 Homebrew 的核心包中。

`brew install uv`

### [Winget](https://hellowac.github.io/uv-zh-cn/getting-started/installation/#winget)

可以通过 [winget](https://winstall.app/apps/astral-sh.uv) 安装 uv。

`winget install --id=astral-sh.uv -e`

## [更新 uv](https://hellowac.github.io/uv-zh-cn/getting-started/installation/#uv_1)

如果通过独立安装程序安装 uv，可以按需自我更新：

`uv self update`

uv 提供了丰富的功能，涵盖了从安装 Python 和运行简单脚本，到支持多 Python 版本和多平台的大型项目开发的各个方面。

uv 的功能可以分为多个模块，您可以根据需要单独或组合使用这些模块。

------

## Python 版本管理

安装和管理 Python 版本。

- `uv python install`：安装 Python 版本。
- `uv python list`：查看可用的 Python 版本。
- `uv python find`：查找已安装的 Python 版本。
- `uv python pin`：为当前项目指定使用的 Python 版本。
- `uv python uninstall`：卸载 Python 版本。

查看[安装 Python 指南](https://hellowac.github.io/uv-zh-cn/guides/install-python/)以快速入门。

------

## 脚本

运行独立的 Python 脚本（如 `example.py`）。

- `uv run`：运行脚本。
    - `uv run -p 3.12 python`：可通过该命令打开指定版本的 `Python Shell`
- `uv add --script`：为脚本添加依赖。
- `uv remove --script`：从脚本中移除依赖。

查看[运行脚本指南](https://hellowac.github.io/uv-zh-cn/guides/scripts/)以快速入门。

------

## 项目

创建并管理包含 `pyproject.toml` 的 Python 项目。

- `uv init`：在当前文件夹新项目，可指定 `project-name` 来创建文件夹作为项目目录。
    - `uv init --package example-pkg`：创建一个包项目 `example-pkg/src/example_packaged_app`。
    - `uv init --lib example-lib`：创建一个库项目`example-pkg/src/example-pkg`。
- `uv add`：向项目添加依赖。
    - `uv add 'httpx>=0.20'`：添加版本约束
    - `uv add 'jax; sys_platform == "linux"'`：确保某个依赖项仅在特定平台上安装，要在 Linux 上安装 `jax`，但不在 Windows 或 macOS 上安装。
    - `uv add 'numpy; python_version >= "3.11"'`：确保某个依赖项仅在特定 Python 版本上安装，要在 3.11 及以上版本安装 `numpy`。
    - `uv add httpx --optional network`：可选依赖。
    - `uv add --dev pytest`：开发依赖。
    - `uv add --group lint ruff`：依赖组。
- `uv remove`：从项目中移除依赖。
- `uv sync`：同步项目依赖到环境。
- `uv lock`：为项目依赖创建锁文件，显式地创建或更新锁定文件。
    - `uv lock --upgrade`：升级所有包。
    - `uv lock --upgrade-package <package>==<version>`：升级单个包到指定版本。
- `uv export --format requirements-txt`：将 `uv.lock` 导出为 `requirements.txt` 格式。
- `uv run`：在项目环境中运行命令。
- `uv tree`：查看项目的依赖树。
- `uv build`：构建项目的分发包。
    - `uv build --no-sources`：以确保在禁用 `tool.uv.sources` 的情况下正确构建包。
- `uv publish`：将项目发布到包索引。
    - 需要添加 `--token` 参数或者设置 `UV_PUBLISH_TOKEN` 环境变量来指明你得 PyPI API KEY。

查看[项目指南](https://hellowac.github.io/uv-zh-cn/guides/projects/)以快速入门。

------

## 工具

运行和安装发布到 Python 包索引的工具（如 `ruff` 或 `black`）。

- `uvx` / `uv tool run`：在临时环境中运行工具。
- `uv tool install`：全局安装工具。
- `uv tool uninstall`：卸载工具。
- `uv tool list`：列出已安装的工具。
- `uv tool update-shell`：更新 shell，使工具可执行文件生效。

查看[工具指南](https://hellowac.github.io/uv-zh-cn/guides/tools/)以快速入门。

------

## pip 接口

手动管理环境和包，适用于需要精细控制的传统工作流或场景。

### 创建虚拟环境（替代 `venv` 和 `virtualenv`）

- `uv venv`：创建一个新的虚拟环境。

查看[使用环境的文档](https://hellowac.github.io/uv-zh-cn/pip/environments/)了解详情。

### 管理环境中的包（替代 `pip`和 [`pipdeptree`](https://github.com/tox-dev/pipdeptree)）

- `uv pip install`：安装包到当前环境。
- `uv pip show`：显示已安装包的详细信息。
- `uv pip freeze`：以 `requirements.txt` 格式列出已安装包及其版本。
- `uv pip check`：检查当前环境中的包是否兼容。
- `uv pip list`：列出已安装的包。
- `uv pip uninstall`：卸载包。
- `uv pip tree`：查看环境的依赖树。

查看[管理包的文档](https://hellowac.github.io/uv-zh-cn/pip/packages/)了解详情。

### 锁定环境中的包（替代 `pip-tools`）

- `uv pip compile`：将需求文件编译为锁文件。
- `uv pip sync`：根据锁文件同步环境。

查看[锁定环境的文档](https://hellowac.github.io/uv-zh-cn/pip/compile/)了解详情。

::: tip
这些命令并不完全等同于它们所基于的工具的接口和行为。越是偏离常见的工作流，越可能遇到差异。详情请查阅 [pip 兼容性指南](https://hellowac.github.io/uv-zh-cn/pip/compatibility/)。
:::

------

## 实用工具

管理和查看 uv 的状态，如缓存、存储目录，或执行自更新：

- `uv cache clean`：清理缓存条目。
- `uv cache prune`：清理过期的缓存条目。
- `uv cache dir`：显示 uv 缓存目录路径。
- `uv tool dir`：显示 uv 工具目录路径。
- `uv python dir`：显示 uv 安装的 Python 版本路径。
- `uv self update`：将 uv 更新到最新版本。

## 配置文件

### 镜像源

要从特定的索引添加 Python 包，可以使用 `--index` 选项：

`uv add torch --index pytorch=https://download.pytorch.org/whl/cpu`

`uv` 将把该索引存储在 `[[tool.uv.index]]` 中，并添加一个 `[tool.uv.sources]` 条目：

在定义索引时，可以包含 `explicit` 标志，表示该索引应仅用于在 `tool.uv.sources` 中明确指定的包。如果没有设置 `explicit`，则在找不到其他源的包时，可能会从该索引解析包。

```toml
[[tool.uv.index]]
name = "pytorch"
url = "https://download.pytorch.org/whl/cpu"
explicit = true
```

设置全局镜像源可以通过如下配置

```toml
[tool.uv.pip]
index-url = "https://test.pypi.org/simple"
```



### [命令行接口](https://hellowac.github.io/uv-zh-cn/concepts/projects/config/#command-line-interfaces)

项目可以在 `pyproject.toml` 文件的 `[project.scripts]` 表中定义项目的命令行接口（CLI）。

例如，要声明一个名为 `hello` 的命令，该命令调用 `example` 模块中的 `hello` 函数：

```toml
[project.scripts]
hello = "example:hello"
```

然后，可以从控制台运行该命令：

`uv run hello`

### [图形用户界面](https://hellowac.github.io/uv-zh-cn/concepts/projects/config/#graphical-user-interfaces)

项目可以在 `pyproject.toml` 文件的 `[project.gui-scripts]` 表中定义项目的图形用户界面（GUI）。

Important

这些仅在 Windows 平台上与 [命令行接口](https://hellowac.github.io/uv-zh-cn/concepts/projects/config/#command-line-interfaces) 不同，在 Windows 上，它们会被封装成 GUI 可执行文件，这样可以在没有控制台的情况下启动。其他平台上的行为相同。

例如，要声明一个名为 `hello` 的命令，该命令调用 `example` 模块中的 `app` 函数：

```toml
[project.gui-scripts]
hello = "example:app"
```

### [插件入口点](https://hellowac.github.io/uv-zh-cn/concepts/projects/config/#plugin-entry-points)

项目可以在 `pyproject.toml` 文件的 `[project.entry-points]` 表中定义插件发现的入口点，具体可参考 [创建和发现插件](https://hellowac.github.io/pypug-zh-cn/guides/creating-and-discovering-plugins.html#using-package-metadata)。

例如，要将 `example-plugin-a` 包注册为 `example` 的插件：

```toml
[project.entry-points.'example.plugins']
a = "example_plugin_a"
```

然后，在 `example` 中，插件可以通过以下方式加载：

```python
from importlib.metadata import entry_points

for plugin in entry_points(group='example.plugins'):
    plugin.load()
```

::: tip

`group` 键可以是任意值，不需要包含包名或 "plugins"。然而，建议使用包名来命名该键，以避免与其他包发生冲突。

:::