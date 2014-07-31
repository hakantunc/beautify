# Beautify JavaScript Source Code

This script traverses your source code and creates reformatted .js files using [js-beautify](https://github.com/beautify-web/js-beautify).

## Usage:

node beautify.js [options]

```text
  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -d, --directory <name>  give a directory
    -f, --force             force
    -r, --recursive         recursive
    -p, --replace           replace with the current files
```
* -d required.
* Unless option 'p' provided, separate directory structure is created.