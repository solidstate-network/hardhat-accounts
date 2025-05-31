import pkg from '../../package.json' with { type: 'json' };
import type { Block, Account } from '../types.js';
import { HardhatPluginError } from 'hardhat/plugins';
import type { NetworkConnection } from 'hardhat/types/network';

export const getBlock = async (
  network: NetworkConnection,
  blockNumber: string = 'latest',
): Promise<Block> => {
  if (blockNumber !== 'latest') {
    blockNumber = `0x${BigInt(blockNumber).toString(16)}`;
  }

  const block = (await network.provider.request({
    method: 'eth_getBlockByNumber',
    params: [blockNumber, false],
  })) as Block | null;

  if (!block) {
    throw new HardhatPluginError(
      pkg.name,
      `No block found with number ${blockNumber}`,
    );
  }

  return block;
};

export const getAccounts = async (
  network: NetworkConnection,
  block: Block,
  addresses?: string[],
): Promise<Account[]> => {
  addresses ??= (await network.provider.request({
    method: 'eth_accounts',
  })) as string[];

  const balances = await Promise.all(
    addresses.map(async (address) =>
      BigInt(
        (await network.provider.request({
          method: 'eth_getBalance',
          params: [address, block.number],
        })) as string,
      ),
    ),
  );

  return addresses.map((address, i) => ({
    address,
    balance: balances[i],
  }));
};
