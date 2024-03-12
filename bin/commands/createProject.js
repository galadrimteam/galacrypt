import * as crypto from 'crypto';
import * as fs from 'node:fs';
import { writeGalacryptFile } from '../galacryptFileIo.js';
const DEFAULT_CONFIG_FILE = `{
  "files": []
}
`;
export const createProject = () => {
    const keyBinary = crypto.randomBytes(16);
    const keyHex = keyBinary.toString('hex');
    writeGalacryptFile(keyHex);
    if (!fs.existsSync('.galacryptrc.json')) {
        fs.writeFileSync('.galacryptrc.json', DEFAULT_CONFIG_FILE);
    }
    return keyHex;
};
//# sourceMappingURL=createProject.js.map