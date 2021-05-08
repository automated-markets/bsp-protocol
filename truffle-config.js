const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
import * as dotenv from 'dotenv';
dotenv.config();

const alchemyApiKey = process.env.ETH_ALCHEMY_API_KEY;
const mnemonicPhrase = process.env.ETH_KNOWN_ADDRESS_SOUTHWARK_COUNCIL

module.exports = {

  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: "*",
      gas: 4700000,
      gasPrice: 20 * 1000000000
    },
    kovan: {
      provider: () => new HDWalletProvider({
        mnemonic: mnemonicPhrase,
        providerOrUrl: `https://eth-kovan.alchemyapi.io/v2/${alchemyApiKey}`,
        addressIndex: 0,
        chainId: 42
      }),
      network_id: '42',
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.3"    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
