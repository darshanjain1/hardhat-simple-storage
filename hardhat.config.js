require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
// require("./tasks")
/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY = process.env.API_KEY
const COIN_MARKETCAP_API = process.env.COIN_MARKETCAP_API
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        // localhost: {
        //     url: "http://127.0.0.1:8545/",
        //     accounts: Thanks hardhat
        //     chainId: 31337,
        // },
    },
    etherscan: {
        apiKey: API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        coinmarketcap: COIN_MARKETCAP_API,
        outputFile: "gas-report.txt",
        noColors: true,
        token: "ETH",
    },  
    solidity: "0.8.18",
}
