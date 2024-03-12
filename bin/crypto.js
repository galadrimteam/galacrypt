import * as crypto from 'crypto';
import * as fs from 'node:fs';
const hash = (input) => {
    return crypto.createHash('sha256').update(input).digest('hex');
};
const encrypt = (text, secretKey) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};
const decrypt = (text, secretKey) => {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
const getEncryptedHashIfExists = (path) => {
    if (!fs.existsSync(path))
        return null;
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');
    if (lines.length !== 4)
        return null;
    return lines[1];
};
export const encryptFile = ({ inputPath, outputPath, secretKey }) => {
    const inputFileContent = fs.readFileSync(inputPath, 'utf8');
    const outputFileHash = getEncryptedHashIfExists(outputPath);
    const inputFileHash = hash(inputFileContent);
    if (outputFileHash && outputFileHash === inputFileHash) {
        return;
    }
    const encrypted = encrypt(inputFileContent, secretKey);
    const outputFileContent = `# generated by Galacrypt, do not edit manually
${inputFileHash}
${encrypted.iv}
${encrypted.encryptedData}`;
    fs.writeFileSync(outputPath, outputFileContent);
};
export const decryptFile = ({ inputPath, outputPath, secretKey }) => {
    const encryptedFileContent = fs.readFileSync(inputPath, 'utf8');
    const lines = encryptedFileContent.split('\n');
    if (lines.length !== 4) {
        console.error(`Invalid file format (${inputPath})`);
        return;
    }
    const iv = lines[2];
    const encryptedData = lines[3];
    const decrypted = decrypt({ iv, encryptedData }, secretKey);
    fs.writeFileSync(outputPath, decrypted);
};
//# sourceMappingURL=crypto.js.map