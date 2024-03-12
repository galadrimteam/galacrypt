import { decryptFile } from '../crypto.js';
import { FullGalacryptConfig } from '../getConfig.js';

export const decryptFiles = (config: FullGalacryptConfig) => {
  for (const file of config.files) {
    try {
      decryptFile({ inputPath: file.output, outputPath: file.input, secretKey: config.key });
      console.log(`Decrypted '${file.input}' from '${file.output}'`);
    } catch {
      console.error(`Error decrypting '${file.input}' from '${file.output}'`);
    }
  }
};
