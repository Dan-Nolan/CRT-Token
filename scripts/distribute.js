const ADDRESS = ""; // TODO: add your ERC20 address
const hre = require("hardhat");

async function main() {
  const token = await hre.ethers.getContractAt("Token", ADDRESS);
  const amount = ethers.utils.parseEther("100");

  const friends = [
    // TODO: add your friends!
  ];

  for(let i = 0; i < friends.length; i++) {
    await token.transfer(friends[i], amount);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
