import { Packer } from 'roadroller';
import { readFileSync, renameSync, rm, writeFileSync } from 'fs';

console.error('Roadrolling...');
const startTime = Date.now();

const js = readFileSync('dist/main.js', 'utf-8');
const html = readFileSync('dist/index.html', 'utf-8');
const inputs = [
    {
        data: js,
        type: 'js',
        action: 'eval',
        numAbbreviations: 30, // 30 is slightly better than the default 32, but is build-run-specific
        sparseSelectors: 17, // 2x the default number of contexts, as my code is 2x regular Js13k size
        allowFreeVars: true,
    },
];

const packer = new Packer(inputs);
await packer.optimize(2);

const { firstLine, secondLine } = packer.makeDecoder();

const finalHtml = html.replace('<script defer="defer" src="main.js"></script>', `<script>${firstLine + secondLine}</script>`);
if (finalHtml === html) {
    throw new Error('Unable to find script tag');
}

renameSync('dist/index.html', 'dist/index_unrolled.html');
writeFileSync('dist/index.html', finalHtml);

console.error(`Roadrolled in ${Date.now() - startTime}ms`);
