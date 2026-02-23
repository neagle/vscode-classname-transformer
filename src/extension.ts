import * as vscode from "vscode";

const CLASSNAME_STRING_REGEX = /className\s*=\s*(["'])([\s\S]*?)\1/g;
const CLASSNAMES_IMPORT_REGEX =
  /import\s+classnames\s+from\s+["']classnames["'];?/;

function escapeForDoubleQuote(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function transformClassNameStrings(input: string): string {
  return input.replace(
    CLASSNAME_STRING_REGEX,
    (_match, _quote: string, classValue: string) => {
      const classes = classValue
        .split(/\s+/)
        .map((className) => className.trim())
        .filter(Boolean);

      const formattedClasses = classes
        .map((className) => `"${escapeForDoubleQuote(className)}"`)
        .join(", ");

      return `className={classnames([${formattedClasses}])}`;
    },
  );
}

function hasClassnamesImport(documentText: string): boolean {
  return CLASSNAMES_IMPORT_REGEX.test(documentText);
}

function getImportInsertPosition(
  document: vscode.TextDocument,
): vscode.Position {
  for (let line = 0; line < document.lineCount; line += 1) {
    const lineText = document.lineAt(line).text.trim();

    if (lineText.startsWith("import ")) {
      continue;
    }

    return new vscode.Position(line, 0);
  }

  return new vscode.Position(0, 0);
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerTextEditorCommand(
    "classnameTransformer.convertSelectionToClassnames",
    (editor) => {
      const selections = editor.selections.filter(
        (selection) => !selection.isEmpty,
      );

      if (selections.length === 0) {
        void vscode.window.showInformationMessage(
          "Select text first. No changes applied.",
        );
        return;
      }

      const documentTextBefore = editor.document.getText();
      const hadClassnamesImport = hasClassnamesImport(documentTextBefore);

      let changedSelections = 0;

      void editor.edit((editBuilder) => {
        for (const selection of selections) {
          const selectedText = editor.document.getText(selection);
          const transformedText = transformClassNameStrings(selectedText);

          if (transformedText !== selectedText) {
            editBuilder.replace(selection, transformedText);
            changedSelections += 1;
          }
        }
      });

      if (changedSelections === 0) {
        void vscode.window.showInformationMessage(
          'No valid className="..." blocks found in the selection(s).',
        );
        return;
      }

      if (hadClassnamesImport) {
        void vscode.window.showInformationMessage(
          `Converted className strings in ${changedSelections} selection${changedSelections === 1 ? "" : "s"}. classnames import already exists.`,
        );
        return;
      }

      const insertPosition = getImportInsertPosition(editor.document);
      const importStatement = 'import classnames from "classnames";\n';

      void editor.edit((editBuilder) => {
        editBuilder.insert(insertPosition, importStatement);
      });

      void vscode.window.showInformationMessage(
        `Converted className strings in ${changedSelections} selection${changedSelections === 1 ? "" : "s"} and added classnames import.`,
      );
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // noop
}
