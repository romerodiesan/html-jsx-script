const prettier = require("prettier");

const htmlPlugin = require("prettier/plugins/html");
const babelPlugin = require("prettier/plugins/babel");
const estreePlugin = require("prettier/plugins/estree");

/**
 * Prettier understands JSX in HTML better when script blocks use text/babel.
 * This extension preserves the user's original type="jsx" by temporarily
 * rewriting only those tags before formatting, then restoring them after.
 *
 * @param {string} source
 * @returns {string}
 */
function prepareForPrettier(source) {
  return source.replace(
    /<script\b[^>]*\btype\s*=\s*(?:"jsx"|'jsx'|jsx)[^>]*>/gi,
    (tag) => {
      const tagWithMarker = tag.replace(
        /^<script\b/i,
        '<script data-html-jsx-script-temp="1"'
      );

      return tagWithMarker.replace(
        /\btype\s*=\s*(?:"jsx"|'jsx'|jsx)/i,
        'type="text/babel"'
      );
    }
  );
}

/**
 * @param {string} source
 * @returns {string}
 */
function restoreAfterPrettier(source) {
  return source.replace(
    /<script\b(?=[^>]*\bdata-html-jsx-script-temp=(?:"1"|'1'))[^>]*>/gi,
    (tag) => {
      return tag
        .replace(/\sdata-html-jsx-script-temp=(?:"1"|'1')/i, "")
        .replace(/\btype\s*=\s*(?:"text\/babel"|'text\/babel'|text\/babel)/i, 'type="jsx"');
    }
  );
}

/**
 * @param {string} source
 * @param {import("vscode").FormattingOptions} options
 * @param {import("vscode").WorkspaceConfiguration} config
 * @returns {Promise<string>}
 */
async function formatHtmlJsx(source, options, config) {
  const prepared = prepareForPrettier(source);

  const formatted = await prettier.format(prepared, {
    parser: "html",
    plugins: [htmlPlugin, babelPlugin, estreePlugin],
    tabWidth: Number(options.tabSize) || 2,
    useTabs: !options.insertSpaces,
    printWidth: config.get("formatter.printWidth", 80),
    singleQuote: config.get("formatter.singleQuote", false),
    trailingComma: config.get("formatter.trailingComma", "es5"),
    bracketSameLine: config.get("formatter.bracketSameLine", false),
    htmlWhitespaceSensitivity: config.get(
      "formatter.htmlWhitespaceSensitivity",
      "css"
    )
  });

  return restoreAfterPrettier(formatted);
}

module.exports = {
  formatHtmlJsx,
  prepareForPrettier,
  restoreAfterPrettier
};