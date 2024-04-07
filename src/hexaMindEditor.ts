import * as vscode from 'vscode';
import { getNonce } from './util';

export class HexaMindEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new HexaMindEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(HexaMindEditorProvider.viewType, provider);
		return providerRegistration;
	}

	private static readonly viewType = 'hexaMind.mindMap';

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case 'set':
          this.setData(document, e.data);
					return;
			}
		});

		updateWebview();
	}

	private getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'main.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'main.css'));
		const nonce = getNonce();

        return `<!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="${styleUri}">
            <title>Document</title>
        </head>
        <body>
          <div class="hexamind-area">
            <div class="hexamind-wrapper">
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="1-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="1-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="2-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drag" id="2-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="2-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="2-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drag" id="2-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="2-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="2-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drag" id="2-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="2-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="3-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="3-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="4-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="4-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="5-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="5-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="6-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="6-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="7-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="7-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="8-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="8-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="9-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="9-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="10-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="10-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="11-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="11-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="12-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="12-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="13-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="13-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="14-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="14-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line">
                <div class="hexamind-hexagon drop" id="15-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="15-9">
                  <div><input type="text"></div>
                </div>
              </div>
              <div class="hexamind-hexagons hexamind-hexagons-line2">
                <div class="hexamind-hexagon drop" id="16-1">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-2">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-3">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-4">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-5">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-6">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-7">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-8">
                  <div><input type="text"></div>
                </div>
                <div class="hexamind-hexagon drop" id="16-9">
                  <div><input type="text"></div>
                </div>
              </div>
            </div>
          </div>
          <script  nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
        `;
	}

	private setData(document: vscode.TextDocument, data: { id: string; text: string; }[]) {
		const json = this.getDocumentAsJson(document);
    json.data = Array.isArray(json.data) ? json.data : []
    var isUpdate = false;
    data.forEach((element: { id: string; text: string; }) => {
      json.data.forEach((saved_element: { id: string; text: string; }) => {
        if (saved_element.id == element.id) {
          saved_element.text = element.text;
          isUpdate = true;
        }
      });
      if (!isUpdate) {
        json.data.push({id: element.id, text: element.text})
      }
    });
    return this.updateTextDocument(document, json);
	}

	private getDocumentAsJson(document: vscode.TextDocument): any {
		const text = document.getText();
		if (text.trim().length === 0) {
			return {};
		}

		try {
			return JSON.parse(text);
		} catch {
			throw new Error('Could not get document as json. Content is not valid json');
		}
	}

	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			JSON.stringify(json, null, 2));

		return vscode.workspace.applyEdit(edit);
	}
}