const vscode = require('vscode');
const { default: axios } = require('axios');
const OpenAi = require('openai');
function activate(context) {
    const config = vscode.workspace.getConfiguration('chatgpt');
    const provider = new OpenAiViewProvider(context.extensionUri);
    provider.initopenai(config.get("apikey"),config.get("organization"))

    context.subscriptions.push();
}

class OpenAiViewProvider{

    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this.selectedInsideCodeblock = false;
        this.pasteOnClick = true;
        this.keepConversation = true;
        this.timeoutLength = 60;
    }

    initopenai (apiKey, organization){
        const openai = new OpenAi.OpenAI({
        apiKey: apiKey,
        organization:organization
    })}

    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        // set options for the webview
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        // set the HTML for the webview
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // add an event listener for messages received by the webview
/*         webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'codeSelected':
                    {
                        // do nothing if the pasteOnClick option is disabled
                        if (!this.pasteOnClick) {
                            break;
                        }
                        let code = data.value;
                        code = code.replace(/([^\\])(\$)([^{0-9])/g, "$1\\$$$3");
                        // insert the code as a snippet into the active text editor
                        vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(code));
                        break;
                    }
                case 'prompt':
                    {
                        //this.search(data.value);
                    }
            }
        }); */
    }

    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
				.code {
					white-space : pre;
				</style>
			</head>
			<body>
				<input class="h-10 w-full text-white bg-stone-700 p-4 text-sm" type="text" id="prompt-input" />

				<div id="response" class="pt-6 text-sm">
				</div>
			</body>
			</html>`;
    }

}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
