import { addPrecommitHook } from '../addPrecommitHook.js';
import { writeGalacryptFile } from '../galacryptFileIo.js';

export const setupExistingProject = (key?: string) => {
  if (!key) {
    console.error('You must provide a key with the use command');
    console.error('Usage: galacrypt use <key>');
    process.exit(0);
  }
  writeGalacryptFile(key);
  console.log('Key written to .galacryptkey');
  console.log('You can now use the read and write commands to encrypt and decrypt your files');
  addPrecommitHook();
};
