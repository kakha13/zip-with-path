"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
function activate(context) {
    console.log('VS Code Zip Path extension is now active!');
    const zipFile = vscode.commands.registerCommand('vscodeZipPath.zipFile', async (uri) => {
        if (!uri) {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage('No file selected');
                return;
            }
            uri = activeEditor.document.uri;
        }
        await zipResource(uri, 'file', true);
    });
    const zipFileSimple = vscode.commands.registerCommand('vscodeZipPath.zipFileSimple', async (uri) => {
        if (!uri) {
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage('No file selected');
                return;
            }
            uri = activeEditor.document.uri;
        }
        await zipResource(uri, 'file', false);
    });
    const zipFolder = vscode.commands.registerCommand('vscodeZipPath.zipFolder', async (uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No folder selected');
            return;
        }
        await zipResource(uri, 'folder', true);
    });
    const zipFolderSimple = vscode.commands.registerCommand('vscodeZipPath.zipFolderSimple', async (uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No folder selected');
            return;
        }
        await zipResource(uri, 'folder', false);
    });
    const zipSelected = vscode.commands.registerCommand('vscodeZipPath.zipSelected', async (uri, allUris) => {
        if (!allUris || allUris.length === 0) {
            vscode.window.showErrorMessage('No files selected');
            return;
        }
        await zipMultipleResources(allUris, true);
    });
    const zipSelectedSimple = vscode.commands.registerCommand('vscodeZipPath.zipSelectedSimple', async (uri, allUris) => {
        if (!allUris || allUris.length === 0) {
            vscode.window.showErrorMessage('No files selected');
            return;
        }
        await zipMultipleResources(allUris, false);
    });
    const zipWorkspace = vscode.commands.registerCommand('vscodeZipPath.zipWorkspace', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }
        if (workspaceFolders.length === 1) {
            await zipResource(workspaceFolders[0].uri, 'workspace', true);
        }
        else {
            const selected = await vscode.window.showQuickPick(workspaceFolders.map(folder => ({
                label: folder.name,
                description: folder.uri.fsPath,
                uri: folder.uri
            })), { placeHolder: 'Select workspace folder to zip' });
            if (selected) {
                await zipResource(selected.uri, 'workspace', true);
            }
        }
    });
    context.subscriptions.push(zipFile, zipFileSimple, zipFolder, zipFolderSimple, zipSelected, zipSelectedSimple, zipWorkspace);
}
exports.activate = activate;
async function zipResource(uri, type, preservePath = true) {
    try {
        const resourcePath = uri.fsPath;
        const resourceName = path.basename(resourcePath);
        const parentDir = path.dirname(resourcePath);
        if (!isWithinWorkspace(uri)) {
            vscode.window.showErrorMessage('Can only zip files within the workspace for safety');
            return;
        }
        const stats = await fs.promises.stat(resourcePath);
        if (type === 'file' && stats.isDirectory()) {
            vscode.window.showErrorMessage('Selected resource is a directory, not a file');
            return;
        }
        if ((type === 'folder' || type === 'workspace') && !stats.isDirectory()) {
            vscode.window.showErrorMessage('Selected resource is not a directory');
            return;
        }
        const baseName = path.parse(resourceName).name;
        const zipPath = await getUniqueZipPath(parentDir, baseName);
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        const workspaceRoot = workspaceFolder ? workspaceFolder.uri.fsPath : '';
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating ${path.basename(zipPath)}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            return new Promise((resolve, reject) => {
                output.on('close', () => {
                    const sizeKB = (archive.pointer() / 1024).toFixed(2);
                    vscode.window.showInformationMessage(`✅ ${path.basename(zipPath)} created successfully (${sizeKB} KB) at ${parentDir}`);
                    resolve();
                });
                archive.on('error', (err) => {
                    reject(err);
                });
                archive.pipe(output);
                if (stats.isFile()) {
                    const relativePath = preservePath && workspaceRoot
                        ? path.relative(workspaceRoot, resourcePath)
                        : resourceName;
                    archive.file(resourcePath, { name: relativePath });
                }
                else {
                    const relativePath = preservePath && workspaceRoot
                        ? path.relative(workspaceRoot, resourcePath)
                        : resourceName;
                    archive.directory(resourcePath, relativePath);
                }
                progress.report({ increment: 50 });
                archive.finalize();
                progress.report({ increment: 100 });
            });
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`⚠️ Failed to zip: ${errorMessage}`);
    }
}
async function zipMultipleResources(uris, preservePath = true) {
    try {
        for (const uri of uris) {
            if (!isWithinWorkspace(uri)) {
                vscode.window.showErrorMessage('Can only zip files within the workspace for safety');
                return;
            }
        }
        const firstUri = uris[0];
        const parentDir = path.dirname(firstUri.fsPath);
        const zipName = uris.length === 1 ? path.parse(path.basename(firstUri.fsPath)).name : 'selected_files';
        const zipPath = await getUniqueZipPath(parentDir, zipName);
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(firstUri);
        const workspaceRoot = workspaceFolder ? workspaceFolder.uri.fsPath : '';
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Creating ${path.basename(zipPath)}...`,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            return new Promise(async (resolve, reject) => {
                output.on('close', () => {
                    const sizeKB = (archive.pointer() / 1024).toFixed(2);
                    vscode.window.showInformationMessage(`✅ ${path.basename(zipPath)} created successfully (${sizeKB} KB) at ${parentDir}`);
                    resolve();
                });
                archive.on('error', (err) => {
                    reject(err);
                });
                archive.pipe(output);
                const progressIncrement = 80 / uris.length;
                for (let i = 0; i < uris.length; i++) {
                    const uri = uris[i];
                    const resourcePath = uri.fsPath;
                    const stats = await fs.promises.stat(resourcePath);
                    if (stats.isFile()) {
                        const relativePath = preservePath && workspaceRoot
                            ? path.relative(workspaceRoot, resourcePath)
                            : path.basename(resourcePath);
                        archive.file(resourcePath, { name: relativePath });
                    }
                    else {
                        const relativePath = preservePath && workspaceRoot
                            ? path.relative(workspaceRoot, resourcePath)
                            : path.basename(resourcePath);
                        archive.directory(resourcePath, relativePath);
                    }
                    progress.report({ increment: progressIncrement });
                }
                archive.finalize();
                progress.report({ increment: 100 });
            });
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`⚠️ Failed to zip selected files: ${errorMessage}`);
    }
}
async function getUniqueZipPath(parentDir, baseName) {
    let zipPath = path.join(parentDir, `${baseName}.zip`);
    let counter = 1;
    while (await fileExists(zipPath)) {
        zipPath = path.join(parentDir, `${baseName}(${counter}).zip`);
        counter++;
    }
    return zipPath;
}
async function fileExists(filePath) {
    try {
        await fs.promises.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
function isWithinWorkspace(uri) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return false;
    }
    const resourcePath = uri.fsPath;
    return workspaceFolders.some(folder => {
        const workspacePath = folder.uri.fsPath;
        return resourcePath.startsWith(workspacePath);
    });
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map