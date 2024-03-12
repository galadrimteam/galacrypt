import { decryptFile } from '../crypto.js';
export const decryptFiles = (config) => {
    for (const file of config.files) {
        try {
            decryptFile({ inputPath: file.output, outputPath: file.input, secretKey: config.key });
            console.log(`Decrypted '${file.input}' from '${file.output}'`);
        }
        catch {
            console.error(`Error decrypting '${file.input}' from '${file.output}'`);
        }
    }
};
//# sourceMappingURL=decryptFiles.js.map