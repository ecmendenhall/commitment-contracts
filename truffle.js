const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = process.env.ROPSTEN_MNEMONIC;
const infuraEndpoint = `https://ropsten.infura.io/${ process.env.INFURA_ACCESS_TOKEN }`;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(mnemonic, infuraEndpoint);
      },
      network_id: 3,
      gas: 4700000
    },
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
