const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketMarketplace", function () {
  let admin, treasury, company, buyer;
  let token, tp, mp;

  beforeEach(async function () {
    [admin, treasury, company, buyer] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const TP = await ethers.getContractFactory("TicketProvider");
    tp = await TP.deploy(admin.address);
    await tp.waitForDeployment();

    await tp.connect(admin).registerCompany(
      company.address,
      "Airline AZ",
      "uri"
    );

    const MP = await ethers.getContractFactory("TicketMarketplace");
    mp = await MP.deploy(token.target, admin.address, treasury.address, tp.target);
    await mp.waitForDeployment();

    // Company funds buyer tokens for buying
    const bal = ethers.parseUnits("500", await token.decimals());
    await token.transfer(buyer.address, bal);

    // Company registers flight
    await tp.connect(company).registerFlight("AZ200", 1700000000);
  });

  it("buyer purchases ticket", async function () {
    const price = ethers.parseUnits("100", await token.decimals());
    await token.connect(buyer).approve(mp.target, price);

    const tx = await mp.connect(buyer).buyTicket("AZ200", price);
    await tx.wait();

    const ticket = await mp.tickets(1);
    expect(ticket.owner).to.equal(buyer.address);
  });

  it("reverts unknown flight", async function () {
    const price = ethers.parseUnits("100", await token.decimals());
    await token.connect(buyer).approve(mp.target, price);

    await expect(
      mp.connect(buyer).buyTicket("UNKNOWN", price)
    ).to.be.revertedWith("unknown flight");
  });
});
