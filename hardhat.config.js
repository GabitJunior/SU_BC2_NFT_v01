require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const BNBT_PRIVATE_KEY = process.env.BNBT_PRIVATE_KEY;
const BNBT_RPC_URL = process.env.BNBT_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    bnbt:{
      url: BNBT_RPC_URL,
      accounts: [BNBT_PRIVATE_KEY],
      chainId: 97
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};