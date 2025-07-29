import { writeGalacryptFile } from '../galacryptFileIo.js';
import { GALACRYPT_OPTIONS } from '../getOptions.js';
import { addGitHooks } from '../hooks/addGitHooks.js';
export const setupExistingProject = () => {
    const key = GALACRYPT_OPTIONS._?.[1];
    if (!key) {
        console.error('You must provide a key with the use command');
        console.error('Usage: galacrypt use <key>');
        process.exit(0);
    }
    writeGalacryptFile(key);
    console.log('Key written to .galacryptkey');
    console.log('You can now use the encrypt and decrypt commands to encrypt and decrypt your files');
    addGitHooks(GALACRYPT_OPTIONS);
};
//# sourceMappingURL=setupExistingProject.js.map