const nunjucks = require('nunjucks');
const { withErrorHandling } = require('../../errors/errorHandler');
const TemplateConfigurationError = require('../../errors/TemplateConfigurationError'); // Custom error class

/**
 * Configures the Nunjucks templating engine.
 *
 * @param {string} templatesPath - Path to the directory containing template files.
 * @throws {TemplateConfigurationError} Throws an error if the templatesPath is not a string or is empty.
 */
async function configureTemplates(templatesPath) {
  if (typeof templatesPath !== 'string' || templatesPath.trim() === '') {
    throw new TemplateConfigurationError(
      'configureTemplates',
      templatesPath,
      'Invalid templates path. Please provide a valid string path to the templates directory.',
    );
  }

  // Setting up Nunjucks with the provided templates directory and enabling autoescape for security.
  nunjucks.configure(templatesPath, { autoescape: true });
}

/**
 * Maps application templates to their correct output location in new projects.
 *
 * @param {Object} answers - The user answers from the CLI prompts.
 * @param {string} answers.enPage - The name of the English page.
 * @param {string} answers.frPage - The name of the French page.
 * @returns {Array<Object>} An array of template mappings.
 */
const ontarioCreateAppTemplates = (answers) => [
  { template: 'package.njk', outputDir: '', outputFile: 'package.json' },
  { template: 'README.njk', outputDir: '', outputFile: 'README.md' },
  { template: 'eleventy.njk', outputDir: '', outputFile: '.eleventy.js' },
  { template: 'en.njk', outputDir: 'src', outputFile: `${answers.enPage}.njk` },
  { template: 'index.njk', outputDir: 'src', outputFile: 'index.njk' },
  { template: 'fr.njk', outputDir: 'src', outputFile: `${answers.frPage}.njk` },
  { template: 'sitemap.njk', outputDir: 'src', outputFile: 'sitemap.njk' },
  { template: 'globals.njk', outputDir: 'src/_data', outputFile: 'globals.js' },
  { template: 'env.njk', outputDir: '', outputFile: '.env' },
  { template: '/tests/app/unit/app.spec.njk', outputDir: 'src/tests/app/_unit', outputFile: 'app.spec.js' },
  { template: '/tests/app/integration/packages.spec.njk', outputDir: 'src/tests/app/integration', outputFile: 'packages.spec.js' },
  { template: '/tests/e2e/nightwatch.conf.njk', outputDir: '', outputFile: 'nightwatch.conf.js' },
  { template: '/tests/e2e/prompt.spec.njk', outputDir: 'src/tests/e2e', outputFile: '_prompt.spec.js' },
  { template: '/tests/e2e/localization.spec.njk', outputDir: 'src/tests/e2e', outputFile: 'localization.spec.js' },
  { template: '/tests/e2e/search.spec.njk', outputDir: 'src/tests/e2e', outputFile: 'search.spec.js' }
];

module.exports = {
  configureTemplates: withErrorHandling(
    configureTemplates,
    TemplateConfigurationError,
  ),
  ontarioCreateAppTemplates,
};
