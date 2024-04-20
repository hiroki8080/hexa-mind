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
    const linkImgUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri, 'media', 'link.png'));
    const memoImgUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri, 'media', 'memo.png'));
    const nonce = getNonce();

      var html = `<!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="${styleUri}">
            <title>Document</title>
        </head>
        <body>
          <div class="hexamind-area">
            <div class="hexamind-wrapper">`;
            for (let index = 1; index <= 16; index++) {
              html += this.createRowElement(index, linkImgUri, memoImgUri);
            }
          html += `</div>
          </div>
          <div id="modal" class="modal">
            <div class="modal-wrapper">
              <div class="modal-head">
                <button class="close">close</button>
                <input type="hidden" id="modal-type">
                <input type="hidden" id="modal-id">
                <input type="hidden" id="modal-target-id">
              </div>
              <div class="modal-body">
                <textarea id="modal-value" rows="5" cols="50"></textarea>
              </div>
            </div>
          </div>
          <script  nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
        `;
        return html;
	}

  private createRowElement(index: number, linkImgUri: vscode.Uri, memoImgUri: vscode.Uri){
    const lineClass = index % 2 == 0 ? "hexamind-hexagons-line2" : "hexamind-hexagons-line";
    const html = `
              <div class="hexamind-hexagons ${lineClass}">
                <div class="hexamind-hexagon drop" id="${index}-1">
                  <div>
                    <input type="text" id="${index}-1-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-1-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-1-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-2">
                  <div>
                    <input type="text" id="${index}-2-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-2-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-2-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-3">
                  <div>
                    <input type="text" id="${index}-3-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-3-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-3-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-4">
                  <div>
                    <input type="text" id="${index}-4-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-4-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-4-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-5">
                  <div>
                    <input type="text" id="${index}-5-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-5-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-5-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-6">
                  <div>
                    <input type="text" id="${index}-6-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-6-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-6-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-7">
                  <div>
                    <input type="text" id="${index}-7-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-7-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-7-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-8">
                  <div>
                    <input type="text" id="${index}-8-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-8-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-8-memo"></a>
                  </div>
                </div>
                <div class="hexamind-hexagon drop" id="${index}-9">
                  <div>
                    <input type="text" id="${index}-9-text">
                    <a href="" class="link"><img src="${linkImgUri}" alt="link"><input type="hidden" id="${index}-9-link"></a>
                    <a href="" class="memo"><img src="${memoImgUri}" alt="memo"><input type="hidden" id="${index}-9-memo"></a>
                  </div>
                </div>
              </div>
    `;
    return html;
  }

	private setData(document: vscode.TextDocument, data: { id: string; text: string; link: string; memo: string;}[]) {
		const json = this.getDocumentAsJson(document);
    json.data = Array.isArray(json.data) ? json.data : []
    var isUpdate = false;
    data.forEach((element: { id: string; text: string; link: string; memo: string;}) => {
      json.data.forEach((saved_element: { id: string; text: string; link: string; memo: string;}) => {
        if (saved_element.id == element.id) {
          saved_element.text = element.text;
          saved_element.link = element.link;
          saved_element.memo = element.memo;
          isUpdate = true;
        }
      });
      if (!isUpdate) {
        json.data.push({id: element.id, text: element.text, link: element.link, memo: element.memo})
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