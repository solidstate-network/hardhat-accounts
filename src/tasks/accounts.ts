import { TASK_ACCOUNTS } from '../task_names.js';
import { task } from 'hardhat/config';
import { ArgumentType } from 'hardhat/types/arguments';

export default task(TASK_ACCOUNTS)
  .setDescription('Output list of available accounts')
  .addVariadicArgument({
    name: 'addresses',
    description:
      'List of addresses to lookup (defaults to accounts defined in Hardhat configuration)',
    defaultValue: [],
  })
  .addOption({
    name: 'blockNumber',
    description: 'lock number to use for balance lookup',
    defaultValue: undefined,
    type: ArgumentType.STRING_WITHOUT_DEFAULT,
  })
  .setAction(import.meta.resolve('../actions/accounts.js'))
  .build();
