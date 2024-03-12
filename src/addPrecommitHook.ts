import { execSync } from 'node:child_process';
import * as fs from 'node:fs';

const HOOK_CONTENT = `yarn galacrypt write --git-add\n`;
const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${HOOK_CONTENT}`;
const DEFAULT_HOOKS_PATH = '.git/hooks';
const HUSKY_DIR = '.husky';

const gethooksPath = () => {
  const huskyExists = fs.existsSync(HUSKY_DIR);

  if (huskyExists) {
    return HUSKY_DIR;
  }

  try {
    const path = execSync('git config core.hooksPath').toString();

    return path.trim();
  } catch {
    return DEFAULT_HOOKS_PATH;
  }
};

export const addPrecommitHook = () => {
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
