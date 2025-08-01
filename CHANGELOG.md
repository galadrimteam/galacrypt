# Change Log

## [2.2.1] - 2025-08-01

### Changes

- less verbose: only show encryption/decryption message when file is actually changed

### Upgrade

To upgrade from **2.2.0** to **2.2.1**, you will need to do this:

- update galacrypt `yarn add --dev @galadrim/galacrypt`

## [2.2.0] - 2025-07-29

### Changes

- added package manager customization for git hooks (can now use `bun`, `npm`, or `pnpm` instead of default `yarn`)
- refactored git hooks code to remove duplicate code and improve maintainability

### Upgrade

To upgrade from **2.1.0** to **2.2.0**, you will need to do this:

- update galacrypt `yarn add --dev @galadrim/galacrypt`

## [2.1.0] - 2025-07-28

### Changes

- added binary file support (can now encrypt/decrypt images, PDFs, etc.)

### Upgrade

To upgrade from **2.0.0** to **2.1.0**, you will need to do this:

- update galacrypt `yarn add --dev @galadrim/galacrypt`

## [2.0.0] - 2024-05-02

### Changes

- added `post-merge` git hook (runs `galacrypt decrypt` on `git pull`)
- added `post-rewrite` git hook (runs `galacrypt decrypt` on `git rebase`)
- added `.galacryptrc.json` `disableImplicitDecrypt` file option to never implicitly decrypt those files, see readme for more infos
- added `--all` option to decrypt all files, including files anoted with `disableImplicitDecrypt`
- dropped support for `galacrypt write`
- dropped support for `galacrypt read`
- more reliable options parsing

### Upgrade

To upgrade from **1.1.0** to **2.0.0**, you will need to do this:

- verify that your pre-commit hook use `yarn galacrypt encrypt --git-add` and not `yarn galacrypt write --git-add`
- update galacrypt `yarn add --dev @galadrim/galacrypt`
- add new git hooks by re-running `yarn galacrypt use <YOUR_GALACRYPT_KEY>` (your galacrypt key is in your `.galacryptkey` file)

## [1.1.0] - 2024-04-23

- added `--only` option to encrypt / decrypt only some files
