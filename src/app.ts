#!/usr/bin/env node

import { Command } from 'commander';
import fs, { writeFileSync } from 'fs';
import { resolveSolDomain } from './name-service';
import { getTwitterRegistry } from '@solana/spl-name-service';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const program = new Command();
program.version('0.0.1');

program
  .description(
    'Transform a list of twitter and .sol handles to Solana addresses'
  )
  .option('-d, --duplicates', 'remove duplicate addresses')
  .option('-i, --input <path>', 'input file path');

program.parse(process.argv);
const options = program.opts();
if (!options.input) {
  console.log('Need input file path -i');
  process.exit(1);
}

const parseFile = async () => {
  // Load all lines to an array
  let input = fs
    .readFileSync(options.input, {
      encoding: 'utf-8',
    })
    .split('\n')
    .map(l => l.split(',').map(t => t.trim()));

  const connection = new Connection(clusterApiUrl('mainnet-beta'));

  for (const tokens of input) {
    const [handle] = tokens;

    if (handle.startsWith('@')) {
      // This is a twitter handle
      try {
        const twitter = await getTwitterRegistry(connection, handle.slice(1));
        tokens[0] = twitter.owner.toString();
      } catch {
        console.error('Failed to parse twitter handle: ', handle);
      }
    } else if (handle.endsWith('.sol')) {
      // This is .sol domain name
      try {
        const domain = await resolveSolDomain(
          connection,
          handle.slice(0, handle.length - 4)
        );
        tokens[0] = domain.toString();
      } catch {
        console.error('Failed to parse domain name: ', handle);
      }
    } else {
      // Do nothing
      continue;
    }
  }

  // Remove duplicates
  if (options.duplicates) {
    const seen = new Set();
    input = input.filter(item => {
        let k = item[0];
        return seen.has(k) ? false : seen.add(k);
    })
  }

  let output = '';
  input.forEach(line => {
    output += `${line[0]}, ${line[1]}\n`;
  });

  writeFileSync('output.txt', output.trim());
};

parseFile().catch(console.error);
