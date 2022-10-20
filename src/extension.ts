import { spawnSync } from 'child_process';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "racket-fmt" is now active!');


	// whole formatter implemented using API
	let registerFormatter = vscode.languages.registerDocumentFormattingEditProvider('racket', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<vscode.TextEdit[]> {
			let result = spawnSync('raco', ['fmt'], { 'input': document.getText() });
			let start = document.positionAt(0);
			let end = document.positionAt(document.getText().length);
			let formatted = result.stdout.toString();
			return [vscode.TextEdit.replace(new vscode.Range(start, end), formatted)];
		}
	});

	// range formatter implemented using API
	let registerRangeFormatter = vscode.languages.registerDocumentRangeFormattingEditProvider('racket', {
		provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<vscode.TextEdit[]> {
			let start = document.offsetAt(range.start);
			let end = document.offsetAt(range.end);
			let result = spawnSync('raco', ['fmt'], { 'input': document.getText().substring(start, end) });
			let formatted = result.stdout.toString();
			return [vscode.TextEdit.replace(range, formatted)];
		}
	});

	context.subscriptions.push(registerFormatter);
	context.subscriptions.push(registerRangeFormatter);
}

// This method is called when your extension is deactivated
export function deactivate() { }
