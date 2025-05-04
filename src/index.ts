import pkg from '../package.json';
import taskAccounts from './tasks/accounts.js';
import type { HardhatPlugin } from 'hardhat/types/plugins';

const plugin: HardhatPlugin = {
  id: pkg.name,
  npmPackage: pkg.name,
  tasks: [taskAccounts],
};

export default plugin;
