const vscode = require("vscode");
const {
  formatHtmlJsx,
  prepareForPrettier,
  restoreAfterPrettier
} = require("./formatter");

const EXTENSION_OUTPUT_CHANNEL = "HTML JSX Script";

let outputChannel;

/**
 * @param {string} message
 */
function log(message) {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel(EXTENSION_OUTPUT_CHANNEL);
  }

  outputChannel.appendLine(`[${new Date().toISOString()}] ${message}`);
}

/**
 * @param {vscode.TextDocument} document
 */
function getFullDocumentRange(document) {
  const start = document.positionAt(0);
  const end = document.positionAt(document.getText().length);

  return new vscode.Range(start, end);
}

/**
 * @param {vscode.TextEditor} editor
 * @param {(source: string) => string} transform
 */
async function replaceWholeDocument(editor, transform) {
  const document = editor.document;
  const source = document.getText();
  const next = transform(source);

  if (next === source) {
    vscode.window.showInformationMessage("HTML JSX Script: No changes needed.");
    return;
  }

  await editor.edit((editBuilder) => {
    editBuilder.replace(getFullDocumentRange(document), next);
  });
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  outputChannel = vscode.window.createOutputChannel(EXTENSION_OUTPUT_CHANNEL);
  log("Extension activated.");

  const htmlDocumentSelector = [
    { language: "html", scheme: "file" },
    { language: "html-jsx", scheme: "file" }
  ];

  const documentFormatter = vscode.languages.registerDocumentFormattingEditProvider(
    htmlDocumentSelector,
    {
      async provideDocumentFormattingEdits(document, options) {
        const config = vscode.workspace.getConfiguration(
          "htmlJsxScript",
          document.uri
        );

        if (!config.get("formatter.enabled", true)) {
          log("Formatter skipped because htmlJsxScript.formatter.enabled is false.");
          return [];
        }

        try {
          const formatted = await formatHtmlJsx(
            document.getText(),
            options,
            config
          );

          if (formatted === document.getText()) {
            return [];
          }

          return [
            vscode.TextEdit.replace(getFullDocumentRange(document), formatted)
          ];
        } catch (error) {
          const message = error && error.message ? error.message : String(error);
          log(`Formatter failed: ${message}`);
          vscode.window.showErrorMessage(`HTML JSX formatter failed: ${message}`);

          return [];
        }
      }
    }
  );

  const rangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider(
    htmlDocumentSelector,
    {
      async provideDocumentRangeFormattingEdits(document, range, options) {
        const config = vscode.workspace.getConfiguration(
          "htmlJsxScript",
          document.uri
        );

        if (!config.get("formatter.enabled", true)) {
          log(
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
          log(`Range formatter failed: ${message}`);
          vscode.window.showErrorMessage(
            `HTML JSX range formatter failed: ${message}`
          );

          return [];
        }
      }
    }
  );

  const formatDocumentCommand = vscode.commands.registerCommand(
    "htmlJsxScript.formatDocument",
    async () => {
      await vscode.commands.executeCommand("editor.action.formatDocument");
    }
  );

  const insertScriptBlockCommand = vscode.commands.registerCommand(
    "htmlJsxScript.insertScriptBlock",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("HTML JSX Script: Open a file first.");
        return;
      }

      const snippet = new vscode.SnippetString(
        [
          '<script type="jsx">',
          "  const ${1:App} = () => {",
          "    return <${2:div}>${3:Hello JSX}</${2:div}>;",
          "  };",
          "</script>"
        ].join("\n")
      );

      await editor.insertSnippet(snippet);
    }
  );

  const convertBabelToJsxCommand = vscode.commands.registerCommand(
    "htmlJsxScript.convertBabelToJsx",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("HTML JSX Script: Open a file first.");
        return;
      }

      await replaceWholeDocument(editor, (source) =>
        source.replace(
          /(<script\b[^>]*\btype\s*=\s*)(?:"text\/babel"|'text\/babel'|text\/babel)([^>]*>)/gi,
          '$1"jsx"$2'
        )
      );
    }
  );

  const convertJsxToBabelCommand = vscode.commands.registerCommand(
    "htmlJsxScript.convertJsxToBabel",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage("HTML JSX Script: Open a file first.");
        return;
      }

      await replaceWholeDocument(editor, (source) =>
        source.replace(
          /(<script\b[^>]*\btype\s*=\s*)(?:"jsx"|'jsx'|jsx)([^>]*>)/gi,
          '$1"text/babel"$2'
        )
      );
    }
  );

  const enableHtmlAssociationCommand = vscode.commands.registerCommand(
    "htmlJsxScript.enableHtmlAssociation",
    async () => {
      const workspaceFolder = vscode.workspace.workspaceFolders
        ? vscode.workspace.workspaceFolders[0]
        : undefined;

      if (!workspaceFolder) {
        vscode.window.showWarningMessage(
          "HTML JSX Script: Open a workspace folder first."
        );
        return;
      }

      const filesConfig = vscode.workspace.getConfiguration("files");
      const associations = {
        ...(filesConfig.get("associations") || {}),
        "*.html": "html-jsx"
      };

      await filesConfig.update(
        "associations",
        associations,
        vscode.ConfigurationTarget.Workspace
      );

      vscode.window.showInformationMessage(
        "HTML JSX Script: Workspace association updated (*.html -> html-jsx)."
      );
    }
  );

  context.subscriptions.push(
    outputChannel,
    documentFormatter,
    rangeFormatter,
    formatDocumentCommand,
    insertScriptBlockCommand,
    convertBabelToJsxCommand,
    convertJsxToBabelCommand,
    enableHtmlAssociationCommand
  );
}

function deactivate() {
  log("Extension deactivated.");
}

module.exports = {
  activate,
  deactivate,
  prepareForPrettier,
  restoreAfterPrettier
};