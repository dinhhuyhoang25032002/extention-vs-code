/**
 * Copyright 2016-2022 the original author or authors from the JHipster project.
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
exports.checkJavaVersion = exports.getJavaExec = exports.toggleItem = exports.JAVA_BIN = exports.isWindows = void 0;
const path = require("path");
const cp = require("child_process");
const vscode_1 = require("vscode");
exports.isWindows = process.platform.indexOf('win') === 0;
exports.JAVA_BIN = 'java' + (exports.isWindows ? '.exe' : '');
function toggleItem(editor, item) {
    if (editor && editor.document &&
        (editor.document.languageId === 'jdl' || editor.document.languageId === 'jh')) {
        item.show();
    }
    else {
        item.hide();
    }
}
exports.toggleItem = toggleItem;
function getJavaExec() {
    let result = exports.JAVA_BIN;
    const javaHome = vscode_1.workspace.getConfiguration('java').home;
    if (javaHome) {
        const absPath = (javaHome + path.sep + 'bin' + path.sep + 'java');
        result = absPath.replace(path.sep + path.sep, path.sep);
    }
    else {
        vscode_1.window.showWarningMessage("No Java home defined in preference settings - use system defaults...");
    }
    return result;
}
exports.getJavaExec = getJavaExec;
function checkJavaVersion(javaCli) {
    return __awaiter(this, void 0, void 0, function* () {
        let javaVersion = yield getJavaVersion(javaCli);
        return new Promise((resolve, reject) => {
            if (javaVersion < 11) {
                let errmsg = 'Java 11 or more recent is required to run JHipster IDE extension!';
                vscode_1.window.showErrorMessage(errmsg);
                throw new Error(errmsg);
            }
            return resolve(javaVersion);
        });
    });
}
exports.checkJavaVersion = checkJavaVersion;
function getJavaVersion(javaCli) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            cp.execFile(javaCli, ['-version'], {}, (error, stdout, stderr) => {
                const match = (/version "(.*)"/g).exec(stderr);
                if (!match) {
                    return resolve(0);
                }
                resolve(getJavaMajorVersion(match[1]));
            });
        });
    });
}
function getJavaMajorVersion(version) {
    let input = version.startsWith('1.') ? version.substring(2) : version;
    const match = (/\d+/g).exec(input);
    return match ? parseInt(match[0]) : 0;
}
//# sourceMappingURL=extension-helper.js.map