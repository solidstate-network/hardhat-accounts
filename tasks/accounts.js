const chalk = require('chalk');
const Table = require('cli-table3');

task(
  'accounts', 'Output list of available accounts'
).setAction(async function (args, hre) {
  const { provider } = hre.network;

  const accounts = await provider.send('eth_accounts');
  const balances = await Promise.all(accounts.map(
    account => provider.send('eth_getBalance', [account])
  ));

  const chainId = await provider.send('eth_chainId');
  const blockNumber = await provider.send('eth_blockNumber');
  const { timestamp } = await provider.send('eth_getBlockByNumber', [blockNumber, false]);

  const table = new Table({
    // set width of first column dynamically
    colWidths: [4 + accounts.length.toString().length],
    style: { head: [], border: [], 'padding-left': 2, 'padding-right': 2 },
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
      content: chalk.grey(`Network: ${ hre.network.name }`),
    },
    {
      hAlign: 'center',
      content: chalk.grey(`Chain ID: ${ parseInt(chainId) }`),
    },
    {
      hAlign: 'center',
      content: chalk.grey(`Block Number: ${ parseInt(blockNumber)}`)
    },
    {
      hAlign: 'center',
      content: chalk.grey(`Timestamp: ${ parseInt(timestamp)}`)
    }
  ]);

  table.push([
    {
      colSpan: 4,
      content: chalk.bold('Account'),
    },
    {
      content: chalk.bold('Native Balance (wei)'),
    }
  ]);

  const formatAccount = (account) => {
    // if ethers library is present, checksum address
    // if not, who cares?
    return hre.ethers?.utils?.getAddress?.(account) || account;
  }

  const formatBalance = (balance) => {
    const decimals = 18;

    const padded = BigInt(balance).toString().padStart(decimals, '0');

    let integer = padded.slice(0, padded.length - decimals);
    let decimal = padded.slice(padded.length - decimals);

    if (integer.length == 0) {
      decimal = decimal.replace(/^(0*)(?=.)/, '');
    }

    return `${ (integer) }${ chalk.gray(decimal) }`;
  }

  for (let i = 0; i < accounts.length; i++) {
    table.push([
      {
        hAlign: 'right',
        content: chalk.gray(i),
      },
      {
        colSpan: 3,
        content: formatAccount(accounts[i]),
      },
      {
        hAlign: 'right',
        content: formatBalance(balances[i]),
      },
    ]);
  }

  console.log(table.toString());
});
