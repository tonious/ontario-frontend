const path = require('path');
const logger = require('../logger');
const { SHARED_BOILERPLATE_DIR, PACKAGES_CONFIG } = require('../../config');
const { copyFiles } = require('../../operations/file/copy');
const { withErrorHandling } = require('../../errors/errorHandler');
const PackageCopyOperationError = require('../../errors/PackageCopyOperationError');

/**
 * Copies package configuration files from the shared directory to the specified output path.
 *
 * @param {string} outputPath - The path inside your project where the files should be copied.
 * @param {string} packageName - The name of the package to copy config for (e.g., eslint, prettier).
 * @returns {Promise<void>} A promise that resolves when the files are copied successfully or rejects on failure.
 * @throws {PackageCopyOperationError} Will throw an error if the package configuration is not found or any copy operation fails.
 */
async function handlePackageFilesCopy(outputPath, packageName) {
  const packageFiles = PACKAGES_CONFIG[packageName]?.configFiles;

  if (!Array.isArray(packageFiles)) {
    const errorMessage = `Package configuration for ${packageName} not found.`;
    logger.error(errorMessage);
    throw new PackageCopyOperationError('handlePackageFilesCopy', [outputPath, packageName], errorMessage);
  }

  const filesToCopy = packageFiles.map((file) => ({
    source: path.join(SHARED_BOILERPLATE_DIR, file.source),
    destination: path.join(outputPath, file.destination),
  }));

  await copyFiles(filesToCopy);
  logger.success(`All configuration files for ${packageName} copied successfully.`);
}

module.exports = {
  handlePackageFilesCopy: withErrorHandling(handlePackageFilesCopy, PackageCopyOperationError),
};
