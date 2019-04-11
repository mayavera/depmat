# depmat

[![airbnb-style](https://img.shields.io/badge/style-airbnb-blue.svg)](https://github.com/airbnb/javascript)

## Installation

```sh
npm install --save-dev depmat
```

## Usage

Simply run `depmat` in your project root:

```sh
cd <path to my awesome project>
depmat
```

Or, you may specify your project's root path as the first argument:

```sh
depmat <path to my awesome project>
```

`depmat` will output the dependency matrix as a csv to your console. To save the matrix for future use, simply pipe it into a file like so:

```sh
depmat > dm.csv
```

> ️️⚠️ `depmat` will look for a `package-lock.json`, so be sure to run `npm install`

# License

[MIT](https://mit-license.org)
