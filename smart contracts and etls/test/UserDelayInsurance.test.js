const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserDelayInsurance", function () {
  let admin, oracle, company, user;
  let token, tp, cf, ins;

  beforeEach(async function () {
    [admin, oracle, company, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const TP = await ethers.getContractFactory("TicketProvider");
    tp = await TP.deploy(admin.address);
    await tp.waitForDeployment();

    await tp.connect(admin).registerCompany(company.address, "AZ", "uri");
    await tp.connect(company).registerFlight("AZ301", 1700000000);

    const CF = await ethers.getContractFactory("CompanyFunding");
    cf = await CF.deploy(token.target, admin.address);
    await cf.waitForDeployment();

    // Admin grants INSURANCE_ROLE to insurance contract later
    const UI = await ethers.getContractFactory("UserDelayInsurance");
    ins = await UI.deploy(
      token.target,
      admin.address,
      tp.target,
      cf.target,
      oracle.address
    );
    await ins.waitForDeployment();

    // Now grant insurance role
    await cf.connect(admin).grantInsuranceRole(ins.target);

    // Fund company
    const amount = ethers.parseUnits("2000", await token.decimals());
    await token.transfer(company.address, amount);
    await token.connect(company).approve(cf.target, amount);
    await cf.connect(company).fundCompany(amount);

    // Give user tokens for premium
    const u = ethers.parseUnits("200", await token.decimals());
    await token.transfer(user.address, u);
  });

  it("user buys policy", async function () {
    const premium = ethers.parseUnits("10", await token.decimals());
    const payout = ethers.parseUnits("100", await token.decimals());

    await token.connect(user).approve(ins.target, premium);

    await expect(
      ins.connect(user).buyPolicy(
        "AZ301",
        1,
        123, // bookingId
        60, // threshold
        premium,
        payout
      )
    ).to.emit(ins, "PolicyCreated");
  });

  it("oracle settles and pays out", async function () {
    const premium = ethers.parseUnits("10", await token.decimals());
    const payout = ethers.parseUnits("100", await token.decimals());

    await token.connect(user).approve(ins.target, premium);
    await ins.connect(user).buyPolicy("AZ301", 1, 123, 60, premium, payout);

    const before = await token.balanceOf(user.address);

    await expect(
      ins.connect(oracle).settlePolicy(1, 120) // delay >= threshold
    ).to.emit(ins, "PolicySettled");

    const after = await token.balanceOf(user.address);
    expect(after - before).to.equal(payout);
  });

  it("non-oracle cannot settle policy", async function () {
    await expect(
      ins.connect(user).settlePolicy(1, 120)
    ).to.be.reverted;
  });
});
