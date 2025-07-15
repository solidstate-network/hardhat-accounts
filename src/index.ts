import pkg from '../package.json' with { type: 'json' };
import taskAccounts from './tasks/accounts.js';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name,
  npmPackage: pkg.name,
  dependencies: [
    async () => (await import('@solidstate/hardhat-solidstate-utils')).default,
  ],
  tasks: [taskAccounts],
};

export default plugin;
