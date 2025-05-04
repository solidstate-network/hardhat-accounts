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
    arbitrum: {
      type: 'http',
      url: 'https://endpoints.omniatech.io/v1/arbitrum/one/public',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
  },
};

export default config;
