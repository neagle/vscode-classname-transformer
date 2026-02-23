"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const CLASSNAME_STRING_REGEX = /className\s*=\s*(["'])([\s\S]*?)\1/g;
const CLASSNAMES_IMPORT_REGEX = /import\s+classnames\s+from\s+["']classnames["'];?/;
function escapeForDoubleQuote(value) {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function transformClassNameStrings(input) {
    return input.replace(CLASSNAME_STRING_REGEX, (_match, _quote, classValue) => {
        const classes = classValue
            .split(/\s+/)
            .map((className) => className.trim())
            .filter(Boolean);
        const formattedClasses = classes.map((className) => `"${escapeForDoubleQuote(className)}"`).join(", ");
        return `className={classnames([${formattedClasses}])}`;
    });
}
function hasClassnamesImport(documentText) {
    return CLASSNAMES_IMPORT_REGEX.test(documentText);
}
function getImportInsertPosition(document) {
    for (let line = 0; line < document.lineCount; line += 1) {
        const lineText = document.lineAt(line).text.trim();
        if (lineText.startsWith("import ")) {
            continue;
        }
        return new vscode.Position(line, 0);
    }
    return new vscode.Position(0, 0);
}
function activate(context) {
    const disposable = vscode.commands.registerTextEditorCommand("classnameTransformer.convertSelectionToClassnames", (editor) => {
        const selections = editor.selections.filter((selection) => !selection.isEmpty);
        if (selections.length === 0) {
            void vscode.window.showInformationMessage("Select text first. No changes applied.");
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
            void vscode.window.showInformationMessage("No valid className=\"...\" blocks found in the selection(s).");
            return;
        }
        if (hadClassnamesImport) {
            void vscode.window.showInformationMessage(`Converted className strings in ${changedSelections} selection${changedSelections === 1 ? "" : "s"}. classnames import already exists.`);
            return;
        }
        const insertPosition = getImportInsertPosition(editor.document);
        const importStatement = 'import classnames from "classnames";\n';
        void editor.edit((editBuilder) => {
            editBuilder.insert(insertPosition, importStatement);
        });
        void vscode.window.showInformationMessage(`Converted className strings in ${changedSelections} selection${changedSelections === 1 ? "" : "s"} and added classnames import.`);
    });
    context.subscriptions.push(disposable);
}
function deactivate() {
    // noop
}
//# sourceMappingURL=extension.js.map