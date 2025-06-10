import hre from "hardhat";

async function main() {
  console.log("Starting deployment and interaction script...");

  // 1. GET ACCOUNTS
  const [owner, student] = await hre.viem.getWalletClients();
  console.log(`Deployer (owner) address: ${owner.account.address}`);
  console.log(`Student address: ${student.account.address}`);

  // 2. DEPLOY THE CONTRACT
  console.log("\nDeploying SchoolCertificate contract...");
  const schoolCertificate = await hre.viem.deployContract("SchoolCertificate", [
    owner.account.address,
  ]);
  console.log(`Contract deployed successfully to address: ${schoolCertificate.address}`);

  // --- INTERACTION ---
  console.log("\n--- Starting Interaction ---");
  
  // 3. ISSUE A CERTIFICATE
  const studentAddress = student.account.address;
  const certificateURI = `ipfs://achievement-for-${studentAddress}`;
  console.log(`\nIssuing a certificate to student ${studentAddress}...`);

  const tx = await schoolCertificate.write.issueCertificate(
    [studentAddress, certificateURI],
    { account: owner.account }
  );
  
  const publicClient = await hre.viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("Certificate issued successfully! Transaction hash:", tx);

  // 4. VERIFY THE CERTIFICATE
  console.log(`\nFetching certificates for student ${studentAddress}...`);
  const studentCerts = await schoolCertificate.read.getCertificatesByStudent([
    studentAddress,
  ]);

  if (studentCerts.length > 0) {
    console.log(`Certificates found: ${studentCerts.length}`);
    for (const certId of studentCerts) {
      const uri = await schoolCertificate.read.tokenURI([certId]);
      console.log(`  - Certificate ID #${certId}: URI = ${uri}`);
    }
  } else {
    console.log("Error: No certificates found for the student after issuance.");
  }

  console.log("\n--- Script finished successfully! ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});