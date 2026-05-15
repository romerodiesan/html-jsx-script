const test = require("node:test");
const assert = require("node:assert/strict");

const {
  formatHtmlJsx,
  prepareForPrettier,
  restoreAfterPrettier
} = require("../../src/formatter");

/**
 * @param {Record<string, unknown>} values
 */
function createConfig(values = {}) {
  return {
    get(key, fallbackValue) {
      return Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : fallbackValue;
    }
  };
}

test("prepareForPrettier rewrites jsx scripts and sets temp marker", () => {
  const source = '<script type="jsx">const App = () => <h1>Hello</h1>;</script>';

  const prepared = prepareForPrettier(source);

  assert.match(prepared, /data-html-jsx-script-temp="1"/);
  assert.match(prepared, /type="text\/babel"/);
  assert.doesNotMatch(prepared, /type="jsx"/);
});

test("restoreAfterPrettier removes marker and restores jsx type", () => {
  const source = '<script data-html-jsx-script-temp="1" type="text/babel">const App = () => <h1>Hello</h1>;</script>';

  const restored = restoreAfterPrettier(source);

  assert.match(restored, /type="jsx"/);
  assert.doesNotMatch(restored, /data-html-jsx-script-temp/);
  assert.doesNotMatch(restored, /type="text\/babel"/);
});

test("formatHtmlJsx keeps jsx type and removes temporary marker", async () => {
  const source = '<script type="jsx">const App = () => {return <h1>Hello</h1>;};</script>';
  const options = { tabSize: 2, insertSpaces: true };
  const config = createConfig();

  const formatted = await formatHtmlJsx(source, options, config);

  assert.match(formatted, /type="jsx"/);
  assert.doesNotMatch(formatted, /data-html-jsx-script-temp/);
  assert.match(formatted, /<h1>Hello<\/h1>/);
});

test("formatHtmlJsx does not rewrite unrelated script types", async () => {
  const source = '<script type="module">const a = 1;</script>';
  const options = { tabSize: 2, insertSpaces: true };
  const config = createConfig();

  const formatted = await formatHtmlJsx(source, options, config);

  assert.match(formatted, /type="module"/);
  assert.doesNotMatch(formatted, /data-html-jsx-script-temp/);
});
