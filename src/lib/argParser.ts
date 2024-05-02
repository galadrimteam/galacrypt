/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This file is copied from https://github.com/vercel/arg
 * and modified to work with TypeScript.
 */

/**
The MIT License (MIT)

Copyright (c) 2021 Vercel, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export const flagSymbol = Symbol('arg flag');

export class ArgError extends Error {
  public name: string;
  public code: string | number;

  constructor(msg: string, code: string | number) {
    super(msg);
    this.name = 'ArgError';
    this.code = code;

    Object.setPrototypeOf(this, ArgError.prototype);
  }
}

type FlagFn = (v: unknown, name: unknown, existingCount?: number) => unknown;

type BrandedFlagFn = FlagFn & {
  [flagSymbol]: true;
};

export type ArgType = typeof Number | typeof String | typeof Boolean | BrandedFlagFn;
export type ArgArrType = [typeof Number] | [typeof String] | [typeof Boolean];

export type ArgOptions = { [K in string]: ArgType | ArgArrType };

export const f: ArgOptions = {
  '--help': Boolean,
};

export function parseArgs(opts: ArgOptions, { argv = process.argv.slice(2), permissive = false, stopAtPositional = false } = {}) {
  if (!opts) {
    throw new ArgError('argument specification object is required', 'ARG_CONFIG_NO_SPEC');
  }

  const result = { _: [] };

  const aliases: any = {};
  const handlers: any = {};

  for (const key of Object.keys(opts)) {
    if (!key) {
      throw new ArgError('argument key cannot be an empty string', 'ARG_CONFIG_EMPTY_KEY');
    }

    if (key[0] !== '-') {
      throw new ArgError(`argument key must start with '-' but found: '${key}'`, 'ARG_CONFIG_NONOPT_KEY');
    }

    if (key.length === 1) {
      throw new ArgError(`argument key must have a name; singular '-' keys are not allowed: ${key}`, 'ARG_CONFIG_NONAME_KEY');
    }

    if (typeof opts[key] === 'string') {
      aliases[key] = opts[key];
      continue;
    }

    let type = opts[key];
    let isFlag = false;

    if (Array.isArray(type) && type.length === 1 && typeof type[0] === 'function') {
      const [fn] = type;
      // @ts-ignore
      type = (value, name, prev = []) => {
        // @ts-ignore
        prev.push(fn(value, name, prev[prev.length - 1]));
        return prev;
      };
      // @ts-ignore
      isFlag = fn === Boolean || fn[flagSymbol] === true;
    } else if (typeof type === 'function') {
      // @ts-ignore
      isFlag = type === Boolean || type[flagSymbol] === true;
    } else {
      throw new ArgError(`type missing or not a function or valid array type: ${key}`, 'ARG_CONFIG_VAD_TYPE');
    }

    if (key[1] !== '-' && key.length > 2) {
      throw new ArgError(`short argument keys (with a single hyphen) must have only one character: ${key}`, 'ARG_CONFIG_SHORTOPT_TOOLONG');
    }

    handlers[key] = [type, isFlag];
  }

  for (let i = 0, len = argv.length; i < len; i++) {
    const wholeArg = argv[i];

    if (stopAtPositional && result._.length > 0) {
      // @ts-ignore
      result._ = result._.concat(argv.slice(i));
      break;
    }

    if (wholeArg === '--') {
      // @ts-ignore
      result._ = result._.concat(argv.slice(i + 1));
      break;
    }

    if (wholeArg.length > 1 && wholeArg[0] === '-') {
      /* eslint-disable operator-linebreak */
      const separatedArguments =
        wholeArg[1] === '-' || wholeArg.length === 2
          ? [wholeArg]
          : wholeArg
              .slice(1)
              .split('')
              .map((a) => `-${a}`);
      /* eslint-enable operator-linebreak */

      for (let j = 0; j < separatedArguments.length; j++) {
        const arg = separatedArguments[j];
        const [originalArgName, argStr] = arg[1] === '-' ? arg.split(/=(.*)/, 2) : [arg, undefined];

        let argName = originalArgName;
        while (argName in aliases) {
          argName = aliases[argName];
        }

        if (!(argName in handlers)) {
          if (permissive) {
            // @ts-ignore
            result._.push(arg);
            continue;
          } else {
            throw new ArgError(`unknown or unexpected option: ${originalArgName}`, 'ARG_UNKNOWN_OPTION');
          }
        }

        const [type, isFlag] = handlers[argName];

        if (!isFlag && j + 1 < separatedArguments.length) {
          throw new ArgError(
            `option requires argument (but was followed by another short argument): ${originalArgName}`,
            'ARG_MISSING_REQUIRED_SHORTARG'
          );
        }

        if (isFlag) {
          // @ts-ignore
          result[argName] = type(true, argName, result[argName]);
        } else if (argStr === undefined) {
          if (
            argv.length < i + 2 ||
            (argv[i + 1].length > 1 &&
              argv[i + 1][0] === '-' &&
              !(
                argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) &&
                (type === Number ||
                  // eslint-disable-next-line no-undef
                  (typeof BigInt !== 'undefined' && type === BigInt))
              ))
          ) {
            const extended = originalArgName === argName ? '' : ` (alias for ${argName})`;
            throw new ArgError(`option requires argument: ${originalArgName}${extended}`, 'ARG_MISSING_REQUIRED_LONGARG');
          }

          // @ts-ignore
          result[argName] = type(argv[i + 1], argName, result[argName]);
          ++i;
        } else {
          // @ts-ignore
          result[argName] = type(argStr, argName, result[argName]);
        }
      }
    } else {
      // @ts-ignore
      result._.push(wholeArg);
    }
  }

  return result;
}

export const flag = (fn: FlagFn) => {
  const brandedFn = fn as BrandedFlagFn;
  brandedFn[flagSymbol] = true;
  return brandedFn;
};

export const COUNT = flag((_v, _name, existingCount?: number) => (existingCount || 0) + 1);

type ArgTransform<T extends ArgOptions> = Partial<{
  [K in keyof T]: T[K] extends ArgType ? ReturnType<T[K]> : T[K] extends ArgArrType ? ReturnType<T[K][0]>[] : never;
}> & { _: string[] };

export const parseArgsOrExitWithMessage = <T extends ArgOptions>(opts: T, usage: string): ArgTransform<T> => {
  try {
    const res = parseArgs(opts);

    return res as ArgTransform<T>;
  } catch (error) {
    if (error instanceof ArgError) {
      console.error(error.message);
      console.error(usage);
      process.exit(1);
    } else {
      throw error;
    }
  }
};
