# tslib

tslib 把一系列的降级代码（函数）抽离并合并导出的库。目的是降低编译后代码的数量，起到压缩代码体积的作用。

你是否需要 tslib
这首先取决与你运行目标代码的环境，假如运行环境支持更新版本的 JavaScript，那我的建议是不妨把编译目标等级调高一点，从真正意义上减少代码的体积。而如果你的运行环境有明确的 JavaScript 版本需求，那我强烈建议你打开 importedHelper 这个选项，并安装 tslib 这个依赖，我相信它能在一定程度上压缩整个项目的体积。
