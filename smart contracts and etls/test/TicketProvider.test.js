const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketProvider", function () {
  let admin, company, user;
  let tp;

  beforeEach(async function () {
    [admin, company, user] = await ethers.getSigners();

    const TP = await ethers.getContractFactory("TicketProvider");
    tp = await TP.deploy(admin.address);
    await tp.waitForDeployment();

    // Admin registers company
    await tp.connect(admin).registerCompany(
      company.address,
      "Airline AZ",
      "ipfs://meta"
    );
  });

  it("company can register flight", async function () {
    const depTime = 1700000000;

    await expect(
      tp.connect(company).registerFlight("AZ101", depTime)
    ).to.emit(tp, "FlightRegistered");

    const info = await tp.getFlightInfo("AZ101");
    expect(info.exists).to.equal(true);
    expect(info.company).to.equal(company.address);
    expect(info.departureTime).to.equal(depTime);
  });

  it("reverts if non-company tries to register flight", async function () {
    await expect(
      tp.connect(user).registerFlight("AZ102", 1700000000)
    ).to.be.reverted;
  });
});
