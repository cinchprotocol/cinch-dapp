// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RBFVault.sol";

/**
 * @title RBFVaultFactory
 * @notice Contract allows to create vaults which allows Lender to secure royalty revenue streams from a borrower(DAO/Protocols) and split payments between them based on agreed terms
 * @dev Should be deployed once for the app
 */
contract RBFVaultFactory is Ownable {
    event RBFVaultCreated(
        address indexed collectionAddress,
        address indexed vaultAddress
    );   

    mapping(address => address) public collectionVault;
    modifier collectionVaultDoesntExist(address collectionAddress) {
        require(
            collectionVault[collectionAddress] == address(0),
            "Vault for this collection already exist"
        );

        _;
    }

    modifier sharesIsValid(uint256 share) {
        require(share <= 100, "Investor shares can not be more than 100");
        require(share > 0, "Investor shares should be more than 0");
        _;
    }

    modifier isValidAddress(
        address collectionAddress,
        address collectionOwner,
        address investorAddress
    ) {
        require(
            collectionAddress != address(0),
            "Collection can not be the 0 address"
        );
        require(
            collectionOwner != address(0),
            "Collection owner can not be the 0 address"
        );

        require(
            investorAddress != address(0),
            "Investor can not be the 0 address"
        );

        require(
            collectionOwner != investorAddress,
            "Collection owner can not be the investor"
        );

        _;
    }

    /**
     *
     * @dev Create vault and configure the data for the vault
     * @param collectionAddress NFT collection's contract address
     * @param collectionOwner Address of collection Owner
     * @param investorAddress Address of Investor
     * @param investorShare Investor's share of the total revenue. Valid value 1-100
     *
     */
    function createVault(
        address collectionAddress,
        address collectionOwner,
        address investorAddress,
        uint256 investorShare
    )
        public
        payable
        collectionVaultDoesntExist(collectionAddress)
        isValidAddress(collectionAddress, collectionOwner, investorAddress)
        sharesIsValid(investorShare)
    {
        address[2] memory parties = [investorAddress, collectionOwner];
        uint256[2] memory shares = [investorShare, 100 - investorShare];
        RBFVault vault = new RBFVault{value: msg.value}(
            collectionAddress,
            parties,
            shares
        );
        collectionVault[collectionAddress] = address(vault);

        emit RBFVaultCreated(collectionAddress, address(vault));
    }   
}