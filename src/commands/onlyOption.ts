import { FullGalacryptConfig } from '../getConfig.js';
import { GALACRYPT_OPTIONS } from '../getOptions.js';

export const getOnlyOption = (config: FullGalacryptConfig, mode: 'decrypt' | 'encrypt') => {
  const comaSeparatedFiles = GALACRYPT_OPTIONS['--only'];
  const files = comaSeparatedFiles ? comaSeparatedFiles.flatMap((s) => s.split(',')) : undefined;
  const fileKey = mode === 'decrypt' ? 'output' : 'input';

  if (!files) {
    return {
      ok: true,
      only: undefined,
    };
  }

  if (files.length === 0) {
    return {
      ok: false,
      error: `Option '--only' requires a value`,
    };
  }

  const onlySet = new Set(files);
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
