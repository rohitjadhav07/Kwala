const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Testing Mumbai connection...");
  
  try {
    const network = await ethers.provider.getNetwork();
    console.log("✅ Connected to network:", network.name, "Chain ID:", network.chainId);
    
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("✅ Latest block:", blockNumber);
    
    const [deployer] = await ethers.getSigners();
    console.log("✅ Deployer address:", deployer.address);
    
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("✅ Balance:", ethers.formatEther(balance), "MATIC");
    
    if (balance === 0n) {
      console.log("⚠️  Warning: No MATIC balance. Get testnet tokens from https://faucet.polygon.technology/");
    } else {
      console.log("✅ Ready to deploy!");
    }
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });