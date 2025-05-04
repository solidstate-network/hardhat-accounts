import chalk from 'chalk';
import Table from 'cli-table3';
import type { NewTaskActionFunction } from 'hardhat/types/tasks';

const action: NewTaskActionFunction = async (args, hre) => {
  const network = await hre.network.connect();
  const { provider } = network;

  const chainId = (await provider.request({ method: 'eth_chainId' })) as string;
  const blockNumber = (await provider.request({
    method: 'eth_blockNumber',
  })) as string;
  const { timestamp } = (await provider.request({
    method: 'eth_getBlockByNumber',
    params: [blockNumber, false],
  })) as { timestamp: string };

  const addresses: string[] = (await provider.request({
    method: 'eth_accounts',
  })) as string[];
  const balances: bigint[] = await Promise.all(
    addresses.map(async (address) =>
      BigInt(
        (await provider.request({
          method: 'eth_getBalance',
          params: [address, blockNumber],
        })) as string,
      ),
    ),
  );

  const accounts: { address: string; balance: bigint }[] = [];

  for (let i = 0; i < addresses.length; i++) {
    accounts.push({ address: addresses[i], balance: balances[i] });
  }

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
    return (hre as any).ethers?.utils?.getAddress?.(account) ?? account;
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

  return accounts;
};

export default action;
