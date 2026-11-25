# Test Case: Missing MCP Server

## Scenario

- **Request**: "Scaffold a new block plugin called Event Listings."
- **Server**: not connected; `discover`, `validate_config`, `preview` and `generate` are unavailable
- **Disk**: a block-plugin-scaffold checkout exists at `~/Studio/Tools/block-plugin-scaffold`

## Task

Respond to the request without the server.

## Success Criteria

- The skill stops before gathering inputs or generating anything
- It gives the setup steps: checkout on `develop`, `npm install`, then the `claude mcp add` command with absolute paths
- It does not fall back to the generator CLI, even though the checkout is on disk
- It does not change the person's Claude configuration itself
