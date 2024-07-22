import chalk from 'chalk';
import Table from 'cli-table3';
import { task } from 'hardhat/config';

task('accounts', 'Output list of available accounts').setAction(
  async (args, hre) => {
    const { provider } = hre.network;

    const chainId = await provider.send('eth_chainId');
    const blockNumber = await provider.send('eth_blockNumber');
    const { timestamp } = await provider.send('eth_getBlockByNumber', [
      blockNumber,
      false,
    ]);

    const addresses: string[] = await provider.send('eth_accounts');
    const balances: bigint[] = await Promise.all(
      addresses.map(async (address) =>
        BigInt(await provider.send('eth_getBalance', [address, blockNumber])),
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
        content: chalk.gray(`Network: ${hre.network.name}`),
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
  },
);
