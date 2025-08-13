import { getAccounts, getBlock } from '../lib/accounts.js';
import { printAccounts } from '../lib/print.js';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

interface AccountsActionArguments {
  addresses: string[];
  blockNumber?: string;
}

const action: NewTaskActionFunction<AccountsActionArguments> = async (
  args,
  hre,
) => {
  const network = await hre.network.connect();

  // block is used instead of blockNumber for several reasons:
  // * decimal number must be converted to hex for JSON-RPC requests
  // * 'latest' must be converted to fixed value to prevent race conditions
  // * both block number and timestamp are needed for table output
  const block = await getBlock(network, args.blockNumber);

  const accounts = await getAccounts(
    network,
    block,
    args.addresses.length ? args.addresses : undefined,
  );

  await printAccounts(network, block, accounts);

  return accounts;
};

export default action;
