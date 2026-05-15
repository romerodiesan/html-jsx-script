const { MESSAGE_PREFIX } = require("../../core/constants");
const {
  convertBabelToJsx,
  convertJsxToBabel
} = require("../transforms/scriptTypeTransforms");

/**
 * @param {typeof import("vscode")} vscode
 * @param {(editor: import("vscode").TextEditor, transform: (source: string) => string, vscodeRef: typeof import("vscode"), noChangesMessage: string) => Promise<void>} replaceWholeDocument
 */
function registerCommands(vscode, replaceWholeDocument) {
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
        vscode.window.showWarningMessage(`${MESSAGE_PREFIX} Open a file first.`);
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
        vscode.window.showWarningMessage(`${MESSAGE_PREFIX} Open a file first.`);
        return;
      }

      await replaceWholeDocument(
        editor,
        convertBabelToJsx,
        vscode,
        `${MESSAGE_PREFIX} No changes needed.`
      );
    }
  );

  const convertJsxToBabelCommand = vscode.commands.registerCommand(
    "htmlJsxScript.convertJsxToBabel",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showWarningMessage(`${MESSAGE_PREFIX} Open a file first.`);
        return;
      }

      await replaceWholeDocument(
        editor,
        convertJsxToBabel,
        vscode,
        `${MESSAGE_PREFIX} No changes needed.`
      );
    }
  );

  return [
    formatDocumentCommand,
    insertScriptBlockCommand,
    convertBabelToJsxCommand,
    convertJsxToBabelCommand
  ];
}

module.exports = {
  registerCommands
};
