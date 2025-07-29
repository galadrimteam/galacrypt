import { GalacryptOptions } from '../getOptions.js';
import { addPostMergeHook } from './addPostMergeHook.js';
import { addPostRewriteHook } from './addPostRewriteHook.js';
import { addPrecommitHook } from './addPrecommitHook.js';

export const addGitHooks = (options: GalacryptOptions) => {
  addPrecommitHook(options);
  addPostMergeHook(options);
  addPostRewriteHook(options);
};
