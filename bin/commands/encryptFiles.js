import { encryptFile } from '../crypto.js';
export const encryptFiles = (config) => {
    for (const file of config.files) {
        try {
            encryptFile({ inputPath: file.input, outputPath: file.output, secretKey: config.key });
        }
        catch {
            console.error(`Error encrypting '${file.output}' from '${file.input}'`);
        }
    }
};
//# sourceMappingURL=encryptFiles.js.map