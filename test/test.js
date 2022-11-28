const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const hre = require("hardhat");
// hre = hardhat runtime environment

describe("Testing ShameCoin contract", function () {
  async function deployShameCoinFixture(){
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    // Obtain the descriptor (ABI etc.) of the contract
    const ShameCoin = await hre.ethers.getContractFactory("ShameCoin");
    const shameCoin = await ShameCoin.deploy();
    // return contract address and private key of other account than owner
    //console.log(shameCoin);
    //console.log(owner);
    //console.log(otherAccount);
    return {shameCoin, owner, otherAccount};
  }

  //Tests start here
  it("Deployer is the admin", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    expect(await shameCoin.admin()).to.equal(owner.address);
  });

  it("Admin can send 1 shame coin at a time to another address", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await shameCoin.connect(owner).transfer(otherAccount.address, 1);
    expect (await shameCoin.balanceOf(otherAccount.address)).to.equal(1);
  });

  it("Admin can't send more than 1 shame coin at a time to another address", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await expect(shameCoin.connect(owner).transfer(otherAccount.address, 2)).to.be.revertedWith(
      "Amount can only be 1"
    );
  });

  it("If a non-admin tries to transfer a shame coin, it will instead increase their shame coin balance by 1", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await shameCoin.connect(otherAccount).transfer(owner.address, 1);
    expect (await shameCoin.balanceOf(otherAccount.address)).to.equal(1);
  });

  it("Non-admins can approve for the admin to spend 1 token on their behalf", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    expect (await shameCoin.connect(otherAccount).approve(owner.address, 1));
  });

  it("Non-admins can't approve for other non-admins to spend 1 token on their behalf", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await expect(shameCoin.connect(otherAccount).approve(otherAccount.address, 1)).to.be.revertedWith(
      "Spender can only be admin"
    );
  });

  it("Non-admins can't approve for the admin to spend any other number but 1 token on their behalf", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await expect(shameCoin.connect(otherAccount).approve(owner.address, 2)).to.be.revertedWith(
      "Amount can only be 1"
    );
  });

  it("transferFrom function just reduces the balance of the holder", async function() {
    const {shameCoin, owner, otherAccount} = await loadFixture(deployShameCoinFixture);
    await shameCoin.connect(owner).transfer(otherAccount.address, 1);
    await shameCoin.connect(otherAccount).approve(owner.address, 1);
    await shameCoin.connect(owner).transferFrom(otherAccount.address, owner.address, 1);
    expect (await shameCoin.balanceOf(otherAccount.address)).to.equal(0);  
  });
});