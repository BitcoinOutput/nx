import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  removeDependenciesFromPackageJson,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { jestVersion, typesNodeVersion } from '@nx/jest/src/utils/versions';

import { Schema } from './schema';
import {
  detoxVersion,
  nxVersion,
  testingLibraryJestDom,
} from '../../utils/versions';

export async function detoxInitGenerator(host: Tree, schema: Schema) {
  const tasks: GeneratorCallback[] = [];

  if (!schema.skipPackageJson) {
    tasks.push(moveDependency(host));
    tasks.push(updateDependencies(host));
  }

  if (!schema.skipFormat) {
    await formatFiles(host);
  }

  return runTasksInSerial(...tasks);
}

export function updateDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@nx/detox': nxVersion,
      detox: detoxVersion,
      '@testing-library/jest-dom': testingLibraryJestDom,
      '@types/node': typesNodeVersion,
      'jest-circus': jestVersion,
    }
  );
}

function moveDependency(host: Tree) {
  return removeDependenciesFromPackageJson(host, ['@nx/detox'], []);
}

export default detoxInitGenerator;
export const detoxInitSchematic = convertNxGenerator(detoxInitGenerator);
