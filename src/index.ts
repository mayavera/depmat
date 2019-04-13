#! /usr/bin/env node

import fs from 'fs';
import path from 'path';

const args = [...process.argv];

if (args.includes('-h') || args.includes('--help')) {
    console.log('Usage: depmat [--format <format>] <projectRoot>');
    process.exit();
}

let format = 'csv';
if (args.includes('-f') || args.includes('--format')) {
    let formatFlagIndex = args.indexOf('-f');
    if (formatFlagIndex === -1) {
        formatFlagIndex = args.indexOf('--format');
    }

    if (args.length <= formatFlagIndex + 1) {
        console.log('no format specified!');
        process.exit(1);
    }

    format = args[formatFlagIndex + 1];

    switch (format) {
        case 'md':
        case 'csv':
            break;
        default:
            console.log('unknown format specified');
            process.exit(1);
    }

    args.splice(formatFlagIndex, 2);
}

const packPath = args.length > 2 ? args[2] : '';

const packJSON = fs.readFileSync(path.join(packPath, 'package.json'), 'utf-8');
const pack = JSON.parse(packJSON);

const lockJSON = fs.readFileSync(path.join(packPath, 'package-lock.json'), 'utf-8');
const lock = JSON.parse(lockJSON);

const deps = [
    ...Object.keys(pack.dependencies || {}),
    ...Object.keys(pack.devDependencies || {}),
]
    .map(name => ({
        name,
        version: lock.dependencies[name].version,
        dependencies: lock.dependencies[name].requires || {},
    }));

deps.unshift({
    name: pack.name,
    version: pack.version,
    dependencies: { ...pack.dependencies, ...pack.devDependencies },
});

switch (format) {
    case 'csv':
        console.log(`dependency,${deps.map(dep => dep.name).join(',')}`);

        deps.forEach((rowDep) => {
            const line = [rowDep.name];

            deps.forEach((colDep) => {
                if (rowDep.name === colDep.name) {
                    line.push(rowDep.version);
                } else if (rowDep.dependencies[colDep.name]) {
                    line.push(rowDep.dependencies[colDep.name]);
                } else if (colDep.dependencies[rowDep.name]) {
                    line.push(colDep.dependencies[rowDep.name]);
                } else {
                    line.push(' ');
                }
            });

            console.log(line.join(','));
        });
        break;
    case 'md':
        console.log(`|dependency|${deps.map(dep => dep.name).join('|')}|`);
        console.log(`|-|${deps.map(() => '-').join('|')}|`);

        deps.forEach((rowDep) => {
            const line = [rowDep.name];

            deps.forEach((colDep) => {
                if (rowDep.name === colDep.name) {
                    line.push(rowDep.version);
                } else if (rowDep.dependencies[colDep.name]) {
                    line.push(rowDep.dependencies[colDep.name]);
                } else if (colDep.dependencies[rowDep.name]) {
                    line.push(colDep.dependencies[rowDep.name]);
                } else {
                    line.push(' ');
                }
            });

            console.log(`|${line.join('|')}|`);
        });

        break;
    default:
}
