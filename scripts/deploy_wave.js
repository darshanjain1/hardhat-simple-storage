const { ethers } = require("hardhat")

const main = async () => {
    const Wave = await ethers.getContractFactory("Wave")
    const fundAmount = ethers.utils.parseEther("0.1")
    const waveContract = await Wave.deploy({ value: fundAmount })
    await waveContract.deployed()
    console.log("Wave contract deployed")
    let contractBalance = await ethers.provider.getBalance(waveContract.address)
    console.log(
        `contract balance is ${ethers.utils.formatEther(contractBalance)}`
    )

    let waveFunCalled = await waveContract.wave(
        "HII, THIS IS MY FIRST WAVE, PLEASE GREET ME WITH ETH"
    )
    await waveFunCalled.wait()
    contractBalance = await ethers.provider.getBalance(waveContract.address)
    console.log(
        `contract balance after funding is ${ethers.utils.formatEther(
            contractBalance
        )}`
    )
    const allWaves = await waveContract.getAllWaves()
    console.log("allWaves", allWaves)
}
main().catch((error) => {
    console.log("Program execution failed due to following error", error)
    process.exit(-1)
})
