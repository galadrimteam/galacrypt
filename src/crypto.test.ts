import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { encryptFile, decryptFile } from './crypto.js';

describe('crypto', () => {
  const testDir = path.join(process.cwd(), 'test_temp');
  const secretKey = 'a'.repeat(64); // 32 bytes in hex = 64 hex characters

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      for (const file of files) {
        fs.unlinkSync(path.join(testDir, file));
      }
      fs.rmdirSync(testDir);
    }
  });

  describe('encryptFile and decryptFile', () => {
    it('should encrypt and decrypt a file successfully', () => {
      const inputPath = path.join(testDir, 'test.txt');
      const encryptedPath = path.join(testDir, 'test.txt.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');
      const originalContent = 'Hello, World!';

      // Write original file
      fs.writeFileSync(inputPath, originalContent);

      // Encrypt
      const encrypted = encryptFile({ inputPath, outputPath: encryptedPath, secretKey });
      expect(encrypted).toBe(true);
      expect(fs.existsSync(encryptedPath)).toBe(true);

      // Decrypt
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(true);
      expect(fs.existsSync(decryptedPath)).toBe(true);

      // Verify content
      const decryptedContent = fs.readFileSync(decryptedPath, 'utf8');
      expect(decryptedContent).toBe(originalContent);
    });

    it('should handle binary files', () => {
      const inputPath = path.join(testDir, 'test.bin');
      const encryptedPath = path.join(testDir, 'test.bin.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.bin');
      const originalContent = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);

      // Write original file
      fs.writeFileSync(inputPath, new Uint8Array(originalContent));

      // Encrypt
      const encrypted = encryptFile({ inputPath, outputPath: encryptedPath, secretKey });
      expect(encrypted).toBe(true);

      // Decrypt
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(true);

      // Verify content
      const decryptedContent = fs.readFileSync(decryptedPath);
      expect(decryptedContent).toEqual(originalContent);
    });

    it('should decrypt file with trailing newline', () => {
      const inputPath = path.join(testDir, 'test.txt');
      const encryptedPath = path.join(testDir, 'test.txt.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');
      const originalContent = 'Test content';

      // Write original file
      fs.writeFileSync(inputPath, originalContent);

      // Encrypt
      encryptFile({ inputPath, outputPath: encryptedPath, secretKey });

      // Read encrypted file and add trailing newline
      const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
      fs.writeFileSync(encryptedPath, encryptedContent + '\n');

      // Decrypt should still work
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(true);

      // Verify content
      const decryptedContent = fs.readFileSync(decryptedPath, 'utf8');
      expect(decryptedContent).toBe(originalContent);
    });

    it('should decrypt file with multiple trailing newlines', () => {
      const inputPath = path.join(testDir, 'test.txt');
      const encryptedPath = path.join(testDir, 'test.txt.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');
      const originalContent = 'Test content';

      // Write original file
      fs.writeFileSync(inputPath, originalContent);

      // Encrypt
      encryptFile({ inputPath, outputPath: encryptedPath, secretKey });

      // Read encrypted file and add multiple trailing newlines
      const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
      fs.writeFileSync(encryptedPath, encryptedContent + '\n\n\n');

      // Decrypt should still work
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(true);

      // Verify content
      const decryptedContent = fs.readFileSync(decryptedPath, 'utf8');
      expect(decryptedContent).toBe(originalContent);
    });

    it('should decrypt file with trailing whitespace', () => {
      const inputPath = path.join(testDir, 'test.txt');
      const encryptedPath = path.join(testDir, 'test.txt.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');
      const originalContent = 'Test content';

      // Write original file
      fs.writeFileSync(inputPath, originalContent);

      // Encrypt
      encryptFile({ inputPath, outputPath: encryptedPath, secretKey });

      // Read encrypted file and add trailing whitespace
      const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
      fs.writeFileSync(encryptedPath, encryptedContent + ' \t\n ');

      // Decrypt should still work
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(true);

      // Verify content
      const decryptedContent = fs.readFileSync(decryptedPath, 'utf8');
      expect(decryptedContent).toBe(originalContent);
    });

    it('should return false for invalid encrypted file format', () => {
      const encryptedPath = path.join(testDir, 'invalid.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');

      // Write invalid format
      fs.writeFileSync(encryptedPath, 'invalid content\n');

      // Decrypt should fail
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(false);
    });

    it('should return false when encrypted file has wrong number of lines', () => {
      const encryptedPath = path.join(testDir, 'invalid.galacrypt');
      const decryptedPath = path.join(testDir, 'test_decrypted.txt');

      // Write file with wrong number of lines
      fs.writeFileSync(encryptedPath, 'line1\nline2\nline3\n');

      // Decrypt should fail
      const decrypted = decryptFile({ inputPath: encryptedPath, outputPath: decryptedPath, secretKey });
      expect(decrypted).toBe(false);
    });

    it('should not re-encrypt if file hash matches', () => {
      const inputPath = path.join(testDir, 'test.txt');
      const encryptedPath = path.join(testDir, 'test.txt.galacrypt');
      const originalContent = 'Test content';

      // Write original file
      fs.writeFileSync(inputPath, originalContent);

      // Encrypt first time
      const encrypted1 = encryptFile({ inputPath, outputPath: encryptedPath, secretKey });
      expect(encrypted1).toBe(true);

      // Get encrypted content
      const encryptedContent1 = fs.readFileSync(encryptedPath, 'utf8');

      // Try to encrypt again (should skip)
      const encrypted2 = encryptFile({ inputPath, outputPath: encryptedPath, secretKey });
      expect(encrypted2).toBe(false);

      // Content should be unchanged
      const encryptedContent2 = fs.readFileSync(encryptedPath, 'utf8');
      expect(encryptedContent2).toBe(encryptedContent1);
    });
  });
});
