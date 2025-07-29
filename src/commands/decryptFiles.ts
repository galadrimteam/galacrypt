import { decryptFile } from '../crypto.js';
import { FullGalacryptConfig } from '../getConfig.js';
import { GALACRYPT_OPTIONS } from '../getOptions.js';
import { getOnlyOption } from './onlyOption.js';

export const decryptFiles = (config: FullGalacryptConfig) => {
  const onlyOption = getOnlyOption(config, 'decrypt');
  const decryptAllFiles = GALACRYPT_OPTIONS['--all'];

  if (!onlyOption.ok) {
    console.error(onlyOption.error);
    process.exit(1);
  }

  for (const file of config.files) {
    if (onlyOption.only && !onlyOption.only.has(file.output)) {
      continue;
    }
    if (!onlyOption.only && !decryptAllFiles && file.disableImplicitDecrypt) {
      continue;
    }
    try {
      const decrypted = decryptFile({ inputPath: file.output, outputPath: file.input, secretKey: config.key });
      if (decrypted) {
        console.log(`Decrypted '${file.input}' from '${file.output}'`);
      } else {
        console.log(`Skipped '${file.input}' (already decrypted or invalid format)`);
      }
    } catch {
      console.error(`Error decrypting '${file.input}' from '${file.output}'`);
    }
  }
};
