# Hardhat Accounts

Output list of available accounts and balances.

## Installation

```bash
npm install --save-dev @solidstate/hardhat-accounts
# or
pnpm add -D @solidstate/hardhat-accounts
```

## Usage

Load plugin in Hardhat config:

```javascript
import hardhatAccounts from '@solidstate/hardhat-accounts';

const config: HardhatUserConfig = {
  plugins: [
    hardhatAccounts,
  ],
};
```

Run the included Hardhat task to output available accounts:

```bash
npx hardhat accounts
# or
pnpm hardhat accounts
```

## Development

Install dependencies via pnpm:

```bash
pnpm install
```

Setup Husky to format code on commit:

```bash
pnpm prepare
```
