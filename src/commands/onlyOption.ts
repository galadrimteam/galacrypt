import { FullGalacryptConfig } from '../getConfig.js';

export const getOnlyOption = (config: FullGalacryptConfig, mode: 'decrypt' | 'encrypt') => {
  const fileKey = mode === 'decrypt' ? 'output' : 'input';

  if (process.argv.length < 4)
    return {
      ok: true,
      only: null,
    };

  const optionIndex = process.argv.indexOf('--only');

  if (optionIndex === -1) {
    return {
      ok: true,
      only: null,
    };
  }

  const optionValue = process.argv?.[optionIndex + 1] ?? null;

  if (!optionValue) {
    return {
      ok: false,
      error: `Option '--only' requires a value`,
    };
  }

  const onlySet = new Set(optionValue.split(','));
  const allFilesSet = new Set(config.files.map((file) => file[fileKey]));

  for (const file of onlySet) {
    if (!allFilesSet.has(file)) {
      return {
        ok: false,
        error: `No ${fileKey} file '${file}' in .galacryptrc.json`,
      };
    }
  }

  return {
    ok: true,
    only: onlySet,
  };
};
