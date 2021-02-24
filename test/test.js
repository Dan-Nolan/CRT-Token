const { assert } = require("chai");

describe("Token", function() {
  const totalSupply = ethers.utils.parseEther("10000");

  let token;
  let deployer, deployerAddress;
  before(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);
    await token.deployed();

    deployer = ethers.provider.getSigner(0);
    deployerAddress = await deployer.getAddress();
  });

  it("should mint us the whole supply", async function() {
    const balance = await token.balanceOf(deployerAddress);

    assert.equal(balance.toString(), totalSupply.toString());
  });

  describe("we transfer to another person", () => {
    const amount = ethers.utils.parseEther("100");
    let otherAccount;

    before(async () => {
      otherAccount = (await ethers.provider.listAccounts())[1];
      await token.transfer(otherAccount, amount);
    });

    it("should add the tokens to the other account", async () => {
      const balance = await token.balanceOf(otherAccount);
      assert.equal(balance.toString(), amount.toString());
    });

    it("should sub the tokens from the owner account", async () => {
      const balance = await token.balanceOf(deployerAddress);
      assert.equal(balance.toString(), totalSupply.sub(amount).toString());
    });
  });

  describe("a deposit into the DEX", () => {
    const amount = ethers.utils.parseEther("100");
    let dex;
    before(async () => {
      const Dex = await ethers.getContractFactory("DEX");
      dex = await Dex.deploy();
      await dex.deployed();
    });

    it("should revert without approval", async () => {
      let ex;
      try {
        await dex.deposit(token.address, amount);
      }
      catch(_ex) {
        ex = _ex;
      }
      assert(ex.message.indexOf("revert ERC20") >= 0, "it should REVERT");
    });

    // two step process
    describe("approve beforehand", () => {
      before(async () => {
        await token.approve(dex.address, amount);
      });

      it("should update the allowance", async () => {
        const allowance = await token.allowance(deployerAddress, dex.address);

        assert.equal(allowance.toString(), amount.toString());
      });

      it("should allow the deposit", async () => {
        await dex.deposit(token.address, amount);

        const balance = await token.balanceOf(dex.address);
        assert.equal(balance.toString(), amount.toString());
      });
    });
  });
});
