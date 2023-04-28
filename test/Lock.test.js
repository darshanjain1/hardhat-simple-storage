const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Lock", () => {
    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60
        const ONE_ETH = "1"

        // const lockedAmount = await ethers.utils.parseEther(ONE_ETH)
        const lockedAmount = ONE_ETH
        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECONDS
        const [owner, otherAccount] = await ethers.getSigners()
        const LockFactory = await ethers.getContractFactory("Lock")
        const Lock = await LockFactory.deploy(unlockTime, {
            value: "1",
        })
        await Lock.deployed()
        const balance = await ethers.provider.getBalance(Lock.address)
        return {
            owner,
            otherAccount,
            unlockTime,
            lockedAmount,
            Lock,
        }
    }

    describe("Deployment", function () {
        it("Should set the right unlock time", async function () {
            const { unlockTime, Lock } = await loadFixture(
                deployOneYearLockFixture
            )
            expect(unlockTime).to.equal(await Lock.unblockTime())
        })
        // it("Locked amount must be 1 Gwei", async () => {
        //     const { Lock } = await loadFixture(deployOneYearLockFixture)
        //     expect(ethers.utils.formatEther("1000000000000000000")).to.equal(
        //         await ethers.provider.getBalance(Lock.address).then((res) => {
        //             return ethers.utils.formatEther(res)
        //         })
        //     )
        // })
        it("Locked amount must be 1 wei", async () => {
            const { Lock } = await loadFixture(deployOneYearLockFixture)
            expect(1).to.equal(await ethers.provider.getBalance(Lock.address))
        })
        it("Should set the right owner", async () => {
            const { Lock, owner } = await loadFixture(deployOneYearLockFixture)
            expect(owner.address).to.equal(await Lock.owner())
        })
        it("Should fail if unlock time is not in future", async () => {
            // we don't use fixture here because we want a different deployment
            const latestTime = await time.latest()
            const Lock = await ethers.getContractFactory("Lock")
            await expect(
                Lock.deploy(latestTime, { value: "1" })
            ).to.be.revertedWith("Unblock time should be in future")
        })
    })

    describe("withdrawal", () => {
        it("Only contract owner can withdraw funds", async () => {
            const { Lock, otherAccount } = await loadFixture(
                deployOneYearLockFixture
            )
            await expect(
                Lock.connect(otherAccount).withdraw()
            ).to.be.revertedWith("Only owner can withdraw funds")
        })

        it("Cannot withdraw before Lock period", async () => {
            const { Lock, unblockTime } = await loadFixture(
                deployOneYearLockFixture
            )
            await expect(Lock.withdraw()).to.be.revertedWith(
                "couldn't withdraw before block period"
            )
        })
        it("Should be able to successfully withdaw fund if the withdrawer is owner & withdraw funds after lock period", async () => {
            const { Lock, unlockTime } = await loadFixture(
                deployOneYearLockFixture
            )
            // we can increase the time in hardhat network
            await time.increase(unlockTime)
            await expect(Lock.withdraw()).not.to.be.reverted
        })
        describe("Events", () => {
            it("Should emit event on withdrawal", async () => {
                const { Lock, unlockTime, lockedAmount } = await loadFixture(
                    deployOneYearLockFixture
                )
                await time.increaseTo(unlockTime)
                await expect(Lock.withdraw())
                    .to.emit(Lock, "Withdrawal")
                    .withArgs(lockedAmount, anyValue)
            })
        })
    })

    describe("Transfer", function () {
        it("Should transfer funds to owner", async () => {
            const { Lock, owner, unlockTime, lockedAmount } = await loadFixture(
                deployOneYearLockFixture
            )
            await time.increaseTo(unlockTime)
            await expect(Lock.withdraw()).to.changeEtherBalances(
                [owner, Lock],
                [lockedAmount, -lockedAmount]
            )
        })
    })
})
