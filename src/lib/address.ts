const tryImport = async (packageName: string) => {
  try {
    return await import(packageName);
  } catch (error) {
    // optional peer dependency not found; do nothing
  }
};

// Both ethers and viem expose a `getAddress` function which applies
// checksum formatting to an ethereum address.
// Here we attempt to import this function from either package, and
// return a no-op formatter if neither package is present

const mockUtilPackage = { getAddress: (a: string) => a };

const utilPackage: typeof mockUtilPackage =
  (await tryImport('ethers')) ?? (await tryImport('viem')) ?? mockUtilPackage;

export const formatAddress = utilPackage.getAddress;
