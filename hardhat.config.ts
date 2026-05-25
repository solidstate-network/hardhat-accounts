import hardhatAccounts from './src/index.js';
import type { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  plugins: [hardhatAccounts],
  networks: {
    ethereum: {
      type: 'http',
      url: 'https://ethereum.publicnode.com',
      accounts: {
        mnemonic: 'test test test test test test test test test test test junk',
      },
    },
  },
};

export default config;
