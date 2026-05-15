const vscode = require("vscode");
const {
  formatHtmlJsx,
  prepareForPrettier,
  restoreAfterPrettier
} = require("./formatter");
const { registerCommands } = require("./features/commands");
const { replaceWholeDocument } = require("./core/document");
const { registerFormattingProviders } = require("./features/formatting/providers");
const { createLogger } = require("./core/logger");

let logger;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  logger = createLogger(vscode);
  logger.info("Extension activated.");

  const formattingProviders = registerFormattingProviders(
    vscode,
    logger,
    formatHtmlJsx
  );
  const commands = registerCommands(vscode, replaceWholeDocument);

  context.subscriptions.push(logger.channel, ...formattingProviders, ...commands);
}

function deactivate() {
  if (logger) {
    logger.info("Extension deactivated.");
  }
}

module.exports = {
  activate,
  deactivate,
  prepareForPrettier,
  restoreAfterPrettier
};