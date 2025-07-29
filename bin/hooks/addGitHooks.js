import { addPostMergeHook } from './addPostMergeHook.js';
import { addPostRewriteHook } from './addPostRewriteHook.js';
import { addPrecommitHook } from './addPrecommitHook.js';
export const addGitHooks = (options) => {
    addPrecommitHook(options);
    addPostMergeHook(options);
    addPostRewriteHook(options);
};
//# sourceMappingURL=addGitHooks.js.map