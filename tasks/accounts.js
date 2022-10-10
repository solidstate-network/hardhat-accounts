task(
  'accounts', 'Output list of available accounts'
).setAction(async function (args, hre) {
  const { provider } = hre.network;

  const accounts = await provider.send('eth_accounts');
  const balances = await Promise.all(accounts.map(
    account => provider.send('eth_getBalance', [account])
  ));

  for (let i = 0; i < accounts.length; i++) {
    console.log(accounts[i]);
    console.log(balances[i]);
  }
});
