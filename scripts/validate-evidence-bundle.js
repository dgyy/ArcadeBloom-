#!/usr/bin/env node
'use strict';

const path = require('path');
const { validateBundleLayout } = require('./lib/evidence-bundle.js');

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    return match ? [match[1], match[2]] : [arg.replace(/^--/, ''), true];
}));
const root = path.resolve(args.root || 'evidence');
const errors = validateBundleLayout(root, args.slug);
if (errors.length) {
    console.error(`✗ Evidence bundle layout invalid:\n  ${errors.join('\n  ')}`);
    process.exit(1);
}
console.log(`✓ Evidence bundle layout valid for ${args.slug}.`);
