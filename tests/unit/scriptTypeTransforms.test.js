const test = require("node:test");
const assert = require("node:assert/strict");

const {
  convertBabelToJsx,
  convertJsxToBabel
} = require("../../src/features/transforms/scriptTypeTransforms");

test("convertBabelToJsx converts only script type text/babel", () => {
  const source = [
    '<script type="text/babel">const A = () => <div />;</script>',
    '<script type="module">const x = 1;</script>'
  ].join("\n");

  const result = convertBabelToJsx(source);

  assert.match(result, /<script type="jsx">/);
  assert.match(result, /<script type="module">/);
  assert.doesNotMatch(result, /type="text\/babel"/);
});

test("convertJsxToBabel converts only script type jsx", () => {
  const source = [
    '<script type="jsx">const App = () => <h1>Hello</h1>;</script>',
    '<script type="module">const y = 2;</script>'
  ].join("\n");

  const result = convertJsxToBabel(source);

  assert.match(result, /<script type="text\/babel">/);
  assert.match(result, /<script type="module">/);
  assert.doesNotMatch(result, /<script type="jsx">/);
});

test("convertBabelToJsx and convertJsxToBabel are reversible", () => {
  const source = '<script defer type="text/babel">const App = () => <div>Hi</div>;</script>';

  const asJsx = convertBabelToJsx(source);
  const asBabelAgain = convertJsxToBabel(asJsx);

  assert.equal(asBabelAgain, source);
});
