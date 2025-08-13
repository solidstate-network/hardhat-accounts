import type { Block, Account } from '../types.js';
import { formatAddress } from './address.js';
import { createTable } from '@solidstate/hardhat-solidstate-utils/table';
import chalk from 'chalk';
import type { NetworkConnection } from 'hardhat/types/network';

export const printAccounts = async (
  network: NetworkConnection,
  block: Block,
  accounts: Account[],
) => {
  const chainId = (await network.provider.request({
    method: 'eth_chainId',
  })) as string;

  const table = createTable({
    colWidths: [/* padding * 2 = 4 */ 4 + accounts.length.toString().length],
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
