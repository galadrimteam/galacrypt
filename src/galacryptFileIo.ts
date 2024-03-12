import * as fs from 'node:fs';

export const writeGalacryptFile = (key: string) => {
  const content = `# This is your Galacrypt key
# You must never commit this file
${key}`;
  // write key to file
  fs.writeFileSync('.galacryptkey', content);

  try {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    if (!gitignoreContent.includes('.galacryptkey')) {
      fs.appendFileSync('.gitignore', '\n.galacryptkey');
    }
  } catch {
    console.error('Error reading .gitignore');
    console.error('Please add .galacryptkey to your .gitignore');
    console.error('You must never commit the .galacryptkey file !');
  }
};

export const readGalacryptFile = (): string => {
  try {
    const fileContent = fs.readFileSync('.galacryptkey', 'utf8');
    const lines = fileContent.split('\n');
    const key = lines.find((line) => !line.startsWith('#'));

    if (!key) {
      console.error('Bad format for .galacryptkey file');
      process.exit(1);
    }

    return key;
  } catch {
    console.error('Error reading .galacryptkey');
    process.exit(1);
  }
};
