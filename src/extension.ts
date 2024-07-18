import { spawnSync } from 'child_process';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// whole formatter implemented using API
	let registerFormatter = vscode.languages.registerDocumentFormattingEditProvider('racket', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<vscode.TextEdit[]> {
			const original = document.getText();
			let result = spawnSync('raco', ['fmt'], { 'input': original });
			let start = document.positionAt(0);
			let end = document.positionAt(original.length);
			let formatted = result.stdout.toString();
			return [vscode.TextEdit.replace(new vscode.Range(start, end), formatted === '' ? original : formatted)];
		}
	});

	// range formatter implemented using API
	let registerRangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider('racket', {
		provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<vscode.TextEdit[]> {
			let start = document.offsetAt(range.start);
			let end = document.offsetAt(range.end);
			const original = document.getText().substring(start, end);
			let result = spawnSync('raco', ['fmt'], { 'input': original });
			let formatted = result.stdout.toString();
			return [vscode.TextEdit.replace(range, formatted === '' ? original : formatted)];
		}
	});

	context.subscriptions.push(registerFormatter);
	context.subscriptions.push(registerRangeFormatter);
}

// This method is called when your extension is deactivated
export function deactivate() { }
