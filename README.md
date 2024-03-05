# Kaboom Website

This is the kaboom website, it's written in nextjs.

## Developing

```sh
$ git submodule init
$ git submodule update
$ npm install
$ npm run dev
```

will start the nextjs server

## Symlink on Windows

This site uses unix symlinks, might not work on Windows by default

On Windows 10+:

- enable "developer mode"
- `git config --global core.symlinks true`
- reclone the repo
