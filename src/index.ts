#!/usr/bin/env node

import { createProject } from './commands/createProject.js';
import { decryptFiles } from './commands/decryptFiles.js';
import { encryptFiles } from './commands/encryptFiles.js';
import { setupExistingProject } from './commands/setupExistingProject.js';
import { getConfig } from './getConfig.js';

const OLD_COMMANDS = ['read', 'write', 'create'] as const;
const COMMANDS = ['use', 'init', 'encrypt', 'decrypt'] as const;
const ALL_COMMANDS = [...OLD_COMMANDS, ...COMMANDS] as const;

type CommandAlias = (typeof ALL_COMMANDS)[number];
type Command = (typeof COMMANDS)[number];

const COMMANDS_ALIASES: { [key in CommandAlias]: Command } = {
  create: 'init',
  init: 'init',
  decrypt: 'decrypt',
  read: 'decrypt',
  encrypt: 'encrypt',
  write: 'encrypt',
  use: 'use',
};

const USAGE_TEXT = `Usage:
galacrypt init -> Setup on a new project
galacrypt use <key> -> Setup on an existing project
galacrypt encrypt -> Encrypt files
galacrypt decrypt -> Decrypt files`;

const commandAlias = process.argv[2] as CommandAlias | undefined;

if (commandAlias === undefined || process.argv.length < 3 || !ALL_COMMANDS.includes(commandAlias)) {
  console.error(USAGE_TEXT);
  process.exit(0);
}

const command = COMMANDS_ALIASES[commandAlias];

if (command === 'init') {
  const key = createProject();

  console.log('Generated key:', key);
  console.log('You should save this key in your team password managment system');
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

if (command === 'decrypt') {
  decryptFiles(config.result);
  process.exit(0);
}

if (command === 'encrypt') {
  encryptFiles(config.result);
  process.exit(0);
}
