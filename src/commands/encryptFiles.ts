import { encryptFile } from '../crypto.js';
import { FullGalacryptConfig } from '../getConfig.js';

export const encryptFiles = (config: FullGalacryptConfig) => {
  for (const file of config.files) {
    try {
      encryptFile({ inputPath: file.input, outputPath: file.output, secretKey: config.key });
    } catch {
      console.error(`Error encrypting '${file.output}' from '${file.input}'`);
    }
  }
};
