# HTML JSX Script

Syntax highlighting and formatting for JSX inside HTML script blocks using `type="jsx"`.

## Features

- JSX syntax highlighting inside the **HTML JSX** language mode
- Support for `<script type="jsx">`
- Built-in **Format Document** support powered by Prettier
- **Format Selection** support
- Snippets for JSX script blocks and React patterns
- Commands to convert between `text/babel` and `jsx`
- Workspace command to associate `.html` files with `html-jsx`

## Example

```html
<script type="jsx">
  const App = () => <h1>Hello JSX</h1>;
</script>
```

## Usage

### Option 1: Use `.htmljsx`

Create a file with the `.htmljsx` extension.

```txt
index.htmljsx
```

The extension will automatically use the **HTML JSX** language mode.

### Option 2: Use regular `.html` files

Open a `.html` file, then run:

```txt
HTML JSX Script: Enable for .html files in this Workspace
```

This adds a workspace association for:

```json
{
  "files.associations": {
    "*.html": "html-jsx"
  }
}
```

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
| `HTML JSX Script: Enable for .html files in this Workspace` | Associates `.html` files with `html-jsx` in the current workspace |

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