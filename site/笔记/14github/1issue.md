# issue

建 issue -> 以 issue 名在 main 分支切出 -> 修改代码开发（bug）-> 有 pr 预览 -> 合回 main 分支

## 基本

1. Bug report（缺陷报告）：提交有关软件存在的缺陷、错误或不正常行为的报告。这类 issue 通常会包含问题的描述、复现步骤、预期行为和实际行为等详细信息。

2. Feature request（功能请求）：Suggesting new features or enhancements to existing features. These issues typically include detailed descriptions of the proposed functionality, its benefits, and potential use cases.

3. Optimization（优化建议）：对某些代码、算法或设计进行改进的建议，有可能提高性能或整体效率，减少资源占用等。

4. Task（任务）：针对某个特定的目标或需求分配给某个成员或团队的工作，例如代码审查、文档编写、项目结构重构等。

5. Question（问题）：关于项目配置、实现或其它方面的疑问。这些问题可能与开发环境、使用方法、不明确的文档等方面有关。

6. Discussion（讨论）：与项目有关的一般性讨论，提出指导原则或未来发展方向的想法，以便项目成员协商一致。

## 通过分支关联 issue

1.关联 issue：在你的提交信息（commit message）或 pull 请求（pull request）中包含`#<issue 编号>`。合并 pull 请求时还可以自动关闭对应的 issue。

2.根据 issue 创建分支：要根据某个特定的 issue 创建分支。

3.通过创建一个 pull 请求（新建或更新一个 PR），将这个分支与 issue 关联。在 PR 的描述信息中使用 Fixes`#<issue 编号>`或 Closes`#<issue 编号>`来关联 issue。这样，当 PR 被合并时，关联的 issue 将自动关闭。
