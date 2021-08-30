import chalk from 'chalk';          // for colored output
import fs from 'fs';
import ncp from 'ncp';              // recursive copying of the files 
import path from 'path';
import { promisify } from 'util';
import Listr from 'listr';
import execa from 'execa';

const access = promisify(fs.access);
const copy = promisify(ncp);

// copy the files into the target directory using ncp
async function copyTemplateFiles(options) {
  return await copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const currentFileUrl = __dirname; // as 'import.meta.url' has extra 'C:\' at beginning
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../templates',
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  // `listr` which let's us specify a list of tasks and gives the user a neat progress overview
  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
  ]);

  await tasks.run();

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}