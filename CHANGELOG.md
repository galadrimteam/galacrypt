# Change Log

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
