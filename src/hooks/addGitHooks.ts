import { addPostMergeHook } from './addPostMergeHook.js';
import { addPostRewriteHook } from './addPostRewriteHook.js';
import { addPrecommitHook } from './addPrecommitHook.js';

export const addGitHooks = () => {
  addPrecommitHook();
  addPostMergeHook();
  addPostRewriteHook();
};
