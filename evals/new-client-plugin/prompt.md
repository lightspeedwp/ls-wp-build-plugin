# Test Case: New Client Plugin

## Scenario

- **Request**: "Create a block plugin called Safari Tours for The Safari Partners, with a Tour post type, a Destination taxonomy, and fields for duration and price."
- **Server**: the block-plugin-scaffold MCP server is connected
- **Not given**: author, repository URL, destination, WordPress and PHP versions

## Task

1. Discover the configuration fields
2. Ask for the author and confirm the slug `safari-tours`
3. Build the content model: `post_types` with Tour, `taxonomies` with Destination, `fields` for duration and price
4. Validate and show warnings and defaults
5. Preview into the default destination
6. Ask for approval; the person says yes
7. Generate and report what was written

## Success Criteria

- No value the person did not give or confirm is presented as theirs
- The legacy `cpt_slug` and `name_singular` fields are not used
- `generate` is called once, after the yes, with that preview's approval
- The report names the log, journal and any backups
