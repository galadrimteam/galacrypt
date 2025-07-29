import { GalacryptOptions } from '../getOptions.js';
import { addHook, getPackageManager } from './utils.js';

export const addPostMergeHook = (options: GalacryptOptions) => {
  const packageManager = getPackageManager(options);
  const HOOK_CONTENT = `${packageManager} galacrypt decrypt\n`;
  addHook('post-merge', HOOK_CONTENT);
};
