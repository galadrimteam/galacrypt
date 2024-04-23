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

On commit (or when running `yarn galacrypt encrypt`) it will encrypt those file using an AES 256 key, stored in a file `.galacryptkey`

:bulb: With this approach, you commit the ouput files but keep the input files gitignored.
What you see encrypted will be encrypted, what you see in clear text will stay in clear text (and should be gitignored)

When you git clone the project, after setting the AES key with

```bash
yarn galacrypt use <key>
```

You can restore your files by running

```bash
yarn galacrypt decrypt
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
- create the .galacryptrc.json file, you must then edit it to your needs (see the json example below)

To finish your configuration, add some file to be encrypted in the `.galacryptrc.json` file
here is the format :

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

:warning: BEFORE LEAVING THIS PAGE PLEASE CHECK

- that the input files are in your .gitignore
- that the `.galacryptkey` is in your .gitignore (this is done automatically but check anyway we never know :joy:)

### Setup for an existing project

Ask your team for the galacrypt key of your project

Then use this command:

```bash
yarn galacrypt use <key>
```

This will do the following things:

- put the provided galacrypt key inside .galacryptkey
- create a pre-commit hook that will run `galacrypt encrypt`

## Usage

```bash
# to setup galacrypt on a new project (will generate a new AES 256 key)
yarn galacrypt init
# to setup galacrypt on an existing project
yarn galacrypt use <key>
# to encrypt input files set in .galacryptrc.json to their output versions
yarn galacrypt encrypt
# to decrypt output files set in .galacryptrc.json to their input versions
yarn galacrypt decrypt
# to encrypt only some files (coma separated list of input files)
yarn galacrypt encrypt --only .env
# to decrypt only some files (coma separated list of output files)
yarn galacrypt decrypt --only .env.galacrypt
# to git add output files after encryption (used in the pre-commit hook)
yarn galacrypt encrypt --git-add
```

## Notes

When you will setup another tool that use pre-commit hooks (e.g. husky), it might break the galacrypt pre-commit config, you can restore it by running again

```bash
yarn galacrypt use <key>
```

This should not break the pre-commit of the other tool (it will append our precommit to theirs)

:bulb: You can always check manually your git hooks, you can find them by running this:

```bash
git config core.hooksPath
```

If this returns nothing, you git hooks are in `.git/hooks`
