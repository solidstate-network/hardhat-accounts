import { task } from 'hardhat/config';

export default task('accounts')
  .setDescription('Output list of available accounts')
  .setAction(import.meta.resolve('../actions/accounts.js'))
  .build();
