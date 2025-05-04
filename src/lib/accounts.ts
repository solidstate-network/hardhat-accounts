import pkg from '../../package.json';
import chalk from 'chalk';
import Table from 'cli-table3';
import { HardhatPluginError } from 'hardhat/plugins';
import type { NetworkConnection } from 'hardhat/types/network';

export const getAccounts = async (
  network: NetworkConnection,
): Promise<string[]> => {
  return (await network.provider.request({
    method: 'eth_accounts',
  })) as string[];
};

export const getBalances = async (
  network: NetworkConnection,
  accounts?: string[],
  blockNumber: string = 'latest',
): Promise<bigint[]> => {
  accounts ??= await getAccounts(network);

  return await Promise.all(
    accounts.map(async (account) =>
      BigInt(
        (await network.provider.request({
          method: 'eth_getBalance',
          params: [account, blockNumber],
        })) as string,
      ),
    ),
  );
};

export const printAccounts = async (
  network: NetworkConnection,
  accounts?: string[],
  blockNumber: string = 'latest',
) => {
  const { provider } = network;

  const chainId = (await provider.request({ method: 'eth_chainId' })) as string;

  const block = (await provider.request({
    method: 'eth_getBlockByNumber',
    params: [blockNumber, false],
  })) as { number: string; timestamp: string } | null;

  if (!block) {
    throw new HardhatPluginError(
      pkg.name,
      `No block found with number ${blockNumber}`,
    );
  }

  const { timestamp } = block;

  // if decimal number is used for block lookup, convert to hex
  // if 'latest' is used for block lookup, convert to fixed value for subsequent requests
  blockNumber = block.number;

  accounts ??= await getAccounts(network);
  const balances = await getBalances(network, accounts, blockNumber);

  const entries = accounts.map((account, i) => ({
    address: account,
    balance: balances[i],
  }));

  const padding = 2;

  const table = new Table({
    // set width of first column dynamically
    colWidths: [padding * 2 + entries.length.toString().length],
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
      content: chalk.gray(`Block Number: ${parseInt(blockNumber)}`),
    },
    {
      hAlign: 'center',
      content: chalk.gray(`Timestamp: ${parseInt(timestamp)}`),
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

  const formatAddress = (account: string) => {
    // if ethers library is present, checksum address
    // if not, who cares?
    // TODO: checksum
    // return (hre as any).ethers?.utils?.getAddress?.(account) ?? account;
    return account;
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

  for (let i = 0; i < entries.length; i++) {
    const { address, balance } = entries[i];

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

  return entries;
};
