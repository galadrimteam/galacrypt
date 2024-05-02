import * as fs from 'node:fs';
import { gethooksPath } from './gethooksPath.js';
const HOOK_CONTENT = `yarn galacrypt decrypt\n`;
const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${HOOK_CONTENT}`;
export const addPostMergeHook = () => {
    const hooksPath = gethooksPath();
    const postMergePath = `${hooksPath}/post-merge`;
    const hookAlreadyExists = fs.existsSync(postMergePath);
    if (hookAlreadyExists) {
        const hookContent = fs.readFileSync(postMergePath, 'utf-8');
        if (!hookContent.includes('galacrypt')) {
            fs.appendFileSync(postMergePath, `\n${HOOK_CONTENT}`);
        }
        console.info(`post-merge hook modified, check it out here ${postMergePath}`);
        return;
    }
    fs.writeFileSync(postMergePath, HOOK_CONTENT_WITH_SHEBANG, { mode: 0o755 });
    console.info(`post-merge hook added, check it out here ${postMergePath}`);
};
//# sourceMappingURL=addPostMergeHook.js.map