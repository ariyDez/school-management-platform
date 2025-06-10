// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SchoolCertificate
 * @dev A Soul-Bound Token (SBT) contract for issuing school achievement certificates.
 * This contract allows the owner (school) to issue certificates to students,
 * which cannot be transferred or approved for transfer.
 */
contract SchoolCertificate is ERC721, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256[]) private _studentCertificates;
    
    constructor(address initialOwner)
        ERC721("School Achievement Certificate", "SAC")
        Ownable(initialOwner)
    {}

    function issueCertificate(address student, string memory tokenURI_) public onlyOwner {
        uint256 tokenId = ++_nextTokenId;
        _safeMint(student, tokenId);
        _tokenURIs[tokenId] = tokenURI_;
        _studentCertificates[student].push(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        ownerOf(tokenId);
        return _tokenURIs[tokenId];
    }

    function getCertificatesByStudent(address student) public view returns (uint256[] memory) {
        return _studentCertificates[student];
    }
    
    // --- ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: Используем require(false, ...) ---
    function transferFrom(address, address, uint256) public virtual override {
        require(false, "SchoolCertificate: This is a Soul-Bound Token and cannot be transferred.");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public virtual override {
        require(false, "SchoolCertificate: This is a Soul-Bound Token and cannot be transferred.");
    }
    
    function approve(address, uint256) public virtual override {
        require(false, "SchoolCertificate: This is a Soul-Bound Token and cannot be approved.");
    }

    function setApprovalForAll(address, bool) public virtual override {
        require(false, "SchoolCertificate: This is a Soul-Bound Token and cannot be approved.");
    }
}