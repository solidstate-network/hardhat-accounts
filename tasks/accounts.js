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
    head: [chalk.bold('Account'), chalk.bold('Native Balance (wei)')],
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

  for (let i = 0; i < accounts.length; i++) {
    table.push([
      { content: accounts[i] },
      { content: balances[i] },
    ]);
  }

  console.log(table.toString());
});
