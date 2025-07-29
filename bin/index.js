#!/usr/bin/env node
import { createProject } from './commands/createProject.js';
import { decryptFiles } from './commands/decryptFiles.js';
import { encryptFiles } from './commands/encryptFiles.js';
import { setupExistingProject } from './commands/setupExistingProject.js';
import { getConfig } from './getConfig.js';
import { GALACRYPT_OPTIONS, USAGE_TEXT } from './getOptions.js';
const COMMANDS = ['use', 'init', 'encrypt', 'decrypt'];
const command = GALACRYPT_OPTIONS._?.[0];
if (command === undefined || !COMMANDS.includes(command)) {
    console.error(`Invalid command '${command ?? ''}'`);
    console.error(USAGE_TEXT);
    process.exit(0);
}
if (command === 'init') {
    const key = createProject(GALACRYPT_OPTIONS);
    console.log('Generated key:', key);
    console.log('You should save this key in your team password managment system');
    process.exit(0);
}
if (command === 'use') {
    setupExistingProject();
    process.exit(0);
}
const config = getConfig();
if (!config.ok) {
    console.error(config.error);
    process.exit(1);
}
if (command === 'decrypt') {
    decryptFiles(config.result);
    process.exit(0);
}
if (command === 'encrypt') {
    encryptFiles(config.result);
    process.exit(0);
}
//# sourceMappingURL=index.js.map