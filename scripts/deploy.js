const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ${deployer.address}');
  
  const balance = await deployer.getBalance();
  console.log('Account Balance: ${balance.toString()}');

  const ShameCoin = await hre.ethers.getContractFactory("ShameCoin");
  const shameCoin = await ShameCoin.deploy();

  console.log("Token deployed to:", shameCoin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
