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

On commit (or when running `yarn galacrypt write`) it will encrypt those file using an AES 256 key, stored in a file `.galacryptkey`

:bulb: With this approach, you commit the ouput files but keep the input files gitignored.
What you see encrypted will be encrypted, what you see in clear text will stay in clear text (and should be gitignored)

When you git clone the project, after setting the AES key with

```bash
yarn galacrypt use <key>
```

You can restore your files by running

```bash
yarn galacrypt read
```

## Installation

`yarn add -D @galadrim/galacrypt`

## Setup

### Setup for a new project

Run `yarn galacrypt create`

this will do the following things:

- create a galacrypt key, stored in .galacryptkey (you must gitignore this file and save the key somewhere safe e.g. your password manager)
- create a pre-commit hook that will run `galacrypt write` (you can see the generated script by running `cat .git/hooks/pre-commit`)
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
- that the `.galacryptkey` is in your .gitignore

### Setup for an existing project

Ask your team for the galacrypt key of your project

Then use this command:

```bash
yarn galacrypt use <key>
```

This will do the following things:

- put the provided galacrypt key inside .galacryptkey
- create a pre-commit hook that will run `galacrypt write` (you can see the generated script by running `cat .git/hooks/pre-commit`)

## Usage

```bash
# to generate a new key on a new project
yarn galacrypt create
# to setup galacrypt on an existing project
yarn galacrypt use <key>
# to encrypt files set in .galacryptrc.json
yarn galacrypt write
# to decrypt files set in .galacryptrc.json
yarn galacrypt read
```
