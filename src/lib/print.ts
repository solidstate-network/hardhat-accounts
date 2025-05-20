import type { Block, Account } from '../types.js';
import chalk from 'chalk';
import Table from 'cli-table3';
import type { NetworkConnection } from 'hardhat/types/network';

const tryImport = async (packageName: string) => {
  try {
    return await import(packageName);
  } catch (error) {
    // do nothing
  }
};

const utilPackage = (await tryImport('ethers')) ?? (await tryImport('viem'));
const formatAddress: (a: string) => string =
  utilPackage?.getAddress ?? ((a: string) => a);

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
