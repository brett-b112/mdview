#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { spawn } from 'child_process';
import open from 'open';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

yargs(hideBin(process.argv))
  .command('$0 [directory]', 'Launch markdown viewer', (yargs) => {
    return yargs.positional('directory', {
      describe: 'Directory containing markdown files',
      default: process.cwd(),
      type: 'string'
    });
  }, (argv) => {
    const server = spawn('node', [join(__dirname, 'server.js')], {
      stdio: 'inherit',
      env: { ...process.env, MARKDOWN_DIR: argv.directory }
    });

    // Wait a bit for the server to start
    setTimeout(() => {
      open('http://localhost:3000');
    }, 1000);

    // Handle server shutdown
    process.on('SIGINT', () => {
      server.kill('SIGINT');
      process.exit(0);
    });
  })
  .help()
  .argv;
