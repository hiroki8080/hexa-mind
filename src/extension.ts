import * as vscode from 'vscode';
import { HexaMindEditorProvider } from './hexaMindEditor';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(HexaMindEditorProvider.register(context));
}
