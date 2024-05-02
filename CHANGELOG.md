# Change Log

## [2.0.0] - 2024-05-02

- added `post-merge` git hook (runs `galacrypt decrypt` on `git pull`)
- added `post-rewrite` git hook (runs `galacrypt decrypt` on `git rebase`)
- added `.galacryptrc.json` `disableImplicitDecrypt` file option to never implicitly decrypt those files, see readme for more infos
- added `--all` option to decrypt all files, including files anoted with `disableImplicitDecrypt`
- dropped support for `galacrypt write`
- dropped support for `galacrypt read`
- more reliable options parsing

## [1.1.0] - 2024-04-23

- added `--only` option to encrypt / decrypt only some files
