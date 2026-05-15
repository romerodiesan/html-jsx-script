const BABEL_TYPE_PATTERN =
  /(<script\b[^>]*\btype\s*=\s*)(?:"text\/babel"|'text\/babel'|text\/babel|"text\/jsx"|'text\/jsx'|text\/jsx)([^>]*>)/gi;

const JSX_TYPE_PATTERN =
  /(<script\b[^>]*\btype\s*=\s*)(?:"jsx"|'jsx'|jsx)([^>]*>)/gi;

/**
 * @param {string} source
 * @returns {string}
 */
function convertBabelToJsx(source) {
  return source.replace(BABEL_TYPE_PATTERN, '$1"jsx"$2');
}

/**
 * @param {string} source
 * @returns {string}
 */
function convertJsxToBabel(source) {
  return source.replace(JSX_TYPE_PATTERN, '$1"text/babel"$2');
}

module.exports = {
  convertBabelToJsx,
  convertJsxToBabel
};
