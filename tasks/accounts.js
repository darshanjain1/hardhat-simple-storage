const { task } = require("hardhat/config")

module.export = task(
    "accounts",
    "get accounts for current network",
    async (tasakArgs, hre) => {
        const accounts = await hre.ethers.getSigners()
        for (const account of accounts)
            console.log("account address", account.address)
    }
)
