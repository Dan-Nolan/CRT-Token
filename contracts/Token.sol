//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  constructor(uint totalSupply) ERC20("Creativity", "CRT") {
    _mint(msg.sender, totalSupply);
  }
}
