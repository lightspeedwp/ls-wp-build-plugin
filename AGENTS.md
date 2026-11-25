# Working on ls-wp-build-plugin

This file is for people and agents changing the skill. To use the skill, see [SKILL.md](SKILL.md) and [README.md](README.md).

## What is in the repository

| Path                | Purpose                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `SKILL.md`          | The skill: frontmatter and the instructions Claude follows                                |
| `README.md`         | Setup and usage for people                                                                |
| `evals/`            | Eval cases: `case.yaml` (expected result) and `prompt.md` (scenario)                      |
| `__tests__/`        | Jest checks for frontmatter, links, the MCP tools and errors, and evals                   |
| `eslint.config.cjs` | ESLint 10 flat config                                                                     |
| `lefthook.yml`      | Git hooks: Prettier, Markdownlint, Jest and ESLint before commit; branch name before push |

The tooling comes from [ls-skill-scaffold](https://github.com/lightspeedwp/ls-skill-scaffold). Change shared tooling there first, then bring it here.

## Rules for changes

- Keep the skill a client of the scaffold's MCP server. Never add a generator, copy the scaffold's templates, or call `scripts/generate-plugin.js`.
- When the server adds a tool or an error code, update `SKILL.md` and the lists in `__tests__/skill.test.js` together.
- Keep the frontmatter `description` under 1,024 characters, with a "Use when" and a "Not for" part.
- Add or update an eval in `evals/` for any change in behaviour.

## Checks

```bash
npm install
npm run lint:all
npm test
```

`npm install` also installs the Lefthook hooks. Branch names follow `{type}/{scope}-{title}`, for example `docs/skill-clarify-approval`.
