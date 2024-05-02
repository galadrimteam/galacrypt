import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
const DEFAULT_HOOKS_PATH = '.git/hooks';
const HUSKY_DIR = '.husky';
export const gethooksPath = () => {
    const huskyExists = fs.existsSync(HUSKY_DIR);
    if (huskyExists) {
        return HUSKY_DIR;
    }
    try {
        const path = execSync('git config core.hooksPath').toString();
        return path.trim();
    }
    catch {
        return DEFAULT_HOOKS_PATH;
    }
};
//# sourceMappingURL=gethooksPath.js.map