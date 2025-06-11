// backend/src/modules/certificates/certificates-router.js

const express = require("express");
const router = express.Router();
const certificatesController = require("./certificates-controller");

// Route for issuing a new certificate
// POST /api/v1/certificates/issue
router.post("/issue", certificatesController.handleIssueCertificate);

module.exports = { certificatesRoutes: router };