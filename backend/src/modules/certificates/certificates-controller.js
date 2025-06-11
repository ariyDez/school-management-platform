// backend/src/modules/certificates/certificates-controller.js

const asyncHandler = require("express-async-handler");
const { issueCertificateService } = require("./certificates-service");

/**
 * Handles the request to issue a new certificate by calling the service layer.
 */
const handleIssueCertificate = asyncHandler(async (req, res) => {
  // 1. Extract necessary data from the request body.
  const { studentId, studentWalletAddress, studentName, achievement } = req.body;

  // 2. Prepare the payload for the service function.
  const certificateData = {
    studentId,
    studentWalletAddress,
    studentName,
    achievement,
  };

  // 3. Call the service to perform the core logic.
  const result = await issueCertificateService(certificateData);

  // 4. Send a success response with the transaction hash.
  res.status(201).json({
    message: "Certificate issued successfully!",
    transactionHash: result,
  });
});

module.exports = {
  handleIssueCertificate,
};