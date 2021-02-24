//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEX {
  // allow a user to deposit some ERC20 token into the DEX
  function deposit(address erc20, uint amount) external {
    IERC20(erc20).transferFrom(msg.sender, address(this), amount);
  }
}
