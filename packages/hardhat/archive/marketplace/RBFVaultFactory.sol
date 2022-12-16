// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./RBFVault.sol";
import "../CinchSafeGuard.sol";
import "./MarketPlaceStorage.sol";

/**
 * @title RBFVaultFactory
 * @notice Contract allows to create vaults which allows Lender to secure royalty revenue streams from a borrower(DAO/Protocols) and split payments between them based on agreed terms
 * @dev Should be deployed once for the app
 */
contract RBFVaultFactory is Ownable {
    event RBFVaultCreated(
        address indexed lender,
        address indexed borrower,
        address indexed vaultAddress
    );

    mapping(address => address[]) public borrowerVault;
    mapping(address => address[]) public lenderVault;

    /**
     *
     * @dev Create vault and configure the data for the vault
     *
     */
    function createVault(
        MarketPlaceStorage.MarketItem memory item,
        address underlyingToken
    ) internal returns (address) {
        // Deploy Cinch multi-sig guard
        //TODO - get function sig input during the listing of item so it can be set here in the guard
        CinchSafeGuard multiSigGuard = new CinchSafeGuard();

        // RBFVault vault = new RBFVault(
        //     item,
        //     address(multiSigGuard),
        //     underlyingToken
        // );
        // borrowerVault[item.seller].push(address(vault));
        // lenderVault[item.buyer].push(address(vault));

        // emit RBFVaultCreated(item.buyer, item.seller, address(vault));
        // return address(vault);
        return address(0);
    }

    function getlenderVaults(address lender)
        public
        view
        returns (address[] memory)
    {
        return lenderVault[lender];
    }

    function getBorrowerVaults(address borrower)
        public
        view
        returns (address[] memory)
    {
        return borrowerVault[borrower];
    }
}
