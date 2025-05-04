# Hardhat Accounts

Output list of available accounts and balances.

## Installation

```bash
npm install --save-dev @solidstate/hardhat-accounts
# or
yarn add --dev @solidstate/hardhat-accounts
```

## Usage

Load plugin in Hardhat config:

```javascript
import HardhatAccounts from '@solidstate/hardhat-accounts';

const config: HardhatUserConfig = {
  plugins: [
    HardhatAccounts,
  ],
};
```

Run the included Hardhat task to output available accounts:

```bash
npx hardhat accounts
# or
yarn run hardhat accounts
```

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```
