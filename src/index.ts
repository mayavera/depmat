#! /usr/bin/env node

import fs from 'fs';
import path from 'path';

const packPath = process.argv.length > 2 ? process.argv[2] : '';

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
