const vscode = require("vscode");
const bcd = require("@mdn/browser-compat-data");

function activate(context) {
  // Register a WebviewViewProvider for "baseline-view"
  const provider = {
    resolveWebviewView(webviewView) {
      webviewView.webview.options = { enableScripts: true };

      // Get some real data (Flexbox feature support)
      const flexboxData = bcd.css.properties.display.flex_support;

      let browserSupport = "";
      if (flexboxData && flexboxData.__compat && flexboxData.__compat.support) {
        const supportData = flexboxData.__compat.support;
        for (const [browser, info] of Object.entries(supportData)) {
          const version = Array.isArray(info) ? info[0].version_added : info.version_added;
          browserSupport += `<li><b>${browser}</b>: ${version ? "✅ since " + version : "❌ not supported"}</li>`;
        }
      } else {
        browserSupport = "<li>No data found</li>";
      }

      webviewView.webview.html = getWebviewContent(browserSupport);
    }
  };

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("baseline-view", provider)
  );
}

function getWebviewContent(browserSupport) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: sans-serif;
          padding: 10px;
        }
        h2 {
          color: #0078d7;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <h2>🌐 Baseline Browser Support</h2>
      <p><b>Feature:</b> Flexbox</p>
      <ul>
        ${browserSupport}
      </ul>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = { activate, deactivate };
