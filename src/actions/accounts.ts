import { getAccounts, printAccounts } from '../lib/accounts.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

const action: NewTaskActionFunction = async (args, hre) => {
  const network = await hre.network.connect();
  const accounts = await getAccounts(network);
  await printAccounts(network, accounts);
  return accounts;
};

export default action;
