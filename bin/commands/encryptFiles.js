import { execSync } from 'node:child_process';
import { encryptFile } from '../crypto.js';
import { GALACRYPT_OPTIONS } from '../getOptions.js';
import { getOnlyOption } from './onlyOption.js';
export const encryptFiles = (config) => {
    const shouldGitAdd = GALACRYPT_OPTIONS['--git-add'];
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
            const encrypted = encryptFile({ inputPath: file.input, outputPath: file.output, secretKey: config.key });
            if (encrypted) {
                console.log(`Encrypted '${file.input}' to '${file.output}'`);
                if (shouldGitAdd) {
                    execSync(`git add ${file.output}`);
                }
            }
            else {
                console.log(`Skipped '${file.input}' (already encrypted)`);
            }
        }
        catch {
            console.error(`Error encrypting '${file.output}' from '${file.input}'`);
        }
    }
};
//# sourceMappingURL=encryptFiles.js.map