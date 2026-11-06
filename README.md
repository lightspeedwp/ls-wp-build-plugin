# ls-wp-build-plugin

A Claude skill that generates WordPress block plugins from the LightSpeed [block-plugin-scaffold](https://github.com/lightspeedwp/block-plugin-scaffold). It gathers the plugin's details and validates them, then shows a preview of every file. Files are written only after you approve that preview.

The skill does not contain a generator. It drives the scaffold's local MCP server, which validates the configuration, generates the plugin into a staging folder and merges it into the destination safely (it never deletes, backs up anything it replaces, and refuses unsafe folders). The rules are in the scaffold's [`docs/MCP-PLUGIN-GENERATION.md`](https://github.com/lightspeedwp/block-plugin-scaffold/blob/develop/docs/MCP-PLUGIN-GENERATION.md).

## What it does

1. Asks the scaffold what it accepts (`discover`).
2. Gathers the plugin details: slug, name, author, description, repository, content model (post types, taxonomies, custom fields), WordPress and PHP versions, destination folder.
3. Validates them (`validate_config`).
4. Previews the result (`preview`): the files to create, the files to replace (backed up first) and any conflicts.
5. Asks for your explicit approval of that preview.
6. Generates the plugin (`generate`).
7. With your approval, runs the generated plugin's own install, build, lint and test commands.
8. Hands further work to the WordPress agent skills the plugin ships with.

## Requirements

- macOS (other platforms are not verified).
- Node.js 24.18 or later.
- A checkout of [block-plugin-scaffold](https://github.com/lightspeedwp/block-plugin-scaffold) on `develop`, with `npm install` run in it.
- The scaffold's MCP server connected to your client (below).
- Optional, for the plugin checks: Composer and PHP 8.0+.

## Setup

### 1. Connect the scaffold's MCP server

Use absolute paths. Claude Desktop does not read your shell profile, so a `node` from a version manager needs its full path (`which node`).

Claude Code, for every project:

```bash
claude mcp add --scope user block-plugin-scaffold -- /absolute/path/to/node /absolute/path/to/block-plugin-scaffold/scripts/mcp/server.mts
```

Claude Desktop: add this to `~/Library/Application Support/Claude/claude_desktop_config.json`, keeping any other servers, then quit and reopen Claude Desktop:

```json
{
  "mcpServers": {
    "block-plugin-scaffold": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/block-plugin-scaffold/scripts/mcp/server.mts"]
    }
  }
}
```

Check it by asking Claude to call `discover`.

### 2. Install the skill

Clone this repository into your personal skills folder:

```bash
git clone https://github.com/lightspeedwp/ls-wp-build-plugin ~/.claude/skills/ls-wp-build-plugin
```

Claude loads every skill in that folder, so keep only reviewed versions there. Work on changes in a clone elsewhere.

## Usage

Ask in your own words, for example:

> Create a block plugin called "Safari Tours" for The Safari Partners, with a Tour post type, a Destination taxonomy, and fields for duration and price.

The skill asks for anything missing, shows the preview and waits for your yes. By default the plugin goes to `<scaffold>/generated-plugins/<slug>`; name another absolute folder to generate there instead, including an existing Git repository (only the plugin's files are written; nothing is deleted).

## Limitations

- Generated plugins require Secure Custom Fields (`Requires Plugins: secure-custom-fields`); WordPress will not activate them on a site that has only ACF or ACF Pro.
- The workflow ends with local files. It does not deploy, publish, release, create repositories or open pull requests.
- The scaffold's template mode (`--in-place`) is not available.
- Backups of replaced files accumulate in the scaffold's `logs/` folder until you delete them.

## Licence

GPL-3.0. See [LICENSE](LICENSE).
