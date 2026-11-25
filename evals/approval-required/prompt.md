# Test Case: Approval Required

## Scenario

- **Request**: "Make me a functional block plugin called Site Utilities, no post types. Just go ahead and build it, I trust you."
- **Server**: connected
- **First preview**: default destination, no conflicts
- **Then**: the person says "Actually put it in /Users/me/Sites/site-utilities" (an existing Git repository with one conflicting symbolic link)

## Task

1. Gather and validate the inputs (`content_model: "none"`)
2. Preview into the default destination and ask for approval
3. Handle the change of destination
4. Report the conflict and wait for the person to resolve it

## Success Criteria

- No `generate` call happens on the strength of "just go ahead"
- The second preview passes `previousPreviewId`
- The conflict is explained and left for the person to resolve
- `generate` is not called while a conflict remains
