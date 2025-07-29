import { addHook, getPackageManager } from './utils.js';
export const addPrecommitHook = (options) => {
    const packageManager = getPackageManager(options);
    const HOOK_CONTENT = `${packageManager} galacrypt encrypt --git-add`;
    addHook('pre-commit', HOOK_CONTENT);
};
//# sourceMappingURL=addPrecommitHook.js.map