# Galacrypt

Alternative to transcrypt with simpler mental model and 0 dependencies

## Why Galacrypt ?

- Pushing .env files is just not for me (transcrypt encrypt/decrypt .env files on the fly before commiting)
- I think commiting .env adds a mental charge of making sure transcrypt is well configured before pushing your .env (counter intuitive action)
- In fact I think that transcrypt way "looks like a hack", what is done differs from what you see:
  e.g.: you see a clear .env, but in the git file, it's encrypted.

**TLDR**: When dealing with secrets I prefer WYSIWYG

## What does galacrypt do?

In your config you define a set of input/output files

```json
{
  "files": [
    {
      "input": ".env",
      "output": ".env.galacrypt"
    }
  ]
}
```

On commit (or when running `yarn galacrypt encrypt`) it will encrypt those files using an AES 256 key, stored in a file `.galacryptkey`

On `git pull`, `git rebase` (or when running `yarn galacrypt decrypt`) it will decrypt those files

:bulb: With this approach, you commit the ouput files but keep the input files gitignored.
What you see encrypted will be encrypted, what you see in clear text will stay in clear text (and should be gitignored)

When you git clone the project, after setting the AES key with

```bash
yarn galacrypt use <key>
```

You can restore your files by running

```bash
yarn galacrypt decrypt --all
```

## Installation

`yarn add -D @galadrim/galacrypt`

## Setup

### Setup for a new project

Run `yarn galacrypt init`

this will do the following things:

- add the .galacryptkey to your .gitignore
- create a galacrypt key, stored in .galacryptkey (you must gitignore this file and save the key somewhere safe e.g. your password manager)
- create a pre-commit hook that will run `galacrypt encrypt`
- create a post-rewrite hook (e.g. after `git rebase`) that will run `galacrypt decrypt`
- create a post-merge hook (e.g. after `git pull`) that will run `galacrypt decrypt`
- create a .galacryptrc.json file, you must then edit it to your needs (see the json example below)

To finish your configuration, add some files to be encrypted in the `.galacryptrc.json` file
here is the format :

```ts
interface GalacryptConfig {
  files: {
    input: string;
    output: string;
    // keep scrolling to see details about this option
    disableImplicitDecrypt?: boolean;
  }[];
}
```

and an example:

```json
{
  "files": [
    {
      "input": ".env",
      "output": ".env.galacrypt"
    }
  ]
}
```

:warning: Before leaving this page, please double check that the input files are in your `.gitignore` file

### Setup for an existing project

Ask your team for the galacrypt key of your project

Then use this command:

```bash
yarn galacrypt use <key>
```

This will do the following things:

- put the provided galacrypt key inside .galacryptkey
- create a pre-commit hook that will run `galacrypt encrypt`
- create a post-rewrite hook (e.g. `git rebase`) that will run `galacrypt decrypt`
- create a post-merge hook (e.g. `git pull`) that will run `galacrypt decrypt`

### Package Manager Configuration

By default, Galacrypt uses `yarn` to run the git hooks. You can override this behavior by using one of the following flags when running `galacrypt init` or `galacrypt use <key>`:

- `--yarn`: Use `yarn` (default)
- `--pnpm`: Use `pnpm`
- `--npm`: Use `npm`
- `--bun`: Use `bun`
- `--package-manager <command>`: Use a custom package manager command

**Example:**

```bash
# Using pnpm
galacrypt init --pnpm

# Using a custom command
galacrypt use <key> --package-manager "deno"
```

## Usage

```bash
# to setup galacrypt on a new project (will generate a new AES 256 key)
yarn galacrypt init
# to setup galacrypt on an existing project
yarn galacrypt use <key>
# to encrypt input files set in .galacryptrc.json to their output versions
yarn galacrypt encrypt
# to decrypt output files set in .galacryptrc.json to their input versions
# note that it won't decrypt files with `disableImplicitDecrypt: true`
yarn galacrypt decrypt
# to decrypt all output files set in .galacryptrc.json to their input versions
yarn galacrypt decrypt --all
# to encrypt only some files (coma separated list of input files)
yarn galacrypt encrypt --only .env
# to decrypt only some files (coma separated list of output files)
yarn galacrypt decrypt --only .env.galacrypt
# to git add output files after encryption (used in the pre-commit hook)
yarn galacrypt encrypt --git-add
```

## Notes

When you will setup another tool that use git hooks (e.g. husky), it might break the galacrypt git hooks config, you can restore it by running again

```bash
yarn galacrypt use <key>
```

This should not break the git hooks of the other tool (it will append our hooks to theirs)

:bulb: You can always check manually your git hooks, you can find them by running this:

```bash
git config core.hooksPath
```

If this returns nothing, you git hooks are in `.git/hooks`

## disableImplicitDecrypt option

Imagine you have this config:

```json
{
  "files": [
    {
      "input": ".env",
      "output": ".env.galacrypt"
    },
    {
      "input": ".env.staging",
      "output": ".env.staging.galacrypt"
    }
  ]
}
```

`.env` would be the local env variables you need for development, each developer might use a slighly different version of this file

If two devs, **Bob** and **Alice** are on the project, and Alice modifies her `.env` file and pushes an updated `.env.galacrypt` file

When Bob `git pull` or `git rebase` to retrieve the changes Alice have made, `galacrypt decrypt` will be runned, and he will lose his own version of the `.env` file

This is expected for external configuration like `.env.staging` but really anoying for local configuration that might differ from developer to developer

This is where `disableImplicitDecrypt` can be usefull, see the updated config below:

```json
{
  "files": [
    {
      "input": ".env",
      "output": ".env.galacrypt",
      "disableImplicitDecrypt": true
    },
    {
      "input": ".env.staging",
      "output": ".env.staging.galacrypt"
    }
  ]
}
```

`disableImplicitDecrypt` informs galacrypt to never implicitly decrypt this file, meaning when you run `galacrypt decrypt` (e.g. when you `git pull` or `git rebase` to fetch the code of other devs) it will not decrypt `.env.galacrypt` to the `.env`

:bulb: You can always force the decryption by running `galacrypt decrypt --all` or `galacrypt decrypt --only path/to/output/file`

:bulb: When you land on a project, you will want to decrypt all the files, including those anoted with `disableImplicitDecrypt`, that's why the `--all` option exists:

```bash
yarn galacrypt decrypt --all
```
