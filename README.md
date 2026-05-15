# HTML JSX Script

Syntax highlighting and formatting for JSX inside HTML script blocks using `type="jsx"`.

## Features

- JSX syntax highlighting inside `<script type="jsx">` blocks in regular `.html` files
- Support for `<script type="jsx">`, `<script type="text/jsx">`, and `<script type="text/babel">`
- Built-in **Format Document** support powered by Prettier
- **Format Selection** support
- Snippets for JSX script blocks and React patterns
- Commands to convert between `text/babel` and `jsx`

## Example

```html
<script type="jsx">
  const App = () => <h1>Hello JSX</h1>;
</script>
```

## Usage

Open any `.html` file. The extension activates automatically and highlights JSX inside `<script type="jsx">` blocks.

No configuration or language mode changes needed.

### Format Document

Run:

```txt
Format Document
```

or use:

```txt
Option + Shift + F
```

on macOS.

The formatter preserves:

```html
<script type="jsx">
```

It temporarily converts JSX script blocks internally for formatting and restores them back to `type="jsx"` afterward.

## Commands

| Command | Description |
|---|---|
| `HTML JSX Script: Format Document` | Formats the current document |
| `HTML JSX Script: Insert JSX Script Block` | Inserts a ready-to-use JSX script block |
| `HTML JSX Script: Convert text/babel to jsx` | Converts Babel script blocks to JSX script blocks |
| `HTML JSX Script: Convert jsx to text/babel` | Converts JSX script blocks to Babel script blocks |

## Snippets

| Prefix | Description |
|---|---|
| `jsxscript` | Inserts a `<script type="jsx">` block |
| `jsxroot` | Inserts a React root render snippet |
| `jsxcomponent` | Inserts a functional JSX component |
| `jsxapp` | Inserts a small HTML React app structure |

## Settings

| Setting | Default | Description |
|---|---:|---|
| `htmlJsxScript.formatter.enabled` | `true` | Enables the formatter |
| `htmlJsxScript.formatter.printWidth` | `80` | Formatter line width |
| `htmlJsxScript.formatter.singleQuote` | `false` | Use single quotes |
| `htmlJsxScript.formatter.trailingComma` | `es5` | Trailing comma behavior |
| `htmlJsxScript.formatter.bracketSameLine` | `false` | Controls multiline JSX closing bracket behavior |
| `htmlJsxScript.formatter.htmlWhitespaceSensitivity` | `css` | Controls HTML whitespace behavior |

Example:

```json
{
  "htmlJsxScript.formatter.printWidth": 100,
  "htmlJsxScript.formatter.singleQuote": true
}
```

## Important Note

This extension provides editor support only.

It does **not** transpile JSX in the browser. If you want runtime JSX support in a plain HTML file, you still need Babel Standalone, a build tool, or another JSX transform setup.

## Repository

https://github.com/romerodiesan/html-jsx-script

## License

MIT

## Development Workflow

This repository follows a production-oriented workflow:

- `main` is the stable branch.
- Feature work should be done on short-lived branches and merged through Pull Requests.
- Commit messages must follow Conventional Commits.

Examples:

```txt
feat(grammar): support script type=text/jsx
fix(injection): restore JSX highlighting inside script blocks
docs(readme): clarify html association command
```

Before publishing:

```txt
npm ci
npm run lint
npm run package
```

See `CONTRIBUTING.md` for full contribution and commit policy.

## Project Structure

```txt
src/
  core/
    constants.js
    document.js
    logger.js
  features/
    commands/
      index.js
    formatting/
      providers.js
    transforms/
      scriptTypeTransforms.js
  formatter/
    index.js
  extension.js

syntaxes/
snippets/
samples/
```

Architecture responsibilities:

- `src/extension.js`: composition root and VS Code activation lifecycle.
- `src/core/*`: shared low-level utilities.
- `src/features/commands/*`: user-triggered commands.
- `src/features/formatting/*`: formatting providers.
- `src/features/transforms/*`: pure text transformations.
- `src/formatter/*`: Prettier integration and JSX script preservation.