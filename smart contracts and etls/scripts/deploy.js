const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer, oracle, treasury, ...testAccounts] = await hre.ethers.getSigners();

  console.log("Deployer:", deployer.address);
  console.log("Oracle:  ", oracle.address);
  console.log("Treasury:", treasury.address);

  // MockToken
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const token = await MockToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("MockToken:", tokenAddress);

  // TicketProvider
  const TicketProvider = await hre.ethers.getContractFactory("TicketProvider");
  const provider = await TicketProvider.deploy(deployer.address);
  await provider.waitForDeployment();
  const providerAddress = await provider.getAddress();
  console.log("TicketProvider:", providerAddress);

  // CompanyFunding
  const CompanyFunding = await hre.ethers.getContractFactory("CompanyFunding");
  const funding = await CompanyFunding.deploy(tokenAddress, deployer.address);
  await funding.waitForDeployment();
  const fundingAddress = await funding.getAddress();
  console.log("CompanyFunding:", fundingAddress);

  // TicketMarketplace
  const TicketMarketplace = await hre.ethers.getContractFactory("TicketMarketplace");
  const marketplace = await TicketMarketplace.deploy(
    tokenAddress,
    deployer.address,
    treasury.address,
    providerAddress
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("TicketMarketplace:", marketplaceAddress);

  // UserDelayInsurance
  const UserDelayInsurance = await hre.ethers.getContractFactory("UserDelayInsurance");
  const insurance = await UserDelayInsurance.deploy(
    tokenAddress,
    deployer.address,
    providerAddress,
    fundingAddress,
    oracle.address
  );
  await insurance.waitForDeployment();
  const insuranceAddress = await insurance.getAddress();
  console.log("UserDelayInsurance:", insuranceAddress);

  // Grant INSURANCE_ROLE
  const role = await funding.INSURANCE_ROLE();
  await funding.grantRole(role, insuranceAddress);
  console.log("✅ Granted INSURANCE_ROLE to UserDelayInsurance");

  // Save deployed addresses to JSON
  const deployedAddresses = {
    network: "localhost",
    chainId: 31337,
    rpcUrl: "http://127.0.0.1:8545",
    token: tokenAddress,
    ticketProvider: providerAddress,
    companyFunding: fundingAddress,
    ticketMarketplace: marketplaceAddress,
    userInsurance: insuranceAddress,
    deployer: deployer.address,
    oracle: oracle.address,
    treasury: treasury.address,
    deployedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, "..", "deployed_addresses.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("\n✅ Saved addresses to:", outputPath);

  // Fund test accounts with tokens (10,000 tokens each)
  console.log("\n🪙 Distributing tokens to test accounts...");
  const fundAmount = hre.ethers.parseEther("10000"); // 10,000 tokens

  for (let i = 0; i < Math.min(5, testAccounts.length); i++) {
    await token.transfer(testAccounts[i].address, fundAmount);
    console.log(`  ✅ Sent 10,000 tokens to ${testAccounts[i].address}`);
  }

  console.log("\n=== 🎉 DEPLOYMENT COMPLETE ===");
  console.log("Backend .env configuration:");
  console.log(`BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545`);
  console.log(`ORACLE_PRIVATE_KEY=${await oracle.provider.send("eth_accounts", []).then(a => a[1])}`);
  console.log("\nContracts ready for use!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
