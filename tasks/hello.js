const { task } = require("hardhat/config")
module.export = task("hello-world", "Prints a hello world message").setAction(
    async (taskArgs, hre) => {
        await run("print", { message: "Hello, World!" })
    }
)

subtask("print", "Prints a message")
    .addParam("message", "The message to print")
    .setAction(async (taskArgs) => {
        console.log(taskArgs.message)
    })
