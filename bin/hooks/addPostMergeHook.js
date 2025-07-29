import { addHook, getPackageManager } from './utils.js';
export const addPostMergeHook = (options) => {
    const packageManager = getPackageManager(options);
    const HOOK_CONTENT = `${packageManager} galacrypt decrypt\n`;
    addHook('post-merge', HOOK_CONTENT);
};
//# sourceMappingURL=addPostMergeHook.js.map