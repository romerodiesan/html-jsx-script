const prettier = require("prettier");

const htmlPlugin = require("prettier/plugins/html");
const babelPlugin = require("prettier/plugins/babel");
const estreePlugin = require("prettier/plugins/estree");

const TEMP_MARKER_ATTRIBUTE = "data-html-jsx-script-temp";
const TEMP_MARKER_VALUE = "1";

const JSX_SCRIPT_OPEN_TAG_PATTERN =
  /<script\b[^>]*\btype\s*=\s*(?:"jsx"|'jsx'|jsx)[^>]*>/gi;

const PRETTIER_TEMP_TAG_PATTERN =
  /<script\b(?=[^>]*\bdata-html-jsx-script-temp=(?:"1"|'1'))[^>]*>/gi;

/**
 * @param {import("vscode").FormattingOptions} options
 * @param {import("vscode").WorkspaceConfiguration} config
 */
function getPrettierOptions(options, config) {
  return {
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
  };
}

/**
 * Prettier understands JSX in HTML better when script blocks use text/babel.
 * This extension preserves the user's original type="jsx" by temporarily
 * rewriting only those tags before formatting, then restoring them after.
 *
 * @param {string} source
 * @returns {string}
 */
function prepareForPrettier(source) {
  return source.replace(JSX_SCRIPT_OPEN_TAG_PATTERN, (tag) => {
    const tagWithMarker = tag.replace(
      /^<script\b/i,
      `<script ${TEMP_MARKER_ATTRIBUTE}="${TEMP_MARKER_VALUE}"`
    );

    return tagWithMarker.replace(
      /\btype\s*=\s*(?:"jsx"|'jsx'|jsx)/i,
      'type="text/babel"'
    );
  });
}

/**
 * @param {string} source
 * @returns {string}
 */
function restoreAfterPrettier(source) {
  return source.replace(PRETTIER_TEMP_TAG_PATTERN, (tag) => {
    return tag
      .replace(
        new RegExp(
          `\\s${TEMP_MARKER_ATTRIBUTE}=(?:"${TEMP_MARKER_VALUE}"|'${TEMP_MARKER_VALUE}')`,
          "i"
        ),
        ""
      )
      .replace(
        /\btype\s*=\s*(?:"text\/babel"|'text\/babel'|text\/babel)/i,
        'type="jsx"'
      );
  });
}

/**
 * @param {string} source
 * @param {import("vscode").FormattingOptions} options
 * @param {import("vscode").WorkspaceConfiguration} config
 * @returns {Promise<string>}
 */
async function formatHtmlJsx(source, options, config) {
  const prepared = prepareForPrettier(source);
  const formatted = await prettier.format(
    prepared,
    getPrettierOptions(options, config)
  );

  return restoreAfterPrettier(formatted);
}

module.exports = {
  formatHtmlJsx,
  prepareForPrettier,
  restoreAfterPrettier
};