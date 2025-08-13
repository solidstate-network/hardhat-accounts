import pkg from '../package.json' with { type: 'json' };
import taskAccounts from './tasks/accounts.js';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name,
  npmPackage: pkg.name,
  dependencies: () => [import('@solidstate/hardhat-solidstate-utils')],
  tasks: [taskAccounts],
};

export default plugin;
