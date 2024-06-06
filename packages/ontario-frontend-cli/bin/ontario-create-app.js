#!/usr/bin/env node
const Command = require('commander').Command;
const { handleCreateAppCommand } = require('../commands/ontario-create-app/handleCreateApp');
const { ROOT_DIR } = require('../core/config');
const { readPackageJson } = require('../core/utils');
const logger = require('../core/utils/logger');
const { validFileName } = require('../core/validation');

const program = new Command();

/**
 * readPackageJson() is an async function that is used to read the contents of the package.json file.
 * 
 * These contents are checked against in several places in the below code, therefore the all of the 
 * program commands should be wrapped in a self-executing async function.
 * 
 * Without this async wrapper function, the program will exit unexpectedly after user input.
 */ 
(
  async () => {
    const packageJson = await readPackageJson(ROOT_DIR);

    program
      .name('ontario-create-app')
      .version(packageJson.version, '-v, --version', 'Output the current version');
      // TODO: Add a description to package.json
      // .description(packageJson.description);

    program
      // TODO: Can make this more descriptive
      .description('Create a new Ontario Frontend project')
      .option(
        '--local',
        'Use a local version of the Ontario Frontend core dependency',
      )
      .option(
        '--projectName <name>',
        'Specify the project name (lowercase, hyphens, underscores allowed)',
        validFileName
      )
      .action(async (options) => {
        try {
          await handleCreateAppCommand(options);
        } catch (error) {
          logger.error(`Error creating project: ${error.message}`);
          process.exit(1);
        }
      });

    // Error on unknown commands should not interfere with the help option
    program.on('command:*', (operands) => {
      console.error(
        `Invalid command: ${operands[0]}\nSee --help for a list of available commands.`,
      );
      process.exit(1);
    });

    // Append custom help text with a link to the developer site
    program.addHelpText(
      'after',
      `\nFor more information, visit our developer site at https://developer.ontario.ca`,
    );

    // Ensure the help information is displayed when the user explicitly asks for it
    program
      .command('help')
      .description('Display help information and resources')
      .action(() => {
        program.help();
      });

    program.parse(process.argv);
  }
)();
