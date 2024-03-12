import * as fs from 'node:fs';

const HOOK_CONTENT = `#!/bin/sh
yarn galacrypt write --git-add
`;

const PRE_COMMIT_PATH = '.git/hooks/pre-commit';

export const addPrecommitHook = () => {
  const hookAlreadyExists = fs.existsSync(PRE_COMMIT_PATH);

  if (hookAlreadyExists) {
    console.info(`a precommit hook already exists, check it out here ${PRE_COMMIT_PATH}`);
    console.info('if you want to overwrite it, delete it and run this command again');
    return;
  }

  fs.writeFileSync(PRE_COMMIT_PATH, HOOK_CONTENT, { mode: 0o755 });
  console.info(`precommit hook added, check it out here ${PRE_COMMIT_PATH}`);
};
