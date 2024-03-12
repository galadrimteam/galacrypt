import * as fs from 'node:fs';
import { readGalacryptFile } from './galacryptFileIo.js';
const CONFIG_PATH = '.galacryptrc.json';
function validateGalacryptConfig(config) {
    if (typeof config !== 'object' || config === null)
        throw new Error('Config must be an object');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!Array.isArray(config.files))
        throw new Error('Config must have a "files" array');
    for (const file of config.files) {
        if (typeof file !== 'object' || file === null)
            throw new Error('Each file must be an object');
        if (typeof file.input !== 'string')
            throw new Error('Each file must have an "input" string');
        if (typeof file.output !== 'string')
            throw new Error('Each file must have an "output" string');
    }
}
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
        const key = readGalacryptFile();
        const parsedConfig = JSON.parse(res.result);
        validateGalacryptConfig(parsedConfig);
        return { ok: true, result: { ...parsedConfig, key } };
    }
    catch (e) {
        if (e instanceof Error)
            return { ok: false, error: e.message };
        return { ok: false, error: 'Error parsing config file' };
    }
};
//# sourceMappingURL=getConfig.js.map