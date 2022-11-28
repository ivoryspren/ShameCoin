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

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ShameCoin is ERC20 {

    address public immutable admin;

    /**
    * @dev Sets the name and symbold of this token
    * @dev Sets admin to msg.sender when deploying contract
    */
    constructor() ERC20("ShameCoin", "SHM") {
        admin = msg.sender;
    }

    /// @dev Sets the number of decimals to 0
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    /**
    * @dev transfer requirements:
    * admin can only send 1 token at a time to "to" address
    * if non-admin calls this transfer, mint 1 token to msg.sender
    */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        if (msg.sender == admin) {
            require(amount ==1, "Amount can only be 1");
            _mint(to, 1);
            return true;
        } else{
        _mint(msg.sender, 1);
        return true;
        }
    }
    /**
    * @dev approve requirements:
    * spender has to be the admin
    * amount has to be 1
    */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        require(spender == admin, "Spender can only be admin");
        require(amount == 1, "Amount can only be 1");
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true; 
    }

    /**
    * @dev transferFrom requirements:
    * 'from' address has to have a balance >= 'amount'
    * caller has to have an allowance for 'from' balance of >= 'amount'
    * 'from' address decreases by 1
    * nothing happens to the 'to' address balance;
    */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _burn(from, amount);
        return true;
    }
}
