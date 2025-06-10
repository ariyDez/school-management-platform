## ⛓️ Blockchain (Certificate Verification System)

This module implements a blockchain-based system for issuing and verifying student achievement certificates. It's designed to provide a secure, immutable, and publicly verifiable record of accomplishments.

Each certificate is minted as a **Soul-Bound Token (SBT)**, a non-transferable NFT, ensuring that it remains permanently associated with the student it was issued to. The contract is built using modern, secure practices with OpenZeppelin libraries.

### Technology Stack

* **Solidity:** v0.8.28
* **Hardhat:** Development, testing, and deployment environment
* **Viem:** Modern, lightweight library for blockchain interaction
* **OpenZeppelin Contracts:** v5.0 for secure, standard implementations (ERC721, Ownable)
* **TypeScript:** For writing deployment scripts and tests

### Setup

1.  Navigate to the blockchain directory:
    ```bash
    cd blockchain
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```

### Usage & Deployment

The following commands should be run from within the `blockchain` directory.

**1. Compile the Smart Contract**

This will compile the Solidity code and generate typechain bindings for TypeScript.
```bash
npx hardhat compile
```

**2. Run a Local Blockchain Node**

You need a running node to deploy and interact with the contract. Open a dedicated terminal for this command.
```bash
npx hardhat node
```

**3. Deploy the Contract**

In a new, second terminal, run the deployment script. This will deploy the SchoolCertificate contract to the local node you just started.
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

**4. Run Tests**

To run the test suite for the smart contract:
```bash
npx hardhat test
```