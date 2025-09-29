// extension.js
const vscode = require("vscode");
const bcd = require("@mdn/browser-compat-data");

function activate(context) {
  // Register a hover provider for CSS
  const hover = vscode.languages.registerHoverProvider("css", {
    provideHover(document, position) {
      const word = document.getText(document.getWordRangeAtPosition(position));
      const cssData = bcd.css.properties[word];

      if (cssData) {
        const baseline = cssData.__compat.mdn_url
          ? `[View Baseline Info](${cssData.__compat.mdn_url})`
          : "No Baseline info found.";

        return new vscode.Hover(`🌐 Baseline: ${baseline}`);
      }
    },
  });

  context.subscriptions.push(hover);
}

function deactivate() {}

module.exports = { activate, deactivate };
