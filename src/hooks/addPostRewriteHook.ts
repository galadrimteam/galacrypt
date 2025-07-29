import { GalacryptOptions } from '../getOptions.js';
import { addHook, getPackageManager } from './utils.js';

export const addPostRewriteHook = (options: GalacryptOptions) => {
  const packageManager = getPackageManager(options);
  const HOOK_CONTENT = `${packageManager} galacrypt decrypt\n`;
  addHook('post-rewrite', HOOK_CONTENT, options);
};

