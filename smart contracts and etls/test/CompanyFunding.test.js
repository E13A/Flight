const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CompanyFunding", function () {
  let admin, company, user, oracle;
  let token, funding;

  beforeEach(async function () {
    [admin, company, user, oracle] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const CF = await ethers.getContractFactory("CompanyFunding");
    funding = await CF.deploy(token.target, admin.address);
    await funding.waitForDeployment();

    // Admin grants INSURANCE_ROLE to oracle
    await funding.connect(admin).grantInsuranceRole(oracle.address);

    // Give company some tokens
    const mintAmount = ethers.parseUnits("5000", await token.decimals());
    await token.transfer(company.address, mintAmount);
  });

  it("company can fund its pool", async function () {
    const amount = ethers.parseUnits("1000", await token.decimals());
    await token.connect(company).approve(funding.target, amount);

    await expect(funding.connect(company).fundCompany(amount))
      .to.emit(funding, "CompanyFunded")
      .withArgs(company.address, amount);

    expect(await token.balanceOf(funding.target)).to.equal(amount);
    expect(await funding.companyBalances(company.address)).to.equal(amount);
  });

  it("company can withdraw from pool", async function () {
    const amount = ethers.parseUnits("1000", await token.decimals());
    await token.connect(company).approve(funding.target, amount);
    await funding.connect(company).fundCompany(amount);

    await expect(funding.connect(company).withdrawCompany(amount))
      .to.emit(funding, "CompanyWithdrawn")
      .withArgs(company.address, amount);
  });

  it("oracle can pay compensation", async function () {
    const amount = ethers.parseUnits("1000", await token.decimals());
    await token.connect(company).approve(funding.target, amount);
    await funding.connect(company).fundCompany(amount);

    const payout = ethers.parseUnits("200", await token.decimals());

    await expect(
      funding
        .connect(oracle)
        .payCompensation(company.address, user.address, 1, payout)
    )
      .to.emit(funding, "CompensationPaid")
      .withArgs(company.address, user.address, 1, payout);

    expect(await token.balanceOf(user.address)).to.equal(payout);
  });

  it("reverts if non-insurance role calls payCompensation", async function () {
      const requiredRole = await funding.INSURANCE_ROLE();

      await expect(
          funding.connect(user).payCompensation(company.address, user.address, 1, 50)
      ).to.be.revertedWith(
          `AccessControl: account ${user.address.toLowerCase()} is missing role ${requiredRole}`
      );
  });

});
