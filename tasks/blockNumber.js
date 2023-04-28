const { task, types } = require("hardhat/config")

module.export = task(
    "block-number",
    "prints the current block number",
    async (taskArgs, hre) => {
        const block = await hre.ethers.provider.getBlockNumber()
        console.log("current block is", block)
    }
)
