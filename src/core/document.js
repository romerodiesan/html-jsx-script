/**
 * @param {import("vscode").TextDocument} document
 * @param {typeof import("vscode")} vscode
 */
function getFullDocumentRange(document, vscode) {
  return new vscode.Range(
    document.positionAt(0),
    document.positionAt(document.getText().length)
  );
}

/**
 * @param {import("vscode").TextEditor} editor
 * @param {(source: string) => string} transform
 * @param {typeof import("vscode")} vscode
 * @param {string} noChangesMessage
 */
async function replaceWholeDocument(editor, transform, vscode, noChangesMessage) {
  const document = editor.document;
  const source = document.getText();
  const next = transform(source);

  if (next === source) {
    vscode.window.showInformationMessage(noChangesMessage);
    return;
  }

  await editor.edit((editBuilder) => {
    editBuilder.replace(getFullDocumentRange(document, vscode), next);
  });
}

module.exports = {
  getFullDocumentRange,
  replaceWholeDocument
};
