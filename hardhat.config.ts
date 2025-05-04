import HardhatAccounts from './src/index.js';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  plugins: [HardhatAccounts],
  networks: {
    ethereum: {
      type: 'http',
      url: 'https://eth.llamarpc.com',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
  },
};

export default config;
