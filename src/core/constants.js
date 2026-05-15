const EXTENSION_NAME = "HTML JSX Script";
const OUTPUT_CHANNEL_NAME = EXTENSION_NAME;

const LANGUAGE_IDS = ["html"];
const DOCUMENT_SELECTOR = LANGUAGE_IDS.map((language) => ({
  language,
  scheme: "file"
}));

const MESSAGE_PREFIX = `${EXTENSION_NAME}:`;

module.exports = {
  DOCUMENT_SELECTOR,
  EXTENSION_NAME,
  LANGUAGE_IDS,
  MESSAGE_PREFIX,
  OUTPUT_CHANNEL_NAME
};
