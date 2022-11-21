/* Homework 20
1. The shame coin needs to have an administrator address that is set in the constructor.
2. The decimal places should be set to 0.
3. The administrator can send 1 shame coin at a time to other addresses (but keep the
transfer function signature the same)
4. If non administrators try to transfer their shame coin, the transfer function will instead
increase their balance by one.
5. Non administrators can approve the administrator (and only the administrator) to
spend one token on their behalf
6. The transfer from function should just reduce the balance of the holder.
7. Write unit tests to show that the functionality is correct.
8. Document the contract with Natspec, and produce docs from this
*/

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ShameCoin is ERC20, Ownable {

    address public admin;

    constructor(uint256 initialSupply) ERC20("ShameCoin", "SHAME") {
        _mint(msg.sender, initialSupply);
        admin = msg.sender;
    }

    function adminTransfer(address _to) public returns(bool){
        if (msg.sender == admin) {
            transfer(_to, 1);
            return true;
        }
        //add 1 to msg.sender's balance
        return false;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}