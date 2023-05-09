const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

// Описание тестового сценария
describe("NFT", function () {
  let nftFactory, contract, maxSupply;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    nftFactory = await ethers.getContractFactory("NFT");
    contract = await nftFactory.deploy();
    maxSupply = await contract.maxSupply;
    await contract.deployed();
  });

  it("should allow mint first NFT", async function () {
    await contract
      .connect(user1)
      .safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
    const balance = await contract.balanceOf(user1.address);
    expect(balance).to.equal(1);
  });

  it("should allow mint second NFT", async function () {
    await contract
      .connect(user1)
      .safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
    const balance = await contract.balanceOf(user1.address);
    expect(balance).to.equal(1);
  });

  it("should allow mint third NFT", async function () {
    await contract
      .connect(user1)
      .safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
    const balance = await contract.balanceOf(user1.address);
    expect(balance).to.equal(1);
  });

  it("should allow mint fourth NFT", async function () {
    await contract
      .connect(user1)
      .safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
    const balance = await contract.balanceOf(user1.address);
    expect(balance).to.equal(1);
  });

  it("should allow mint last NFT", async function () {
    await contract
      .connect(user1)
      .safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
    const balance = await contract.balanceOf(user1.address);
    expect(balance).to.equal(1);
  });


   it("should not allow mint more than 5 NFTs of the same type", async function () {
     // Минтим 5 NFT одного типа (0 - й токен)
     for (let i = 0; i < maxSupply; i++) {
       await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
     }
    
     // Пытаемся минтить еще одну NFT
     await expect(
       contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") })
     ).to.be.revertedWith("You reached max supply");
   });

   it("should withdraw contract balance", async function () {
     await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") }); // покупка одной NFT
     const balanceBefore = await ethers.provider.getBalance(owner.address);
     await contract.connect(owner).withdraw();
     const balanceAfter = await ethers.provider.getBalance(owner.address);

     expect(balanceAfter).to.be.gt(balanceBefore);
   });

   it("should return the correct token URI for all token", async function () {
     // Mint a new NFT with token ID 0
     await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });

     for (let i = 0; i < maxSupply; i++) {
        // Get the token URI for current token
        const tokenURI = await contract.tokenURI(i);
        await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });

        // Verify that the token URI is correct
        expect(tokenURI).to.equal(
          "ipfs://QmP6Quc47vSDrqkgz1XNaonJ7CHMskV3Lxu5vZmxfThvcj/" + i + ".json"
        );
     }
   });

   it("should revert if not called by owner", async function () {
     await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") }); // минт одну NFT
     await expect(contract.connect(user1).withdraw()).to.be.revertedWith(
       "Ownable: caller is not the owner"
     );
   });

   it("should not allow non-owners to change the base URI", async function () {
     const newBaseURI = "ipfs://QmP6Quc47vSDrqkgz1XNaonJ7CHMskV3Lxu5vZmxfThvcj/";
     await expect(
       contract.connect(user1).changeBaseURI(newBaseURI)
     ).to.be.revertedWith("Ownable: caller is not the owner");
   });

   it("should be changed by owner", async function () {
     const newBaseURI = "ipfs://QmP6Quc47vSDrqkgz1XNaonJ7CHMskV3Lxu5vZmxfThvcj/";
     await contract.safeMint(user1.address, { value: ethers.utils.parseEther("0.001") });
     await contract.changeBaseURI(newBaseURI);
     await contract.tokenURI(0).then((result) => {
       expect(result).to.be.eq(
         "ipfs://QmP6Quc47vSDrqkgz1XNaonJ7CHMskV3Lxu5vZmxfThvcj/0.json"
       );
     });
   });
});