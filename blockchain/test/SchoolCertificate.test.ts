import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SchoolCertificate", function () {
  async function deploySchoolCertificateFixture() {
    const [owner, student, otherAccount] = await hre.viem.getWalletClients();

    const schoolCertificate = await hre.viem.deployContract("SchoolCertificate", [
      owner.account.address,
    ]);

    return {
      schoolCertificate,
      owner,
      student,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { schoolCertificate } = await loadFixture(deploySchoolCertificateFixture);
      expect(await schoolCertificate.read.name()).to.equal("School Achievement Certificate");
      expect(await schoolCertificate.read.symbol()).to.equal("SAC");
    });

    it("Should set the deployer as the owner", async function () {
      const { schoolCertificate, owner } = await loadFixture(deploySchoolCertificateFixture);
      const contractOwner = await schoolCertificate.read.owner();
      expect(contractOwner.toLowerCase()).to.equal(owner.account.address.toLowerCase());
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow the owner to issue a certificate", async function () {
      const { schoolCertificate, student } = await loadFixture(deploySchoolCertificateFixture);
      const studentAddress = student.account.address;
      const tokenURI = "ipfs://somehash1";

      await schoolCertificate.write.issueCertificate([studentAddress, tokenURI]);
      expect(await schoolCertificate.read.balanceOf([studentAddress])).to.equal(1n);
      
      expect(await schoolCertificate.read.tokenURI([1n])).to.equal(tokenURI);
    });

    it("Should NOT allow another account to issue a certificate", async function () {
      const { schoolCertificate, student, otherAccount } = await loadFixture(deploySchoolCertificateFixture);
      
      await expect(
        schoolCertificate.write.issueCertificate([student.account.address, "ipfs://somehash2"], {
          account: otherAccount.account,
        })
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });

  describe("SBT Transfer Logic", function () {
    beforeEach(async function () {
      // Before each test, we issue a certificate to the student
      const { schoolCertificate, student } = await loadFixture(deploySchoolCertificateFixture);
      await schoolCertificate.write.issueCertificate([student.account.address, "ipfs://somesbt-hash"]);
    });

    it("Should NOT allow transfer of a certificate", async function () {
      const { schoolCertificate, student, otherAccount } = await loadFixture(deploySchoolCertificateFixture);
      
      await expect(
        schoolCertificate.write.transferFrom([student.account.address, otherAccount.account.address, 1n], {
          account: student.account,
        })
      ).to.be.rejectedWith("This is a Soul-Bound Token and cannot be transferred.");
    });

    it("Should NOT allow approving a certificate for transfer", async function () {
        const { schoolCertificate, student, otherAccount } = await loadFixture(deploySchoolCertificateFixture);
        
        await expect(
          schoolCertificate.write.approve([otherAccount.account.address, 1n], {
            account: student.account,
          })
        ).to.be.rejectedWith("This is a Soul-Bound Token and cannot be approved.");
    });
  });
});