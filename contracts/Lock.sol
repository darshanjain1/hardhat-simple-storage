//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

contract Lock {
    uint256 public immutable unblockTime;
    address payable public immutable owner;
    event Withdrawal(uint amount, uint256 when);

    constructor(uint256 _unblockTime) payable {
        require(
            block.timestamp < _unblockTime,
            "Unblock time should be in future"
        );
        owner = payable(msg.sender);
        unblockTime = _unblockTime;
    }

    function withdraw() public onlyOwner {
        emit Withdrawal((address(this).balance), block.timestamp);
        // (bool withdrawSuccess, ) = owner.call{value: address(this).balance}("");
        owner.transfer(address(this).balance);
        // require(withdrawSuccess, "could not withdraw funds");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can withdraw funds");
        require(
            block.timestamp >= unblockTime,
            "couldn't withdraw before block period"
        );
        _;
    }
}
