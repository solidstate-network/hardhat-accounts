import { getAddresses, printAccounts } from '../lib/accounts.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

interface AccountsActionArguments {
  blockNumber: string;
}

const action: NewTaskActionFunction<AccountsActionArguments> = async (
  args,
  hre,
) => {
  const network = await hre.network.connect();
  const accounts = await getAddresses(network);
  await printAccounts(network, accounts, args.blockNumber || undefined);
  return accounts;
};

export default action;
