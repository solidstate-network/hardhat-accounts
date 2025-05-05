import pkg from '../../package.json';
import chalk from 'chalk';
import Table from 'cli-table3';
import { HardhatPluginError } from 'hardhat/plugins';
import type { NetworkConnection } from 'hardhat/types/network';

type Account = { address: string; balance: bigint };

type Block = { number: string; timestamp: string };

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
          params: [address, BigInt(block.number).toString()],
        })) as string,
      ),
    ),
  );

  return addresses.map((address, i) => ({
    address,
    balance: balances[i],
  }));
};

export const printAccounts = async (
  network: NetworkConnection,
  block: Block,
  accounts: Account[],
) => {
  const chainId = (await network.provider.request({
    method: 'eth_chainId',
  })) as string;

  const padding = 2;

  const table = new Table({
    // set width of first column dynamically
    colWidths: [padding * 2 + accounts.length.toString().length],
    style: {
      head: [],
      border: [],
      'padding-left': padding,
      'padding-right': padding,
    },
    chars: {
      mid: '·',
      'top-mid': '|',
      'left-mid': ' ·',
      'mid-mid': '|',
      'right-mid': '·',
      left: ' |',
      'top-left': ' ·',
      'top-right': '·',
      'bottom-left': ' ·',
      'bottom-right': '·',
      middle: '·',
      top: '-',
      bottom: '-',
      'bottom-mid': '|',
    },
  });

  table.push([
    {
      hAlign: 'center',
      colSpan: 2,
      content: chalk.gray(`Network: ${network.networkName}`),
    },
    {
      hAlign: 'center',
      content: chalk.gray(`Chain ID: ${parseInt(chainId)}`),
    },
    {
      hAlign: 'center',
      content: chalk.gray(`Block Number: ${parseInt(block.number)}`),
    },
    {
      hAlign: 'center',
      content: chalk.gray(`Timestamp: ${parseInt(block.timestamp)}`),
    },
  ]);

  table.push([
    {
      colSpan: 4,
      content: chalk.bold('Account'),
    },
    {
      content: chalk.bold('Native Balance (wei)'),
    },
  ]);

  const formatAddress = (address: string) => {
    // if ethers library is present, checksum address
    // if not, who cares?
    // TODO: checksum
    // return (hre as any).ethers?.utils?.getAddress?.(address) ?? address;
    return address;
  };

  const formatBalance = (balance: bigint) => {
    const decimals = 18;

    const padded = balance.toString().padStart(decimals, '0');

    let integer = padded.slice(0, padded.length - decimals);
    let decimal = padded.slice(padded.length - decimals);

    if (integer.length == 0) {
      decimal = decimal.replace(/^(0*)(?=.)/, '');
    }

    return `${integer}${chalk.gray(decimal)}`;
  };

  for (let i = 0; i < accounts.length; i++) {
    const { address, balance } = accounts[i];

    table.push([
      {
        hAlign: 'right',
        content: chalk.gray(i),
      },
      {
        colSpan: 3,
        content: formatAddress(address),
      },
      {
        hAlign: 'right',
        content: formatBalance(balance),
      },
    ]);
  }

  console.log(table.toString());
};
