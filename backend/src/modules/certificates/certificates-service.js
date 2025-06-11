const { ethers } = require("ethers");
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
const { db, env } = require("../../config");
const { ApiError } = require("../../utils");
const { createCertificateRecord } = require("./certificates-repository");

const abiPath = path.resolve(__dirname, "../../config/SchoolCertificate.json");
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const contractAbi = contractJson.abi;

const pinata = new pinataSDK(env.PINATA_API_KEY, env.PINATA_SECRET_KEY);

/**
 * Orchestrates the full process of issuing a certificate.
 * @param {object} certificateData - Data from the controller.
 * @returns {Promise<string>} - The transaction hash.
 */
async function issueCertificateService(certificateData) {
  const { studentId, studentWalletAddress, studentName, achievement } = certificateData;

  // Step 1: Upload metadata to IPFS
  const metadata = {
    name: `Certificate for ${studentName}`,
    description: `This certifies that ${studentName} has successfully completed: ${achievement}.`,
    achievement: achievement,
    issueDate: new Date().toISOString(),
  };
  const pinataResponse = await pinata.pinJSONToIPFS(metadata).catch(err => {
      throw new ApiError(500, "Failed to upload metadata to IPFS.");
  });
  const tokenURI = `ipfs://${pinataResponse.IpfsHash}`;

  // Step 2: Perform blockchain transaction
  const provider = new ethers.providers.JsonRpcProvider(env.RPC_PROVIDER_URL);
  const wallet = new ethers.Wallet(env.OWNER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(env.CONTRACT_ADDRESS, contractAbi, wallet);

  let tokenId;
  let txHash;
  try {
    const tx = await contract.issueCertificate(studentWalletAddress, tokenURI);
    const receipt = await tx.wait();
    txHash = receipt.transactionHash;
    
    const transferEvent = receipt.events?.find(e => e.event === 'Transfer');
    if (!transferEvent || !transferEvent.args) {
        throw new Error("Could not find Transfer event in transaction receipt.");
    }
    tokenId = transferEvent.args.tokenId;
  } catch (error) {
    console.error("Blockchain transaction failed:", error);
    throw new ApiError(500, "Blockchain transaction failed.");
  }
  
  // Step 3: Save record to our database
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await createCertificateRecord({
      student_id: studentId,
      token_id: Number(tokenId),
      ipfs_uri: tokenURI,
      transaction_hash: txHash,
    }, client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return txHash;
}

module.exports = { issueCertificateService };