const { ethers, network, run } = require("hardhat")
require("@nomiclabs/hardhat-etherscan")
const main = async () => {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log("simpleStorage.address", simpleStorage.address)
    if (network.config.chainId == 11155111 && process.env.PRIVATE_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    const favoriteNumber = await simpleStorage.retrieve()
    console.log("favoriteNumber", favoriteNumber)
    const transactionResponse = await simpleStorage.store(4)
    await transactionResponse.wait()
    const updatedFavoriteNumber = await simpleStorage.retrieve()
    console.log("updatedFavoriteNumber", updatedFavoriteNumber)
}

const verify = async (contractAddress, args) => {
    try {
        console.log("verifying contract...")
        await run("verify", {
            address: contractAddress,
            constructorAr: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified"))
            console.log("already verified")
        console.log("error in verification", error)
    }
}
main().catch((error) => {
    console.log("error in executing main function ", error)
    process.exit(1)
})
