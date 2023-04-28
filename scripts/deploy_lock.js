const { ethers } = require("hardhat")

const main = async () => {
    const Lock = await ethers.getContractFactory("Lock")
    const fundingAmount = await ethers.utils.parseEther("0.001")
    const currentTimestampInSeconds = Math.round(Date.now() / 1000)
    const blockTime = currentTimestampInSeconds + 2
    console.log("fundingAmount", fundingAmount)
    const LockContract = await Lock.deploy(blockTime, { value: fundingAmount })
    await LockContract.deployed()

    setTimeout(async () => {
        const transactionResponse = await LockContract.withdraw()
        transactionResponse.wait()
    }, 3000)
    const balanceAfterWithdrawal = await ethers.provider.getBalance(
        LockContract.address
    )
    console.log(
        "balanceAfterWithdrawal",
        ethers.utils.formatEther(balanceAfterWithdrawal)
    )
}

main().catch((error) => {
    console.log("error occured while executing main function", error)
    process.exit(-1)
})
