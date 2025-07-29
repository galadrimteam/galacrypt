import * as fs from 'node:fs';
import { GalacryptOptions } from '../getOptions.js';
import { gethooksPath } from './gethooksPath.js';

export const getPackageManager = (options: GalacryptOptions) => {
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

export const addHook = (hookName: string, hookContent: string, options: GalacryptOptions) => {
  const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${hookContent}`;
  const hooksPath = gethooksPath();
  const hookPath = `${hooksPath}/${hookName}`;
  const hookAlreadyExists = fs.existsSync(hookPath);

  if (hookAlreadyExists) {
    const existingHookContent = fs.readFileSync(hookPath, 'utf-8');

    if (!existingHookContent.includes('galacrypt')) {
      fs.appendFileSync(hookPath, `\n${hookContent}`);
    }

    console.info(`${hookName} hook modified, check it out here ${hookPath}`);
    return;
  }

  fs.writeFileSync(hookPath, HOOK_CONTENT_WITH_SHEBANG, { mode: 0o755 });
  console.info(`${hookName} hook added, check it out here ${hookPath}`);
};