const hre = require("hardhat");

async function main() {

  const contract = await hre.ethers.deployContract("CosmicDragon");

  await contract.waitForDeployment();

  console.log(`Smart Contract "CosmicDragon" telah berhasil di-deploy!`);
  console.log(`Alamat Kontrak: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});