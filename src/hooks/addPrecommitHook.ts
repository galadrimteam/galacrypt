import * as fs from 'node:fs';
import { GalacryptOptions } from '../getOptions.js';
import { gethooksPath } from './gethooksPath.js';

const getPackageManager = (options: GalacryptOptions) => {
  if (options['--pnpm']) {
    return 'pnpm';
  }
  if (options['--npm']) {
    return 'npm';
  }
  if (options['--bun']) {
    return 'bun';
  }
  if (options['--package-manager']) {
    return options['--package-manager'];
  }
  return 'yarn';
};

export const addPrecommitHook = (options: GalacryptOptions) => {
  const packageManager = getPackageManager(options);
  const HOOK_CONTENT = `${packageManager} galacrypt encrypt --git-add\n`;
  const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${HOOK_CONTENT}`;
  const hooksPath = gethooksPath();
  const preCommitPath = `${hooksPath}/pre-commit`;
  const hookAlreadyExists = fs.existsSync(preCommitPath);

  if (hookAlreadyExists) {
    const hookContent = fs.readFileSync(preCommitPath, 'utf-8');

    if (!hookContent.includes('galacrypt')) {
      fs.appendFileSync(preCommitPath, `\n${HOOK_CONTENT}`);
    }

    console.info(`precommit hook modified, check it out here ${preCommitPath}`);
    return;
  }

  fs.writeFileSync(preCommitPath, HOOK_CONTENT_WITH_SHEBANG, { mode: 0o755 });
  console.info(`precommit hook added, check it out here ${preCommitPath}`);
};
