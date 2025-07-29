import * as fs from 'node:fs';
import { GalacryptOptions } from '../getOptions.js';
import { gethooksPath } from './gethooksPath.js';

const getPackageManager = (options: GalacryptOptions) => {
  if (options['--pnpm']) {
    return 'pnpm';
  }
  if (options['--npm']) {
    return 'npx';
  }
  if (options['--bun']) {
    return 'bun';
  }
  if (options['--package-manager']) {
    return options['--package-manager'];
  }
  return 'yarn';
};

export const addPostRewriteHook = (options: GalacryptOptions) => {
  const packageManager = getPackageManager(options);
  const HOOK_CONTENT = `${packageManager} galacrypt decrypt\n`;
  const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${HOOK_CONTENT}`;
  const hooksPath = gethooksPath();
  const postRewritePath = `${hooksPath}/post-rewrite`;
  const hookAlreadyExists = fs.existsSync(postRewritePath);

  if (hookAlreadyExists) {
    const hookContent = fs.readFileSync(postRewritePath, 'utf-8');

    if (!hookContent.includes('galacrypt')) {
      fs.appendFileSync(postRewritePath, `\n${HOOK_CONTENT}`);
    }

    console.info(`post-rewrite hook modified, check it out here ${postRewritePath}`);
    return;
  }

  fs.writeFileSync(postRewritePath, HOOK_CONTENT_WITH_SHEBANG, { mode: 0o755 });
  console.info(`post-rewrite hook added, check it out here ${postRewritePath}`);
};

