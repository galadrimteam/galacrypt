import { execSync } from 'node:child_process';
import { encryptFile } from '../crypto.js';
import { FullGalacryptConfig } from '../getConfig.js';

export const encryptFiles = (config: FullGalacryptConfig) => {
  const shouldGitAdd = process.argv.includes('--git-add');

  for (const file of config.files) {
    try {
      encryptFile({ inputPath: file.input, outputPath: file.output, secretKey: config.key });

      if (shouldGitAdd) {
        execSync(`git add ${file.output}`);
      }
    } catch {
      console.error(`Error encrypting '${file.output}' from '${file.input}'`);
    }
  }
};
