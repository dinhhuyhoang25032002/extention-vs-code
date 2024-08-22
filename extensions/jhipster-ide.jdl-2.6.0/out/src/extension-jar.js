/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Serano Colameo - Initial contribution and API
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode = require("vscode");
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const plantuml_1 = require("./plantuml");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const extension_helper_1 = require("./extension-helper");
let plantuml;
const LANGUAGE_CLIENT_ID = 'LANGUAGE_ID_JDL';
function activate(context) {
    //	const vmargs = '-Dpnguml.gen=true -agentlib:jdwp=transport=dt_socket,server=n,suspend=y,address=9900';
    const lib = context.asAbsolutePath(path.join('./lib/jdl.jar'));
    let javaCli = extension_helper_1.getJavaExec();
    extension_helper_1.checkJavaVersion(javaCli).catch(error => {
        vscode_1.window.showErrorMessage(error.message, error.label).then((selection) => {
            if (error.label && error.label === selection && error.command) {
                vscode_1.commands.executeCommand(error.command, error.commandParam);
            }
        });
        throw error;
    }).then((requirements) => __awaiter(this, void 0, void 0, function* () {
        let serverOptions = {
            command: javaCli,
            //		args: [ vmargs, '-jar', lib, 'io.github.jhipster.jdl.ide.server.JdlServerLauncher' ],
            args: ['-server', '-Xverify:none', '-Xms2048m', '-Xmx2048m', '-Xmn512m',
                '-Xss2m', '-Dpnguml.gen=true', '-cp', lib, 'org.eclipse.xtext.ide.server.ServerLauncher'],
            //			args: [ vmargs, '-cp', lib, 'io.github.jhipster.jdl.ide.server.JdlServerLauncher' ],
            options: { stdio: 'pipe' }
        };
        let clientOptions = {
            documentSelector: ['jdl', 'jh'],
            synchronize: {
                configurationSection: 'jdlLanguageServer',
                fileEvents: [
                    vscode_1.workspace.createFileSystemWatcher('**/*.jdl'),
                    vscode_1.workspace.createFileSystemWatcher('**/*.jh')
                ]
            }
        };
        let item = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, Number.MIN_VALUE);
        item.text = 'Starting JDL Language Server...';
        extension_helper_1.toggleItem(vscode_1.window.activeTextEditor, item);
        let languageClient = new vscode_languageclient_1.LanguageClient(LANGUAGE_CLIENT_ID, 'Language Support for JDL', serverOptions, clientOptions);
        languageClient.onReady().then(() => {
            item.text = 'JDL Language Server started!';
            extension_helper_1.toggleItem(vscode_1.window.activeTextEditor, item);
        });
        languageClient.trace = vscode_jsonrpc_1.Trace.Off;
        //		languageClient.trace = Trace.Verbose;
        let disposable = languageClient.start();
        const activeEditor = vscode.window.activeTextEditor;
        vscode_1.window.onDidChangeActiveTextEditor((editor) => {
            extension_helper_1.toggleItem(activeEditor, item);
        });
        context.subscriptions.push(disposable);
        plantuml = new plantuml_1.PlantUMLRenderer(context);
        plantuml.init(languageClient);
    }));
}
exports.activate = activate;
function deactivate() {
    plantuml = null;
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension-jar.js.map