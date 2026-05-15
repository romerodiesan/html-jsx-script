const { DOCUMENT_SELECTOR, MESSAGE_PREFIX } = require("../../core/constants");
const { getFullDocumentRange } = require("../../core/document");

/**
 * @param {typeof import("vscode")} vscode
 * @param {{ info(message: string): void; error(message: string): void }} logger
 * @param {(source: string, options: import("vscode").FormattingOptions, config: import("vscode").WorkspaceConfiguration) => Promise<string>} formatHtmlJsx
 */
function registerFormattingProviders(vscode, logger, formatHtmlJsx) {
  const documentFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    DOCUMENT_SELECTOR,
    {
      async provideDocumentFormattingEdits(document, options) {
        const config = vscode.workspace.getConfiguration(
          "htmlJsxScript",
          document.uri
        );

        if (!config.get("formatter.enabled", true)) {
          logger.info(
            "Formatter skipped because htmlJsxScript.formatter.enabled is false."
          );
          return [];
        }

        try {
          const source = document.getText();
          const formatted = await formatHtmlJsx(source, options, config);

          if (formatted === source) {
            return [];
          }

          return [
            vscode.TextEdit.replace(getFullDocumentRange(document, vscode), formatted)
          ];
        } catch (error) {
          const message = error && error.message ? error.message : String(error);
          logger.error(`Formatter failed: ${message}`);
          vscode.window.showErrorMessage(`${MESSAGE_PREFIX} formatter failed: ${message}`);
          return [];
        }
      }
    }
  );

  const rangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(
    DOCUMENT_SELECTOR,
    {
      async provideDocumentRangeFormattingEdits(document, range, options) {
        const config = vscode.workspace.getConfiguration(
          "htmlJsxScript",
          document.uri
        );

        if (!config.get("formatter.enabled", true)) {
          logger.info(
            "Range formatter skipped because htmlJsxScript.formatter.enabled is false."
          );
          return [];
        }

        try {
          const source = document.getText(range);
          const formatted = await formatHtmlJsx(source, options, config);

          if (formatted === source) {
            return [];
          }

          return [vscode.TextEdit.replace(range, formatted)];
        } catch (error) {
          const message = error && error.message ? error.message : String(error);
          logger.error(`Range formatter failed: ${message}`);
          vscode.window.showErrorMessage(
            `${MESSAGE_PREFIX} range formatter failed: ${message}`
          );
          return [];
        }
      }
    }
  );

  return [documentFormatter, rangeFormatter];
}

module.exports = {
  registerFormattingProviders
};
