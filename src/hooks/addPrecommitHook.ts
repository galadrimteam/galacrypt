import { GalacryptOptions } from '../getOptions.js';
import { addHook, getPackageManager } from './utils.js';

export const addPrecommitHook = (options: GalacryptOptions) => {
  const packageManager = getPackageManager(options);
  const HOOK_CONTENT = `${packageManager} galacrypt encrypt --git-add`;
  addHook('pre-commit', HOOK_CONTENT, options);
};
