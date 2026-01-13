const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockToken", function () {
  let owner, user;
  let token;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const MockToken = await ethers.getContractFactory("MockToken");
    token = await MockToken.deploy();
    await token.waitForDeployment();
  });

  it("has correct name and symbol", async function () {
    expect(await token.name()).to.equal("Mock USD");
    expect(await token.symbol()).to.equal("mUSD");
  });

  it("mints 1,000,000 tokens to deployer", async function () {
    const decimals = await token.decimals();
    const expected = ethers.parseUnits("1000000", decimals);

    expect(await token.balanceOf(owner.address)).to.equal(expected);
    expect(await token.totalSupply()).to.equal(expected);
  });

  it("allows transfer", async function () {
    const decimals = await token.decimals();
    const amount = ethers.parseUnits("1000", decimals);

    await token.transfer(user.address, amount);
    expect(await token.balanceOf(user.address)).to.equal(amount);
  });

  it("reverts on too-large transfer", async function () {
    const decimals = await token.decimals();
    const tooMuch = ethers.parseUnits("999999999", decimals);

    await expect(
      token.connect(user).transfer(owner.address, tooMuch)
    ).to.be.reverted;
  });
});
