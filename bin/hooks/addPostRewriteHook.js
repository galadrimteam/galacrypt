import { addHook, getPackageManager } from './utils.js';
export const addPostRewriteHook = (options) => {
    const packageManager = getPackageManager(options);
    const HOOK_CONTENT = `${packageManager} galacrypt decrypt\n`;
    addHook('post-rewrite', HOOK_CONTENT);
};
//# sourceMappingURL=addPostRewriteHook.js.map