#!/usr/bin/env node
import { createProject } from './commands/createProject.js';
import { decryptFiles } from './commands/decryptFiles.js';
import { encryptFiles } from './commands/encryptFiles.js';
import { setupExistingProject } from './commands/setupExistingProject.js';
import { getConfig } from './getConfig.js';
const COMMANDS = ['read', 'write', 'create', 'use'];
// command should be 'read' or 'write'
if (process.argv.length < 3 || !COMMANDS.includes(process.argv[2])) {
    console.error(`Usage: galacrypt ${COMMANDS.join('|')}`);
    process.exit(1);
}
const command = process.argv[2];
if (command === 'create') {
    const key = createProject();
    console.log('Generated key:', key);
    console.log('YOU MUST SAVE THIS KEY INTO PASSBOLT AND SHARE IT WITH YOUR TEAM');
    process.exit(0);
}
if (command === 'use') {
    setupExistingProject(process.argv?.[3]);
    process.exit(0);
}
const config = getConfig();
if (!config.ok) {
    console.error(config.error);
    process.exit(1);
}
if (command === 'read') {
    decryptFiles(config.result);
    process.exit(0);
}
if (command === 'write') {
    encryptFiles(config.result);
    process.exit(0);
}
//# sourceMappingURL=index.js.map