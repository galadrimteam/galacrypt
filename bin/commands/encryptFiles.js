import { execSync } from 'node:child_process';
import { encryptFile } from '../crypto.js';
import { getOnlyOption } from './onlyOption.js';
export const encryptFiles = (config) => {
    const shouldGitAdd = process.argv.includes('--git-add');
    const onlyOption = getOnlyOption(config, 'encrypt');
    if (!onlyOption.ok) {
        console.error(onlyOption.error);
        process.exit(1);
    }
    for (const file of config.files) {
        if (onlyOption.only && !onlyOption.only.has(file.input)) {
            continue;
        }
        try {
            encryptFile({ inputPath: file.input, outputPath: file.output, secretKey: config.key });
            if (shouldGitAdd) {
                execSync(`git add ${file.output}`);
            }
        }
        catch {
            console.error(`Error encrypting '${file.output}' from '${file.input}'`);
        }
    }
};
//# sourceMappingURL=encryptFiles.js.map