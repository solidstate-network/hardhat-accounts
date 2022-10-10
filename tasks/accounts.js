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

  const table = new Table({
    head: ['', chalk.bold('Account'), chalk.bold('Native Balance (wei)')],
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
      { content: i, hAlign: 'right' },
      { content: formatAccount(accounts[i]) },
      { content: formatBalance(balances[i]), hAlign: 'right' },
    ]);
  }

  console.log(table.toString());
});
