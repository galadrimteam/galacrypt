import { parseArgsOrExitWithMessage } from './lib/argParser.js';
export const USAGE_TEXT = `Usage:
galacrypt init -> Setup on a new project
galacrypt use <key> -> Setup on an existing project
galacrypt encrypt -> Encrypt files
galacrypt decrypt -> Decrypt files
galacrypt encrypt --only .env -> Encrypt only some files (coma separated list of input files)
galacrypt decrypt --only .env.galacrypt -> Decrypt only some files (coma separated list of output files)`;
export const GALACRYPT_OPTIONS = parseArgsOrExitWithMessage({
    '--only': [String],
    '--git-add': Boolean,
    '--all': Boolean,
    '--yarn': Boolean,
    '--pnpm': Boolean,
    '--npm': Boolean,
    '--bun': Boolean,
    '--package-manager': String,
}, USAGE_TEXT);
//# sourceMappingURL=getOptions.js.map