import * as fs from 'node:fs';
import { z } from 'zod';
import { readGalacryptFile } from './galacryptFileIo.js';
const CONFIG_PATH = '.galacryptrc.json';
const zGalacryptFile = z.object({
    input: z.string(),
    output: z.string(),
});
const zGalacryptConfig = z.object({
    files: z.array(zGalacryptFile),
});
const getConfigText = () => {
    try {
        // read json file
        const configText = fs.readFileSync(CONFIG_PATH, 'utf8');
        return { ok: true, result: configText };
    }
    catch {
        return { ok: false, error: 'Error reading config file' };
    }
};
export const getConfig = () => {
    const res = getConfigText();
    if (!res.ok)
        return res;
    try {
        // parse json
        const config = zGalacryptConfig.parse(JSON.parse(res.result));
        const key = readGalacryptFile();
        return { ok: true, result: { ...config, key } };
    }
    catch {
        return { ok: false, error: 'Error parsing config file' };
    }
};
//# sourceMappingURL=getConfig.js.map