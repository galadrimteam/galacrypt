import * as crypto from 'crypto';
import * as fs from 'node:fs';
import { writeGalacryptFile } from '../galacryptFileIo.js';
import { GalacryptOptions } from '../getOptions.js';
import { addGitHooks } from '../hooks/addGitHooks.js';

const DEFAULT_CONFIG_FILE = `{
  "files": []
}
`;

export const createProject = (options: GalacryptOptions) => {
  const keyBinary = crypto.randomBytes(32);
  const keyHex = keyBinary.toString('hex');

  writeGalacryptFile(keyHex);

  if (!fs.existsSync('.galacryptrc.json')) {
    fs.writeFileSync('.galacryptrc.json', DEFAULT_CONFIG_FILE);
  }

  addGitHooks(options);

  return keyHex;
};
