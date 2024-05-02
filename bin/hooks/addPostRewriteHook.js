import * as fs from 'node:fs';
import { gethooksPath } from './gethooksPath.js';
const HOOK_CONTENT = `yarn galacrypt decrypt\n`;
const HOOK_CONTENT_WITH_SHEBANG = `#!/bin/sh\n${HOOK_CONTENT}`;
export const addPostRewriteHook = () => {
    const hooksPath = gethooksPath();
    const postRewritePath = `${hooksPath}/post-rewrite`;
    const hookAlreadyExists = fs.existsSync(postRewritePath);
    if (hookAlreadyExists) {
        const hookContent = fs.readFileSync(postRewritePath, 'utf-8');
        if (!hookContent.includes('galacrypt')) {
            fs.appendFileSync(postRewritePath, `\n${HOOK_CONTENT}`);
        }
        console.info(`post-rewrite hook modified, check it out here ${postRewritePath}`);
        return;
    }
    fs.writeFileSync(postRewritePath, HOOK_CONTENT_WITH_SHEBANG, { mode: 0o755 });
    console.info(`post-rewrite hook added, check it out here ${postRewritePath}`);
};
//# sourceMappingURL=addPostRewriteHook.js.map