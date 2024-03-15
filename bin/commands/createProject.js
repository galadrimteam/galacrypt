import * as crypto from 'crypto';
import * as fs from 'node:fs';
import { addPrecommitHook } from '../addPrecommitHook.js';
import { writeGalacryptFile } from '../galacryptFileIo.js';
const DEFAULT_CONFIG_FILE = `{
  "files": []
}
`;
export const createProject = () => {
    const keyBinary = crypto.randomBytes(32);
    const keyHex = keyBinary.toString('hex');
    writeGalacryptFile(keyHex);
    if (!fs.existsSync('.galacryptrc.json')) {
        fs.writeFileSync('.galacryptrc.json', DEFAULT_CONFIG_FILE);
    }
    addPrecommitHook();
    return keyHex;
};
//# sourceMappingURL=createProject.js.map