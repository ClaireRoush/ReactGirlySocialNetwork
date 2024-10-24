# How to Contribute

## Issues & Features

### Issue Format
The title should clearly describe your problem. Instead of writing an essay, use concise phrases like "X is not working" or "Add X to ...".

As for the description, we don't have a strict requirement. Just describe the problem and add a funny image, and we’ll all be happy! :D

### Labels

These labels can be specified when creating an issue. The only required label is **priority**.

- 🛠️ **backend**: Changes needed in the backend (e.g., server logic, API calls).
- 🌐 **frontend**: Changes needed in the frontend (e.g., layout adjustments, styling).
- 🐞 **bug**: Indicates malfunctioning features; combine with **frontend** or **backend**.
- ✨ **enhancement**: Requests for new features or improvements.
- 🔄 **refactoring**: For programmers: rewriting code for better performance or readability.
- ❓ **question**: Literally any question.
- 🖥️ **dev**: For programmers: change something in development workflow. Config file for development tools, documentation etc.
  
#### Priority Labels

- ❓ **unknown**: Can't prioritize yet; developers will assign later.
- 🔴 **low**: Minor issues that don't need immediate attention.
- 🟡 **medium**: Should be addressed but not urgent; e.g., minor bugs.
- 🔥 **high**: Critical issues requiring urgent attention to prevent problems.

#### Discussion Progress Labels

- 🔄 **duplicate**: A similar issue exists; typically leads to closure.
- ❌ **invalid**: Issue cannot be replicated; please provide more information.
- 🙏 **help wanted**: Indicates a complicated question needing assistance.
- 🚫 **wontfix**: The issue will not be addressed unless significant changes occur.


### Milestones
If you don't know what to choose, just leave it blank. Someone will assign it later.

Check what the current milestone is. If a new milestone has not been created yet, you should assign it to an existing one.

If there is more than one milestone, assign it to the latest one. For example, if the current milestones are 1.9 and 2.0, assign your issue to 2.0.

The only exception is for high-priority issues, which should be assigned to the current working milestone.

## Pull Requests

### PR Format
If your PR fixes an issue, your title should contain the issue ID. For example, "Issue #1234 ..."

In the description, specify which issues this PR closes using a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).

If your PR doesn’t close anything and just improves something, describe what it does and write something creative or send a cute image.

### Labels
If your PR doesn't close any issues, you should assign labels following the same rules as for [Issues](#labels).

If your PR closes an issue, assigning labels is optional.

### Milestones
It's useless. At least for now

### Selecting a Branch

If your PR is related to an issue, push your changes to the branch corresponding to the milestone of that issue (e.g., if the issue is for the 1.9 milestone, push to the `1.9` branch).

If your PR is unrelated to any issue, consider what the changes entail. If it’s a fix (such as a style change or bug fix), then push to the current working branch.
