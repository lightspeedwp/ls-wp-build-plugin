# CLAUDE.md

This repository is the `ls-wp-build-plugin` Claude skill. It is installed by cloning it to `~/.claude/skills/ls-wp-build-plugin/`.

- To generate a block plugin, follow [SKILL.md](SKILL.md).
- To change the skill itself, read [AGENTS.md](AGENTS.md) first.

The skill has no generator of its own. It drives the [block-plugin-scaffold](https://github.com/lightspeedwp/block-plugin-scaffold) MCP server, and that server's contract wins when the two disagree.
