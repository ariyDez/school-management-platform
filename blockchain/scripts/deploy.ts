import hre from "hardhat";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();

  console.log(
    "Deploying contract with the account:",
    deployer.account.address
  );

  const schoolCertificate = await hre.viem.deployContract("SchoolCertificate", [
    deployer.account.address,
  ]);

  console.log(
    `SchoolCertificate contract deployed to ${schoolCertificate.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});