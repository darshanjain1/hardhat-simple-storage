//SPDX-License-Identifier:MIT

pragma solidity ^0.8.18;

contract Wave {
    uint256 totalWaves;
    struct WaveStruct {
        address waver;
        uint256 time;
        string message;
    }
    WaveStruct[] public wavers;
    mapping(address => string) public addressTomessage;

    event NewWave(address, uint256);

    constructor() payable {}

    function wave(string memory _message) public {
        uint256 prizeAmount = 0.0001 ether;
        totalWaves += 1;
        require(
            address(this).balance >= prizeAmount,
            "Trying to withdraw more money than contract has."
        );
        (bool callSucess, ) = payable(msg.sender).call{value: prizeAmount}("");
        require(callSucess, "couldn't send ether");
        wavers.push(WaveStruct(msg.sender, block.timestamp, _message));
        emit NewWave(msg.sender, block.timestamp);
        addressTomessage[msg.sender] = _message;
    }

    function getAllWaves() public view returns (WaveStruct[] memory) {
        return wavers;
    }

    receive() external payable {
        wave("DEFAULT MESSAGE");
    }

    fallback() external payable {
        wave("DEFAULT MESSAGE");
    }
}
