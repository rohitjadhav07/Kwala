const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ChainQuest contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ChainQuest Character NFT contract
  console.log("\n📦 Deploying ChainQuestCharacter...");
  const ChainQuestCharacter = await ethers.getContractFactory("ChainQuestCharacter");
  const character = await ChainQuestCharacter.deploy();
  await character.waitForDeployment();
  console.log("✅ ChainQuestCharacter deployed to:", await character.getAddress());

  // Deploy Quest Manager contract
  console.log("\n📦 Deploying QuestManager...");
  const QuestManager = await ethers.getContractFactory("QuestManager");
  const questManager = await QuestManager.deploy(await character.getAddress());
  await questManager.waitForDeployment();
  console.log("✅ QuestManager deployed to:", await questManager.getAddress());

  // Deploy Tournament Manager contract
  console.log("\n📦 Deploying TournamentManager...");
  const TournamentManager = await ethers.getContractFactory("TournamentManager");
  const tournamentManager = await TournamentManager.deploy(await character.getAddress());
  await tournamentManager.waitForDeployment();
  console.log("✅ TournamentManager deployed to:", await tournamentManager.getAddress());

  // Authorize contracts to interact with Character NFT
  console.log("\n🔐 Setting up contract permissions...");
  await character.authorizeContract(await questManager.getAddress(), true);
  await character.authorizeContract(await tournamentManager.getAddress(), true);
  console.log("✅ Contract permissions configured");

  // Mint some initial characters for testing
  console.log("\n🎮 Minting test characters...");

  const characterClasses = [0, 1, 2]; // warrior, mage, rogue
  const classNames = ["warrior", "mage", "rogue"];
  const testURIs = [
    "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "https://ipfs.io/ipfs/QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm6nYV8h",
    "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
  ];

  // Get the minting fee
  const mintingFee = await character.mintingFee();
  console.log(`Minting fee: ${ethers.formatEther(mintingFee)} MATIC`);

  for (let i = 0; i < characterClasses.length; i++) {
    const stats = [50, 50, 50, 50]; // Default stats for testing
    const tx = await character.mintCharacter(
      deployer.address,
      testURIs[i],
      characterClasses[i],
      stats,
      { value: mintingFee }
    );
    await tx.wait();
    console.log(`✅ Minted ${classNames[i]} character (Token ID: ${i})`);
  }

  // Save deployment addresses
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: hre.network.name,
    chainId: Number(network.chainId),
    deployer: deployer.address,
    contracts: {
      ChainQuestCharacter: await character.getAddress(),
      QuestManager: await questManager.getAddress(),
      TournamentManager: await tournamentManager.getAddress()
    },
    deploymentTime: new Date().toISOString()
  };

  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(`Network: ${deploymentInfo.network} (Chain ID: ${deploymentInfo.chainId})`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`ChainQuestCharacter: ${deploymentInfo.contracts.ChainQuestCharacter}`);
  console.log(`QuestManager: ${deploymentInfo.contracts.QuestManager}`);
  console.log(`TournamentManager: ${deploymentInfo.contracts.TournamentManager}`);
  console.log("=".repeat(50));

  // Save to file for frontend integration
  const fs = require('fs');
  const path = require('path');

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log("\n🎉 Deployment completed successfully!");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify contracts on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${await character.getAddress()}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${await questManager.getAddress()} ${await character.getAddress()}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${await tournamentManager.getAddress()} ${await character.getAddress()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });