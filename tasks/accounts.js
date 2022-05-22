task(
  'accounts', 'Output list of available accounts'
).setAction(async function (args, hre) {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
