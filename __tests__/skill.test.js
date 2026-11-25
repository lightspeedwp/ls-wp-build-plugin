/**
 * Structural checks for the ls-wp-build-plugin skill.
 *
 * The skill is instructions, not code, so these tests check what Claude Code
 * and the scaffold's MCP server rely on: valid frontmatter, links that
 * resolve, the four MCP tools and every server error code, and eval cases
 * that are complete.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const skill = read('SKILL.md');
const readme = read('README.md');

/**
 * Split a Markdown file into its YAML frontmatter fields and body.
 *
 * @param {string} text File contents.
 * @returns {{ fields: Record<string, string>, body: string }} Fields and body.
 */
function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { fields: {}, body: text };
  }
  const fields = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([a-z_-]+):\s*(.*)$/);
    if (pair) {
      fields[pair[1]] = pair[2];
    }
  }
  return { fields, body: match[2] };
}

/**
 * Relative link targets in a Markdown file, without anchors.
 *
 * @param {string} text File contents.
 * @returns {string[]} Link targets.
 */
function relativeLinks(text) {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((href) => !/^(https?:|mailto:|#)/.test(href))
    .map((href) => href.split('#')[0]);
}

describe('SKILL.md frontmatter', () => {
  const { fields, body } = frontmatter(skill);

  test('has a name that matches the repository and skill folder', () => {
    expect(fields.name).toBe('ls-wp-build-plugin');
    expect(fields.name).toBe(require(path.join(root, 'package.json')).name);
  });

  test('has a description Claude Code can use to pick the skill', () => {
    expect(fields.description).toBeTruthy();
    expect(fields.description.length).toBeLessThanOrEqual(1024);
    expect(fields.description).toMatch(/Use when/);
    expect(fields.description).toMatch(/Not for/);
  });

  test('has a body with a top-level heading', () => {
    expect(body).toMatch(/^# /m);
  });
});

describe('MCP contract', () => {
  test.each(['discover', 'validate_config', 'preview', 'generate'])('names the %s tool', (tool) => {
    expect(skill).toContain(`\`${tool}\``);
  });

  test.each([
    'INVALID_CONFIG',
    'UNSAFE_DESTINATION',
    'CONFLICT',
    'PREVIEW_NOT_FOUND',
    'APPROVAL_MISMATCH',
    'STALE_PREVIEW',
    'STAGING_FAILED',
    'PARTIAL_WRITE',
    'INTERNAL',
  ])('says what to do for the %s error', (code) => {
    expect(skill).toMatch(new RegExp(`^\\| \`${code}\`\\s*\\| \\S`, 'm'));
  });

  test('requires explicit approval before generate', () => {
    expect(skill).toMatch(/approved: true/);
    expect(skill).toMatch(/explicit yes/);
  });

  test('never falls back to the generator CLI', () => {
    expect(skill).toMatch(/Do not fall back to running `scripts\/generate-plugin\.js`/);
  });
});

describe('links', () => {
  test.each(['SKILL.md', 'README.md', 'CLAUDE.md', 'AGENTS.md'])(
    'relative links in %s resolve',
    (file) => {
      for (const href of relativeLinks(read(file))) {
        expect({ file, href, exists: fs.existsSync(path.join(root, href)) }).toEqual({
          file,
          href,
          exists: true,
        });
      }
    },
  );

  test('README and SKILL.md give the same server command', () => {
    const command = /claude mcp add --scope user block-plugin-scaffold -- .+server\.mts/;
    expect(skill.match(command)?.[0]).toBe(readme.match(command)?.[0]);
  });
});

describe('evals', () => {
  const evalsDir = path.join(root, 'evals');
  const cases = fs
    .readdirSync(evalsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  test('there is at least one eval case', () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  test.each(cases)('%s has a complete case.yaml and prompt.md', (name) => {
    const caseFile = fs.readFileSync(path.join(evalsDir, name, 'case.yaml'), 'utf8');
    expect(caseFile).toMatch(new RegExp(`^name: ${name}$`, 'm'));
    expect(caseFile).toMatch(/^description: /m);
    expect(caseFile).toMatch(/^what_a_good_result_looks_like: /m);
    const prompt = fs.readFileSync(path.join(evalsDir, name, 'prompt.md'), 'utf8');
    expect(prompt).toMatch(/^# /m);
    expect(prompt).toMatch(/^## Success Criteria$/m);
  });
});
